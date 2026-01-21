import z from "zod";

export const businessSchema = z.object({
  slug: z.string().nonempty("El slug es obligatorio").min(3, "El slug debe tener al menos 3 caracteres"),
  taxId: z.string().nonempty("El CUIT no puede estar vacío").length(11, "El CUIT debe tener 11 dígitos"),
  companyName: z
    .string()
    .nonempty("La razón social es obligatoria")
    .min(3, "La razón social debe tener al menos 3 caracteres")
    .max(50, "La razón social debe tener menos de 50 caracteres"),
  tradeName: z
    .string()
    .nonempty("El nombre comercial es obligatorio")
    .min(3, "El nombre comercial debe tener al menos 3 caracteres")
    .max(50, "El nombre comercial debe tener menos de 50 caracteres"),
  description: z.string().nonempty("La descripción es obligatoria"),
  street: z.string().nonempty("La calle es obligatoria"),
  city: z.string().nonempty("La ciudad es obligatoria"),
  province: z.string().nonempty("La provincia es obligatoria"),
  country: z.string().nonempty("El país es obligatorio"),
  zipCode: z.string().nonempty("El código postal es obligatorio"),
  email: z.email({ message: "Debes ingresar un email válido" }),
  phoneNumber: z.string().nonempty("El número de teléfono es obligatorio"),
  whatsAppNumber: z.string().optional(),
  website: z.string().optional(),
});
