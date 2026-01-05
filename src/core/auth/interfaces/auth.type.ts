import { EAuthType } from "@auth/enums/auth-type.enum";

export type TAuthType = (typeof EAuthType)[keyof typeof EAuthType];
