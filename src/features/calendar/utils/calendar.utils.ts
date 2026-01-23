import { parse } from "date-fns";

import type { ICalendarConfig } from "@calendar/interfaces/calendar-config.interface";
import type { IProfessionalProfile } from "@users/interfaces/professional-profile.interface";

export function parseCalendarConfig(profile: IProfessionalProfile): ICalendarConfig {
  const maxHour = new Date();
  maxHour.setHours(parseInt(profile.endHour.slice(0, 2), 10), parseInt(profile.endHour.slice(3, 5), 10), 0, 0);

  const minHour = new Date();
  minHour.setHours(parseInt(profile.startHour.slice(0, 2), 10), parseInt(profile.startHour.slice(3, 5), 10), 0, 0);

  const step = Math.ceil(Number(profile.slotDuration));
  const timeSlots = Math.ceil(60 / step);

  return {
    dailyExceptionStart: profile.dailyExceptionStart,
    dailyExceptionEnd: profile.dailyExceptionEnd,
    maxHour,
    minHour,
    step,
    timeSlots,
  };
}

export function dailyExceptionRange(date: Date, dailyExceptionStart: string, dailyExceptionEnd: string): boolean {
  const from = parse(dailyExceptionStart, "HH:mm", new Date());
  const to = parse(dailyExceptionEnd, "HH:mm", new Date());
  const hour = date.getHours();

  return hour >= from.getHours() && hour < to.getHours();
}

export function createSlotPropGetter(calendarConfig: ICalendarConfig | undefined) {
  return (date: Date) => {
    if (!calendarConfig) return {};

    if (dailyExceptionRange(date, calendarConfig.dailyExceptionStart, calendarConfig.dailyExceptionEnd)) {
      return { className: "rbc-slot-lunch" };
    }

    return {};
  };
}
