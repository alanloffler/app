import type { IUserEvent } from "@calendar/interfaces/user-event.interface";

export interface IProfessionalEvent extends IUserEvent {
  registrationNumber: string;
}
