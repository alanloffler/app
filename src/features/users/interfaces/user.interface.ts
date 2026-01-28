import type { IMedicalHistory } from "@users/interfaces/medical-history.interface";
import type { IProfessionalProfile } from "@users/interfaces/professional-profile.interface";
import type { IRole } from "@roles/interfaces/role.interface";

export interface IUser {
  createdAt: string;
  deletedAt?: string;
  email: string;
  firstName: string;
  ic: string;
  id: string;
  lastName: string;
  medicalHistory?: IMedicalHistory[];
  password?: string;
  phoneNumber: string;
  professionalProfile?: IProfessionalProfile;
  role: IRole;
  roleId: string;
  updatedAt: string;
  userName: string;
}
