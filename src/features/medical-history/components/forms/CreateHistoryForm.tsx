import { Button } from "@components/ui/button";
import { Checkbox } from "@components/ui/checkbox";
import { Controller } from "react-hook-form";
import { Field, FieldError, FieldGroup, FieldLabel } from "@components/ui/field";
import { Input } from "@components/ui/input";
import { Loader } from "@components/Loader";
import { Textarea } from "@components/ui/textarea";

import type z from "zod";
import type { Dispatch, SetStateAction } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import type { IUser } from "@users/interfaces/user.interface";
import { createHistorySchema } from "@medical-history/schemas/create-history.schema";

interface IProps {
  user: IUser;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

export function CreateHistoryForm({ user, setOpen }: IProps) {
  const form = useForm<z.infer<typeof createHistorySchema>>({
    resolver: zodResolver(createHistorySchema),
    defaultValues: {
      businessId: "",
      comments: "",
      eventId: undefined,
      reason: "",
      recipe: false,
      userId: "",
    },
  });

  console.log(user.id);
  console.log(user.businessId);
  form.setValue("userId", user.id);
  form.setValue("businessId", user.businessId);

  async function onSubmit(data: z.infer<typeof createHistorySchema>) {
    console.log(data);
  }

  function resetForm(): void {
    form.reset();
    setOpen(false);
  }

  return (
    <div className="flex flex-col gap-10">
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
          <Controller
            name="comments"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="comments">Comentarios:</FieldLabel>
                <Textarea aria-invalid={fieldState.invalid} className="min-h-50" id="comments" rows={28} {...field} />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
        </FieldGroup>
      </form>
      <div className="flex items-center justify-end gap-4">
        <Button variant="ghost" onClick={resetForm}>
          Cancelar
        </Button>
        <Button disabled={!form.formState.isDirty} form="create-history" type="submit" variant="default">
          {false ? <Loader color="white" text="Guardando" /> : "Guardar"}
        </Button>
      </div>
    </div>
  );
}
