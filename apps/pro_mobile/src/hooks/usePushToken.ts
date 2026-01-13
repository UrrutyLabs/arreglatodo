import { useEffect, useRef } from "react";
import { Alert } from "react-native";
import { trpc } from "../lib/trpc/client";
import { getExpoPushToken } from "../lib/push/getExpoPushToken";

/**
 * Hook to register push token after authentication
 * Guards against repeated calls using ref + last registered token
 */
export function usePushToken(sessionId: string | null) {
  const lastRegisteredTokenRef = useRef<string | null>(null);
  const lastSessionIdRef = useRef<string | null>(null);
  const hasShownPermissionDeniedRef = useRef(false);

  const registerTokenMutation = trpc.push.registerToken.useMutation({
    onError: (error) => {
      console.warn("Failed to register push token:", error);
    },
  });

  const unregisterTokenMutation = trpc.push.unregisterToken.useMutation({
    onError: (error) => {
      console.warn("Failed to unregister push token:", error);
    },
  });

  useEffect(() => {
    // Only register if we have a session and it's a new session
    if (!sessionId || sessionId === lastSessionIdRef.current) {
      return;
    }

    // Mark this session as processed
    lastSessionIdRef.current = sessionId;

    // Register push token
    const registerToken = async () => {
      const tokenData = await getExpoPushToken();

      if (!tokenData) {
        // Permission denied - show message once
        if (!hasShownPermissionDeniedRef.current) {
          hasShownPermissionDeniedRef.current = true;
          Alert.alert(
            "Notificaciones",
            "Activá notificaciones para recibir nuevas solicitudes más rápido.",
            [{ text: "OK" }],
            { cancelable: true }
          );
        }
        return;
      }

      // Only register if token changed
      if (tokenData.token === lastRegisteredTokenRef.current) {
        return;
      }

      try {
        await registerTokenMutation.mutateAsync({
          platform: tokenData.platform,
          token: tokenData.token,
        });
        lastRegisteredTokenRef.current = tokenData.token;
      } catch (error) {
        console.warn("Failed to register push token:", error);
      }
    };

    registerToken();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId]);

  return {
    unregisterToken: async (token: string) => {
      try {
        await unregisterTokenMutation.mutateAsync({ token });
        lastRegisteredTokenRef.current = null;
      } catch (error) {
        console.warn("Failed to unregister push token:", error);
      }
    },
  };
}
