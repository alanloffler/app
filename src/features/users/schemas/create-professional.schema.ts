import z from "zod";
import { userSchema } from "./users.schema";

export const createProfessionalSchema = userSchema.extend({
  password: z
    .string()
    .nonempty("La contraseña es obligatoria")
    .min(8, "La contraseña debe tener al menos 8 caracteres"),
  // userId:
  // licenseId:
  // specialties:
  // workingDays:
});
