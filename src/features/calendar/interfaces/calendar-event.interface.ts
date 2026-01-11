import type { IUserEvent } from "@calendar/interfaces/user-event.interface";

export interface ICalendarEvent {
  endDate: Date;
  id: number;
  resourceId: number;
  startDate: Date;
  title: string;
  user: IUserEvent;
  userId: string;
}
