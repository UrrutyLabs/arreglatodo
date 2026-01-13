import { injectable, inject } from "tsyringe";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { UserRepository } from "@modules/user/user.repo";
import type { ClientProfileService } from "@modules/user/clientProfile.service";
import { Role } from "@repo/domain";
import type { ClientSignupInput, ProSignupInput } from "@repo/domain";
import { TOKENS } from "@/server/container/tokens";

/**
 * Auth service
 * Contains business logic for authentication operations
 */
@injectable()
export class AuthService {
  private supabaseAdmin: SupabaseClient | null = null;

  constructor(
    @inject(TOKENS.UserRepository)
    private readonly userRepository: UserRepository,
    @inject(TOKENS.ClientProfileService)
    private readonly clientProfileService: ClientProfileService
  ) {}

  /**
   * Get Supabase admin client (lazy initialization)
   */
  private getSupabaseAdmin(): SupabaseClient {
    if (this.supabaseAdmin) {
      return this.supabaseAdmin;
    }

    const supabaseUrl = process.env.SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
      throw new Error(
        "Missing Supabase configuration: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set"
      );
    }

    this.supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    return this.supabaseAdmin;
  }

  /**
   * Sign up a new client user
   * Creates user in Supabase, User in DB, and ClientProfile atomically
   * Rolls back Supabase user if DB operations fail
   */
  async signupClient(input: ClientSignupInput): Promise<{
    userId: string;
    email: string;
  }> {
    const supabaseAdmin = this.getSupabaseAdmin();

    // 1. Create user in Supabase (email NOT confirmed)
    const { data: authData, error: authError } =
      await supabaseAdmin.auth.admin.createUser({
        email: input.email,
        password: input.password,
        email_confirm: false, // Requires email confirmation
      });

    if (authError || !authData.user) {
      throw new Error(authError?.message || "Failed to create user");
    }

    const supabaseUserId = authData.user.id;

    try {
      // 2. Create User in our DB
      const user = await this.userRepository.create(Role.CLIENT, supabaseUserId);

      // 3. Create ClientProfile with all provided data
      await this.clientProfileService.updateProfile(supabaseUserId, {
        email: input.email,
        firstName: input.firstName ?? null,
        lastName: input.lastName ?? null,
        phone: input.phone ?? null,
      });

      return {
        userId: user.id,
        email: input.email,
      };
    } catch (error) {
      // Rollback: Delete Supabase user if DB creation fails
      try {
        await supabaseAdmin.auth.admin.deleteUser(supabaseUserId);
      } catch (deleteError) {
        // Log but don't throw - original error is more important
        console.error("Failed to rollback Supabase user:", deleteError);
      }

      throw error;
    }
  }

  /**
   * Sign up a new pro user
   * Creates user in Supabase, User in DB with Role.PRO atomically
   * Rolls back Supabase user if DB operations fail
   * Note: ProProfile is created later during onboarding flow
   */
  async signupPro(input: ProSignupInput): Promise<{
    userId: string;
    email: string;
  }> {
    const supabaseAdmin = this.getSupabaseAdmin();

    // 1. Create user in Supabase (email NOT confirmed)
    const { data: authData, error: authError } =
      await supabaseAdmin.auth.admin.createUser({
        email: input.email,
        password: input.password,
        email_confirm: false, // Requires email confirmation
      });

    if (authError || !authData.user) {
      throw new Error(authError?.message || "Failed to create user");
    }

    const supabaseUserId = authData.user.id;

    try {
      // 2. Create User in our DB with PRO role
      const user = await this.userRepository.create(Role.PRO, supabaseUserId);

      // Note: ProProfile is NOT created here - it's created during onboarding
      // This keeps the signup flow simple and allows pros to complete their profile
      // in a separate onboarding step

      return {
        userId: user.id,
        email: input.email,
      };
    } catch (error) {
      // Rollback: Delete Supabase user if DB creation fails
      try {
        await supabaseAdmin.auth.admin.deleteUser(supabaseUserId);
      } catch (deleteError) {
        // Log but don't throw - original error is more important
        console.error("Failed to rollback Supabase user:", deleteError);
      }

      throw error;
    }
  }
}
