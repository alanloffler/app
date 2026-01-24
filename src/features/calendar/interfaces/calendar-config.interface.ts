export interface ICalendarConfig {
  dailyExceptionEnd?: Date;
  dailyExceptionStart?: Date;
  endHour: Date;
  startHour: Date;
  step: number;
  timeSlots: number;
  excludedDays: number[];
}
