export interface ICalendarConfig {
  dailyExceptionEnd?: string;
  dailyExceptionStart?: string;
  endHour: Date;
  startHour: Date;
  step: number;
  timeSlots: number;
}
