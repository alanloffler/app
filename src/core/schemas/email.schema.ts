import z from "zod";

export const emailSchema = z.object({
  email: z.email("Email de formato inválido"),
});
