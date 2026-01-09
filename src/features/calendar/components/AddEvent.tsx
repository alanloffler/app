import { Plus } from "lucide-react";

import { Button } from "@components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@components/ui/sheet";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/core/components/ui/field";
import { Input } from "@/core/components/ui/input";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type z from "zod";
import { eventSchema } from "../schemas/event.schema";
import { Loader } from "@/core/components/Loader";

export function AddEvent() {
  const form = useForm<z.infer<typeof eventSchema>>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: "",
    },
  });

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button>
          <Plus className="h-4 w-4" />
          Turno
        </Button>
      </SheetTrigger>
      <SheetContent className="sm:min-w-[500px]">
        <SheetHeader className="pt-8">
          <SheetTitle className="text-lg">Agregar turno a la agenda</SheetTitle>
          <SheetDescription className="text-base">
            Completá el formulario para agregar un turno a la agenda
          </SheetDescription>
          <form className="flex flex-col gap-6 pt-4" id="create-event">
            <FieldGroup className="grid grid-cols-3 gap-6">
              <Controller
                name="title"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid} className="col-span-2">
                    <FieldLabel htmlFor="title">Título del turno</FieldLabel>
                    <Input aria-invalid={fieldState.invalid} id="title" {...field} />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
            </FieldGroup>
            <FieldGroup>
              <Field className="col-span-2">
                <FieldLabel htmlFor="user">Paciente</FieldLabel>
              </Field>
            </FieldGroup>
            <FieldGroup>Día</FieldGroup>
            <FieldGroup>Hora de Inicio</FieldGroup>
            <FieldGroup>Hora de Fin</FieldGroup>
            <div className="flex justify-end gap-4 pt-8">
              <Button variant="ghost" onClick={() => form.reset()}>
                Cancelar
              </Button>
              <Button disabled={!form.formState.isDirty} form="create-event" type="submit" variant="default">
                {false ? <Loader color="white" text="Guardando" /> : "Guardar"}
              </Button>
            </div>
          </form>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
}
