import z from "zod";

import { userSchema } from "@users/schemas/users.schema";

export const createUserSchema = userSchema.extend({
  password: z
    .string()
    .nonempty("La contraseña no puede estar vacía")
    .min(8, "La contraseña debe tener al menos 8 caracteres"),
});
