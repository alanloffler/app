import { Plus } from "lucide-react";

import { Button } from "@components/ui/button";
import { Calendar } from "@components/ui/calendar";
import { Controller } from "react-hook-form";
import { Field, FieldError, FieldGroup, FieldLabel } from "@components/ui/field";
import { Input } from "@components/ui/input";
import { Loader } from "@components/Loader";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@components/ui/sheet";
import { UserCombobox } from "@calendar/components/UserCombobox";

import type z from "zod";
import { es } from "date-fns/locale";
import { format, parseISO } from "date-fns";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { eventSchema } from "@calendar/schemas/event.schema";

export function AddEvent() {
  const [month, setMonth] = useState<Date | undefined>(new Date());
  const [openSheet, setOpenSheet] = useState<boolean>(false);

  const form = useForm<z.infer<typeof eventSchema>>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      date: "",
      title: "",
      userId: "",
    },
  });

  async function onSubmit(data: z.infer<typeof eventSchema>) {
    console.log(data);
  }

  useEffect(() => {
    if (openSheet === false) form.reset();
  }, [openSheet, form]);

  return (
    <Sheet open={openSheet} onOpenChange={setOpenSheet}>
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
          <form className="flex flex-col gap-6 pt-4" id="create-event" onSubmit={form.handleSubmit(onSubmit)}>
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
            <FieldGroup className="grid grid-cols-3 gap-6">
              <Controller
                name="userId"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field className="col-span-2" data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="userId">Usuario</FieldLabel>
                    <UserCombobox
                      aria-invalid={fieldState.invalid}
                      id="userId"
                      onChange={field.onChange}
                      value={field.value}
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
            </FieldGroup>
            <FieldGroup className="grid grid-cols-3 gap-6">
              <Controller
                name="date"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field className="col-span-2" data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="date">Fecha</FieldLabel>
                    <Calendar
                      aria-invalid={fieldState.invalid}
                      className="bg-transparent p-0"
                      disabled={[{ before: new Date() }, { dayOfWeek: [0, 3, 6] }]}
                      id="date"
                      locale={es}
                      mode="single"
                      month={month}
                      onMonthChange={setMonth}
                      onSelect={(date) => {
                        if (date) {
                          field.onChange(format(date, "yyyy-MM-dd'T'HH:mm:ss"));
                        } else {
                          field.onChange("");
                        }
                      }}
                      selected={field.value ? parseISO(field.value) : undefined}
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
              <Field>
                {/* TODO: dynamic comp */}
                <FieldLabel>Horario</FieldLabel>
                <div className="flex flex-col gap-3">
                  <div className="grid grid-cols-2 gap-1 text-sm">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.preventDefault();
                        const currentDate = form.getValues("date");
                        if (currentDate) {
                          const newDate = parseISO(currentDate);
                          newDate.setHours(7);
                          newDate.setMinutes(0);
                          form.setValue("date", format(newDate, "yyyy-MM-dd'T'HH:mm:ss"), { shouldDirty: true });
                        }
                      }}
                    >
                      07:00
                    </Button>
                    <Button variant="outline" size="sm">
                      07:30
                    </Button>
                    <Button variant="outline" size="sm">
                      08:00
                    </Button>
                    <Button variant="outline" size="sm">
                      08:30
                    </Button>
                    <Button variant="outline" size="sm">
                      09:00
                    </Button>
                    <Button variant="outline" size="sm">
                      09:30
                    </Button>
                    <Button variant="outline" size="sm">
                      10:00
                    </Button>
                    <Button variant="outline" size="sm">
                      10:30
                    </Button>
                    <Button variant="outline" size="sm">
                      11:00
                    </Button>
                    <Button variant="outline" size="sm">
                      11:30
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-1">
                    <Button variant="outline" size="sm">
                      15:00
                    </Button>
                    <Button variant="outline" size="sm">
                      15:30
                    </Button>
                    <Button variant="outline" size="sm">
                      16:00
                    </Button>
                    <Button variant="outline" size="sm">
                      16:30
                    </Button>
                    <Button variant="outline" size="sm">
                      17:00
                    </Button>
                    <Button variant="outline" size="sm">
                      17:30
                    </Button>
                    <Button variant="outline" size="sm">
                      18:00
                    </Button>
                    <Button variant="outline" size="sm">
                      18:30
                    </Button>
                    <Button variant="outline" size="sm">
                      19:00
                    </Button>
                    <Button variant="outline" size="sm">
                      19:30
                    </Button>
                  </div>
                </div>
              </Field>
            </FieldGroup>
            <div className="flex justify-end gap-4 pt-8">
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  form.clearErrors();
                  form.reset();
                  setOpenSheet(false);
                }}
              >
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
