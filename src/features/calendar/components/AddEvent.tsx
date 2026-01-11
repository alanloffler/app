import { Plus } from "lucide-react";

import { Button } from "@components/ui/button";
import { Calendar } from "@components/ui/calendar";
import { Controller } from "react-hook-form";
import { Field, FieldError, FieldGroup, FieldLabel } from "@components/ui/field";
import { HourGrid } from "@calendar/components/HourGrid";
import { Input } from "@components/ui/input";
// import { Loader } from "@components/Loader";
import { Protected } from "@auth/components/Protected";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@components/ui/sheet";
import { UserCombobox } from "@calendar/components/UserCombobox";

import type z from "zod";
import { es } from "date-fns/locale";
import { format, parseISO } from "date-fns";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { eventSchema } from "@calendar/schemas/event.schema";

// TODO: get config from backend
const config = {
  beginHour: "07:00",
  endHour: "20:00",
  exceptions: { from: "12:00", to: "13:00" },
  slotDuration: "30",
};

export function AddEvent() {
  const [month, setMonth] = useState<Date | undefined>(new Date());
  const [openSheet, setOpenSheet] = useState<boolean>(false);

  const form = useForm<z.infer<typeof eventSchema>>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      date: format(new Date(), "yyyy-MM-dd'T'00:00:00XXX"),
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
      <Protected requiredPermission="events-create">
        <SheetTrigger asChild>
          <Button>
            <Plus className="h-4 w-4" />
            Turno
          </Button>
        </SheetTrigger>
      </Protected>
      <SheetContent className="sm:min-w-[620px]" onOpenAutoFocus={(e) => e.preventDefault()}>
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
                  <Field className="col-span-3" data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="userId">Usuario</FieldLabel>
                    <UserCombobox
                      aria-invalid={fieldState.invalid}
                      id="userId"
                      onChange={field.onChange}
                      value={field.value}
                      width="w-[240px]!"
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
            </FieldGroup>
            <FieldGroup className="grid grid-cols-5 gap-6">
              <Controller
                name="date"
                control={form.control}
                render={({ field, fieldState }) => {
                  const hasDate = Boolean(field.value);
                  const hasValidHour =
                    hasDate &&
                    (() => {
                      const date = new Date(field.value);
                      return date.getHours() !== 0 || date.getMinutes() !== 0;
                    })();
                  const isDateInvalid = fieldState.invalid && !hasDate;
                  const isHourInvalid = fieldState.invalid && hasDate && !hasValidHour;

                  return (
                    <>
                      <Field className="col-span-3" data-invalid={isDateInvalid}>
                        <FieldLabel htmlFor="date">Fecha</FieldLabel>
                        <Calendar
                          aria-invalid={isDateInvalid}
                          className="bg-transparent p-0"
                          disabled={[{ before: new Date() }, { dayOfWeek: [0, 3, 6] }]}
                          id="date"
                          locale={es}
                          mode="single"
                          month={month}
                          onMonthChange={setMonth}
                          onSelect={(date) => {
                            field.onChange(date ? format(date, "yyyy-MM-dd'T'00:00:00XXX") : "");
                          }}
                          selected={field.value ? parseISO(field.value) : undefined}
                        />
                        {isDateInvalid && <FieldError errors={[{ message: "Debe seleccionar una fecha" }]} />}
                      </Field>
                      <Field className="col-span-2" data-invalid={isHourInvalid}>
                        <FieldLabel>Horario</FieldLabel>
                        <HourGrid form={form} config={config} isInvalid={isHourInvalid} />
                        {isHourInvalid && <FieldError errors={[fieldState.error]} />}
                      </Field>
                    </>
                  );
                }}
              />
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
                Guardar
                {/* {false ? <Loader color="white" text="Guardando" /> : "Guardar"} */}
              </Button>
            </div>
          </form>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
}
