export const ERoles = {
  admin: "administrador",
  patient: "paciente",
  professional: "profesional",
  super: "superadmin",
} as const;

export type TRole = (typeof ERoles)[keyof typeof ERoles];
