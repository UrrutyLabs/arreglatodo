import type { Pro } from "@repo/domain";

/**
 * Determine availability hint based on availability slots
 * Returns "today", "tomorrow", or null
 */
export function getAvailabilityHint(
  availabilitySlots: Pro["availabilitySlots"],
  today: string
): "today" | "tomorrow" | null {
  if (!availabilitySlots || availabilitySlots.length === 0) {
    return null;
  }

  const now = new Date();
  const todayDate = new Date(today);
  const todayDayOfWeek = todayDate.getUTCDay();
  const tomorrowDayOfWeek = (todayDayOfWeek + 1) % 7;

  // Check if pro has availability today
  const hasTodayAvailability = availabilitySlots.some(
    (slot) => slot.dayOfWeek === todayDayOfWeek
  );

  if (hasTodayAvailability) {
    // Check if there are still available time slots today
    const todaySlots = availabilitySlots.filter(
      (slot) => slot.dayOfWeek === todayDayOfWeek
    );

    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTimeInMinutes = currentHour * 60 + currentMinute;

    // Check if any slot has a start time after current time (with 1 hour buffer)
    const hasFutureSlotToday = todaySlots.some((slot) => {
      const [slotHour, slotMinute] = slot.startTime.split(":").map(Number);
      const slotStartInMinutes = slotHour * 60 + slotMinute;
      return slotStartInMinutes > currentTimeInMinutes + 60; // 1 hour buffer
    });

    if (hasFutureSlotToday) {
      return "today";
    }
  }

  // Check if pro has availability tomorrow
  const hasTomorrowAvailability = availabilitySlots.some(
    (slot) => slot.dayOfWeek === tomorrowDayOfWeek
  );

  if (hasTomorrowAvailability) {
    return "tomorrow";
  }

  return null;
}
