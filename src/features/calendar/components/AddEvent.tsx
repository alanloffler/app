import { Plus } from "lucide-react";

import { Button } from "@components/ui/button";
import { Calendar } from "@components/ui/calendar";
import { Controller } from "react-hook-form";
import { Field, FieldError, FieldGroup, FieldLabel } from "@components/ui/field";
import { Input } from "@components/ui/input";
import { Loader } from "@components/Loader";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@components/ui/sheet";

import type z from "zod";
import { es } from "date-fns/locale";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";

import { eventSchema } from "@calendar/schemas/event.schema";

export function AddEvent() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [month, setMonth] = useState<Date | undefined>(new Date());

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
            <FieldGroup className="grid grid-cols-3 gap-6">
              <Field className="col-span-2">
                <FieldLabel>Fecha</FieldLabel>
                <Calendar
                  locale={es}
                  mode="single"
                  month={month}
                  onMonthChange={setMonth}
                  selected={date}
                  onSelect={setDate}
                  className="bg-transparent p-0"
                  disabled={[{ before: new Date() }, { dayOfWeek: [0, 3, 6] }]}
                />
                {date && <span>{format(date, "yyyy/MM/dd HH:mm", { locale: es })}</span>}
              </Field>
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
                        if (date) {
                          const newDate = new Date(date);
                          newDate.setHours(7);
                          newDate.setMinutes(0);
                          console.log(newDate);
                          setDate(newDate);
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
