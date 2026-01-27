import { describe, it, expect } from "vitest";
import {
  calculateProfileCompleted,
  calculateCompletedJobsCount,
  calculateIsTopPro,
  calculateResponseTimeMinutes,
} from "../pro.calculations";
import { BookingStatus } from "@repo/domain";
import type { BookingEntity } from "@modules/booking/booking.repo";

describe("pro.calculations", () => {
  describe("calculateProfileCompleted", () => {
    it("should return true when both avatarUrl and bio are present", () => {
      expect(
        calculateProfileCompleted("https://example.com/avatar.jpg", "Test bio")
      ).toBe(true);
    });

    it("should return false when avatarUrl is missing", () => {
      expect(calculateProfileCompleted(null, "Test bio")).toBe(false);
      expect(calculateProfileCompleted(undefined, "Test bio")).toBe(false);
      expect(calculateProfileCompleted("", "Test bio")).toBe(false);
    });

    it("should return false when bio is missing", () => {
      expect(
        calculateProfileCompleted("https://example.com/avatar.jpg", null)
      ).toBe(false);
      expect(
        calculateProfileCompleted("https://example.com/avatar.jpg", undefined)
      ).toBe(false);
      expect(
        calculateProfileCompleted("https://example.com/avatar.jpg", "")
      ).toBe(false);
    });

    it("should return false when both are missing", () => {
      expect(calculateProfileCompleted(null, null)).toBe(false);
      expect(calculateProfileCompleted(undefined, undefined)).toBe(false);
      expect(calculateProfileCompleted(null, undefined)).toBe(false);
      expect(calculateProfileCompleted(undefined, null)).toBe(false);
    });

    it("should return false when avatarUrl is empty string", () => {
      expect(calculateProfileCompleted("", "Test bio")).toBe(false);
    });

    it("should return false when bio is empty string", () => {
      expect(
        calculateProfileCompleted("https://example.com/avatar.jpg", "")
      ).toBe(false);
    });
  });

  describe("calculateCompletedJobsCount", () => {
    it("should return 0 for empty bookings array", () => {
      expect(calculateCompletedJobsCount([])).toBe(0);
    });

    it("should count only completed bookings", () => {
      const bookings: BookingEntity[] = [
        {
          id: "booking-1",
          displayId: "B001",
          clientUserId: "client-1",
          proProfileId: "pro-1",
          category: "PLUMBING",
          status: BookingStatus.COMPLETED,
          scheduledAt: new Date(),
          hoursEstimate: 2,
          addressText: "123 Main St",
          isFirstBooking: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: "booking-2",
          displayId: "B002",
          clientUserId: "client-1",
          proProfileId: "pro-1",
          category: "PLUMBING",
          status: BookingStatus.PENDING,
          scheduledAt: new Date(),
          hoursEstimate: 2,
          addressText: "123 Main St",
          isFirstBooking: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: "booking-3",
          displayId: "B003",
          clientUserId: "client-1",
          proProfileId: "pro-1",
          category: "PLUMBING",
          status: BookingStatus.COMPLETED,
          scheduledAt: new Date(),
          hoursEstimate: 2,
          addressText: "123 Main St",
          isFirstBooking: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      expect(calculateCompletedJobsCount(bookings)).toBe(2);
    });

    it("should return 0 when no bookings are completed", () => {
      const bookings: BookingEntity[] = [
        {
          id: "booking-1",
          displayId: "B001",
          clientUserId: "client-1",
          proProfileId: "pro-1",
          category: "PLUMBING",
          status: BookingStatus.PENDING,
          scheduledAt: new Date(),
          hoursEstimate: 2,
          addressText: "123 Main St",
          isFirstBooking: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: "booking-2",
          displayId: "B002",
          clientUserId: "client-1",
          proProfileId: "pro-1",
          category: "PLUMBING",
          status: BookingStatus.ACCEPTED,
          scheduledAt: new Date(),
          hoursEstimate: 2,
          addressText: "123 Main St",
          isFirstBooking: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      expect(calculateCompletedJobsCount(bookings)).toBe(0);
    });

    it("should count all bookings when all are completed", () => {
      const bookings: BookingEntity[] = Array.from({ length: 5 }, (_, i) => ({
        id: `booking-${i}`,
        displayId: `B00${i}`,
        clientUserId: "client-1",
        proProfileId: "pro-1",
        category: "PLUMBING",
        status: BookingStatus.COMPLETED,
        scheduledAt: new Date(),
        hoursEstimate: 2,
        addressText: "123 Main St",
        isFirstBooking: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      }));

      expect(calculateCompletedJobsCount(bookings)).toBe(5);
    });
  });

  describe("calculateIsTopPro", () => {
    it("should return true when completedJobsCount is exactly 10", () => {
      expect(calculateIsTopPro(10)).toBe(true);
    });

    it("should return true when completedJobsCount is greater than 10", () => {
      expect(calculateIsTopPro(11)).toBe(true);
      expect(calculateIsTopPro(20)).toBe(true);
      expect(calculateIsTopPro(100)).toBe(true);
    });

    it("should return false when completedJobsCount is less than 10", () => {
      expect(calculateIsTopPro(9)).toBe(false);
      expect(calculateIsTopPro(5)).toBe(false);
      expect(calculateIsTopPro(1)).toBe(false);
      expect(calculateIsTopPro(0)).toBe(false);
    });

    it("should handle edge case at threshold", () => {
      expect(calculateIsTopPro(9)).toBe(false);
      expect(calculateIsTopPro(10)).toBe(true);
      expect(calculateIsTopPro(11)).toBe(true);
    });
  });

  describe("calculateResponseTimeMinutes", () => {
    it("should return null (not yet implemented)", () => {
      const bookings: BookingEntity[] = [
        {
          id: "booking-1",
          displayId: "B001",
          clientUserId: "client-1",
          proProfileId: "pro-1",
          category: "PLUMBING",
          status: BookingStatus.COMPLETED,
          scheduledAt: new Date(),
          hoursEstimate: 2,
          addressText: "123 Main St",
          isFirstBooking: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      expect(calculateResponseTimeMinutes(bookings)).toBeNull();
    });
  });
});
