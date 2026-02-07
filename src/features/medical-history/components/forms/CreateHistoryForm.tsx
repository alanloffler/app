import { Controller } from "react-hook-form";
import { Field, FieldError, FieldGroup, FieldLabel } from "@components/ui/field";
import { Input } from "@components/ui/input";

import type z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { createHistorySchema } from "@medical-history/schemas/create-history.schema";
import { Checkbox } from "@/core/components/ui/checkbox";

export function CreateHistoryForm() {
  const form = useForm<z.infer<typeof createHistorySchema>>({
    resolver: zodResolver(createHistorySchema),
    defaultValues: {
      businessId: "",
      comments: "",
      eventId: "",
      reason: "",
      recipe: false,
      userId: "",
    },
  });

  async function onSubmit(data: z.infer<typeof createHistorySchema>) {
    console.log(data);
  }

  return (
    <form className="grid grid-cols-1 gap-6" id="create-history" onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup className="grid grid-cols-1 gap-6">
        <Controller
          name="reason"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="reason">Título:</FieldLabel>
              <Input aria-invalid={fieldState.invalid} id="reason" {...field} />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="recipe"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="recipe">Receta:</FieldLabel>
              <Checkbox
                aria-invalid={fieldState.invalid}
                className="size-5!"
                checked={field.value}
                disabled={field.disabled}
                id="recipe"
                name={field.name}
                onBlur={field.onBlur}
                onCheckedChange={field.onChange}
                ref={field.ref}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>
      {/* <div>Diagnóstico:</div> */}
      {/* <div>Tratamiento</div> */}
      {/* <div>Receta:</div> */}
      {/* <div>Notas adicionales</div> */}
    </form>
  );
}
