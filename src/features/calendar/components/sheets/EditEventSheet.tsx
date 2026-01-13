import { Button } from "@components/ui/button";
import { Calendar } from "@components/ui/calendar";
import { Controller } from "react-hook-form";
import { Field, FieldError, FieldGroup, FieldLabel } from "@components/ui/field";
import { HourGrid } from "@calendar/components/HourGrid";
import { Input } from "@components/ui/input";
import { Loader } from "@components/Loader";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@components/ui/sheet";
import { UserCombobox } from "@calendar/components/UserCombobox";

import type z from "zod";
import { addMinutes, format, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import { toast } from "sonner";
import { useEffect, useRef, useState, type Dispatch, type SetStateAction } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import type { ICalendarEvent } from "@calendar/interfaces/calendar-event.interface";
import { CalendarService } from "@calendar/services/calendar.service";
import { eventSchema } from "@calendar/schemas/event.schema";
import { useTryCatch } from "@core/hooks/useTryCatch";

// TODO: get config from backend
const config = {
  startHour: "07:00",
  endHour: "20:00",
  exceptions: { from: "12:00", to: "13:00" },
  slotDuration: "30",
};

interface IProps {
  event: ICalendarEvent | null;
  onCreateEvent: () => void;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

function getEventFormValues(event: ICalendarEvent): z.infer<typeof eventSchema> {
  return {
    startDate: format(
      typeof event.startDate === "string" ? parseISO(event.startDate) : event.startDate,
      "yyyy-MM-dd'T'HH:mm:ssXXX",
    ),
    title: event.title,
    userId: event.userId,
  };
}

export function EditEventSheet({ event, onCreateEvent, open, setOpen }: IProps) {
  const [month, setMonth] = useState<Date | undefined>(new Date());
  const closeRef = useRef<HTMLButtonElement>(null);
  const { isLoading: isUpdating, tryCatch: tryCatchUpdateEvent } = useTryCatch();

  const form = useForm<z.infer<typeof eventSchema>>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      startDate: "",
      title: "",
      userId: "",
    },
  });

  useEffect(() => {
    if (event) {
      form.reset(getEventFormValues(event));
    }
  }, [event, form]);

  async function onSubmit(data: z.infer<typeof eventSchema>): Promise<void> {
    if (!event) return;

    const startDate = parseISO(data.startDate);
    const endDate = addMinutes(startDate, Number(config.slotDuration));

    const transformedData = {
      ...data,
      endDate: format(endDate, "yyyy-MM-dd'T'HH:mm:ssXXX"),
      // TODO: handle professional with entity (todo at backend)
      professionalId: "d501e1ec-3861-449b-8a5e-55ad03e33053",
    };

    const [response, error] = await tryCatchUpdateEvent(CalendarService.update(event.id, transformedData));

    if (error) {
      toast.error(error.message);
      return;
    }

    if (response && response.statusCode === 200) {
      toast.success("Turno actualizado exitosamente");
      setOpen(false);
      onCreateEvent();
    }
  }

  return (
    <Sheet open={event !== null && open} onOpenChange={setOpen}>
      <SheetContent
        className="sm:min-w-[620px]"
        onOpenAutoFocus={(e) => {
          e.preventDefault();
          closeRef.current?.focus();
        }}
      >
        <SheetHeader className="pt-8">
          <SheetTitle className="text-lg">Edición del turno</SheetTitle>
          <SheetDescription className="text-base">Formulario para la edición del turno seleccionado</SheetDescription>
          <SheetClose ref={closeRef} />
        </SheetHeader>
        <form className="flex min-h-0 flex-col gap-6 p-4" id="create-event" onSubmit={form.handleSubmit(onSubmit)}>
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
          <FieldGroup>
            <Controller
              name="startDate"
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
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-5 md:grid-rows-1">
                    <Field
                      className="md:col-span-3"
                      data-invalid={isDateInvalid}
                      style={{ position: "relative", zIndex: 2 }}
                    >
                      <FieldLabel htmlFor="date">Fecha</FieldLabel>
                      <div className="flex-1">
                        <Calendar
                          aria-invalid={isDateInvalid}
                          className="aspect-square h-fit w-full"
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
                      </div>
                    </Field>
                    <Field
                      className="md:col-span-2"
                      data-invalid={isHourInvalid}
                      style={{ position: "relative", zIndex: 1 }}
                    >
                      <FieldLabel>Horario</FieldLabel>
                      <HourGrid form={form} config={config} isInvalid={isHourInvalid} />
                      {isHourInvalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  </div>
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
                if (event) form.reset(getEventFormValues(event));
                setOpen(false);
              }}
            >
              Cancelar
            </Button>
            <Button disabled={!form.formState.isDirty} form="create-event" type="submit" variant="default">
              {isUpdating ? <Loader color="white" text="Guardando" /> : "Guardar"}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
