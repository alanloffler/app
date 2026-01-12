import z from "zod";

export const eventSchema = z.object({
  startDate: z
    .string()
    .nonempty("La fecha y horario son obligatorios")
    .refine(
      (val) => {
        if (!val) return false;
        const date = new Date(val);
        const hours = date.getHours();
        const minutes = date.getMinutes();
        return hours !== 0 || minutes !== 0;
      },
      { message: "Debe seleccionar un horario" },
    ),
  title: z.string().nonempty("El título es obligatorio").min(3, "El título debe tener al menos 3 caracteres"),
  userId: z.uuid("Formato de UUID inválido").nonempty("El paciente es obligatorio"),
});
