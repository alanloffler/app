import type { IUserEvent } from "@calendar/interfaces/user-event.interface";

export interface ICalendarEvent {
  endDate: Date;
  id: number;
  professionalId: string;
  startDate: Date;
  title: string;
  user: IUserEvent;
  userId: string;
}
