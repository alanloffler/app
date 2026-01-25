export interface IUserEvent {
  email: string;
  firstName: string;
  ic: string;
  id: string;
  lastName: string;
  phoneNumber: string;
  professionalProfile?: {
    professionalPrefix: string;
  };
  role: IUserRole;
}

interface IUserRole {
  name: string;
  value: string;
}
