import z from "zod";

import { userSchema } from "@users/schemas/users.schema";

const hourSchema = z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Formato inválido");

export const createProfessionalSchema = userSchema.extend({
  password: z
    .string()
    .nonempty("La contraseña es obligatoria")
    .min(8, "La contraseña debe tener al menos 8 caracteres"),
  licenseId: z
    .string()
    .nonempty("La matrícula es obligatoria")
    .min(3, "La matrícula debe tener al menos 3 caracteres")
    .max(20, "La matrícula debe tener como máximo 20 caracteres"),
  professionalPrefix: z
    .string()
    .nonempty("El prefijo profesional es obligatorio")
    .min(3, "El prefijo profesional debe tener al menos 3 caracteres")
    .max(20, "El prefijo profesional debe tener como máximo 20 caracteres"),
  specialty: z
    .string()
    .nonempty("La especialidad es obligatoria")
    .min(3, "La especialidad debe tener al menos 3 caracteres")
    .max(20, "La especialidad debe tener como máximo 20 caracteres"),
  workingDays: z
    .any()
    .refine(Array.isArray, {
      message: "Los días laborales deben ser un array",
    })
    .pipe(
      z
        .array(
          z
            .any()
            .refine((val) => Number.isInteger(val), { message: "Cada día laboral debe ser un número entero" })
            .refine((val) => val >= 0, { message: "El día laboral mínimo es 0 (Domingo)" })
            .refine((val) => val <= 6, { message: "El día máximo es 6 (Sábado)" }),
        )
        .nonempty("Debes agregar al menos un día laboral"),
    ),
  maxHour: hourSchema,
  minHour: hourSchema,
  dailyExceptionStart: hourSchema,
  dailyExceptionEnd: hourSchema,
  slotDuration: z
    .string()
    .regex(/^\d+$/, "Debe ser un número")
    .refine(
      (v) => {
        const n = Number(v);
        return n >= 5 && n <= 120;
      },
      {
        message: "Entre 5 y 120",
      },
    ),
});
