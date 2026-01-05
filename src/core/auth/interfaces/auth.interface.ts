import type { TAuthType } from "@auth/interfaces/auth.type";

export interface ICredentials {
  email: string;
  password: string;
  type: TAuthType;
}

export interface ISignIn {
  id: string;
  email: string;
  role: string;
}
