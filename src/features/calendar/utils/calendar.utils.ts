import type { ICalendarConfig } from "@calendar/interfaces/calendar-config.interface";
import type { IProfessionalProfile } from "@users/interfaces/professional-profile.interface";

export function parseCalendarConfig(profile: IProfessionalProfile): ICalendarConfig {
  let dailyExceptionStart = undefined;
  let dailyExceptionEnd = undefined;

  if (profile.dailyExceptionStart && profile.dailyExceptionEnd) {
    dailyExceptionStart = new Date();
    dailyExceptionStart.setHours(
      parseInt(profile.dailyExceptionStart.slice(0, 2), 10),
      parseInt(profile.dailyExceptionStart.slice(3, 5), 10),
      0,
      0,
    );

    dailyExceptionEnd = new Date();
    dailyExceptionEnd.setHours(
      parseInt(profile.dailyExceptionEnd.slice(0, 2), 10),
      parseInt(profile.dailyExceptionEnd.slice(3, 5), 10),
      0,
      0,
    );
  }

  const startHour = new Date();
  startHour.setHours(parseInt(profile.startHour.slice(0, 2), 10), parseInt(profile.startHour.slice(3, 5), 10), 0, 0);

  const endHour = new Date();
  endHour.setHours(parseInt(profile.endHour.slice(0, 2), 10), parseInt(profile.endHour.slice(3, 5), 10), 0, 0);

  const step = Math.ceil(Number(profile.slotDuration));

  const timeSlots = Math.ceil(60 / step);

  const workingDays = profile.workingDays.map((day) => parseInt(day, 10));
  const excludedDays = [0, 1, 2, 3, 4, 5, 6].filter((day) => !workingDays.includes(day));

  return {
    dailyExceptionStart,
    dailyExceptionEnd,
    startHour,
    endHour,
    step,
    timeSlots,
    excludedDays,
  };
}

export function dailyExceptionRange(date: Date, dailyExceptionStart: Date, dailyExceptionEnd: Date): boolean {
  const hour = date.getHours();
  return hour >= dailyExceptionStart.getHours() && hour < dailyExceptionEnd.getHours();
}

export function createSlotPropGetter(calendarConfig: ICalendarConfig | null) {
  return (date: Date) => {
    if (!calendarConfig) return {};

    if (
      calendarConfig.dailyExceptionStart &&
      calendarConfig.dailyExceptionEnd &&
      dailyExceptionRange(date, calendarConfig.dailyExceptionStart, calendarConfig.dailyExceptionEnd)
    ) {
      return { className: "rbc-slot-lunch" };
    }

    return {};
  };
}
