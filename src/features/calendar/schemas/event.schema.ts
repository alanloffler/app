import z from "zod";

export const eventSchema = z.object({
  title: z.string().nonempty("El título es obligatorio"),
  userId: z.string().nonempty("El usuario es obligatorio"),
});
