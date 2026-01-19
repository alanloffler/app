import type { IUser } from "@users/interfaces/user.interface";

export interface IBusiness {
  city: string;
  companyName: string;
  country: string;
  createdAt: Date;
  deletedAt?: Date;
  description: string;
  email: string;
  id: string;
  name: string;
  phoneNumber: string;
  province: string;
  slug: string;
  taxId: string;
  tradeName: string;
  updatedAt: Date;
  users: IUser[];
  website?: string;
  whatsAppNumber?: string;
  zipCode: string;
  street: string;
}
