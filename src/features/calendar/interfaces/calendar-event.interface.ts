import type { IProfessionalEvent } from "@calendar/interfaces/professional-event.interface";
import type { IUserEvent } from "@calendar/interfaces/user-event.interface";

export interface ICalendarEvent {
  endDate: Date;
  id: string;
  professional: IProfessionalEvent;
  professionalId: string;
  startDate: Date;
  title: string;
  user: IUserEvent;
  userId: string;
}
