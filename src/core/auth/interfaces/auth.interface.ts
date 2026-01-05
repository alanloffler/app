import type { TAuthType } from "@auth/interfaces/auth.type";

export interface ICredentials {
  email: string;
  password: string;
  type: TAuthType;
}

export interface ISignIn {
  email: string;
  id: string;
  role: string;
  roleId: string;
  type?: string;
}
