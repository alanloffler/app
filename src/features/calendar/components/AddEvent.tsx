import { Plus } from "lucide-react";

import { Button } from "@components/ui/button";
import { Calendar } from "@components/ui/calendar";
import { Controller } from "react-hook-form";
import { Field, FieldError, FieldGroup, FieldLabel } from "@components/ui/field";
import { HourGrid } from "@calendar/components/HourGrid";
import { Input } from "@components/ui/input";
import { Loader } from "@components/Loader";
import { Protected } from "@auth/components/Protected";
import { ScrollArea } from "@components/ui/scroll-area";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@components/ui/sheet";
import { UserCombobox } from "@calendar/components/UserCombobox";

import type z from "zod";
import { addMinutes, format, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import type { ICalendarConfig } from "@calendar/interfaces/calendar-config.interface";
import { CalendarService } from "@calendar/services/calendar.service";
import { eventSchema } from "@calendar/schemas/event.schema";
import { useCalendarStore } from "@calendar/stores/calendar.store";
import { useTryCatch } from "@core/hooks/useTryCatch";

interface IProps {
  calendarConfig: ICalendarConfig;
  onCreateEvent: () => void;
}

export function AddEvent({ calendarConfig, onCreateEvent }: IProps) {
  const [month, setMonth] = useState<Date | undefined>(new Date());
  const [openSheet, setOpenSheet] = useState<boolean>(false);
  const { isLoading: isSaving, tryCatch: tryCatchCreateEvent } = useTryCatch();
  const { selectedProfessional } = useCalendarStore();
  const { selectedProfessionalConfig } = useCalendarStore();

  const form = useForm<z.infer<typeof eventSchema>>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      professionalId: "",
      startDate: format(new Date(), "yyyy-MM-dd'T'00:00:00XXX"),
      title: "",
      userId: "",
    },
  });

  async function onSubmit(data: z.infer<typeof eventSchema>): Promise<void> {
    const startDate = parseISO(data.startDate);
    const endDate = addMinutes(startDate, calendarConfig.step);

    const transformedData = {
      ...data,
      endDate: format(endDate, "yyyy-MM-dd'T'HH:mm:ssXXX"),
    };

    const [response, error] = await tryCatchCreateEvent(CalendarService.create(transformedData));

    if (error) {
      toast.error(error.message);
      return;
    }

    if (response && response.statusCode === 201) {
      toast.success("Turno creado exitosamente");
      setOpenSheet(false);
      onCreateEvent();
    }
  }

  useEffect(() => {
    if (openSheet === false) form.reset();
  }, [openSheet, form]);

  return (
    <Sheet open={openSheet} onOpenChange={setOpenSheet}>
      <Protected requiredPermission="events-create">
        <SheetTrigger asChild>
          <Button className="w-full md:w-auto">
            <Plus className="h-4 w-4" />
            Turno
          </Button>
        </SheetTrigger>
      </Protected>
      <SheetContent className="sm:min-w-[620px]">
        <SheetHeader className="pt-8">
          <SheetTitle className="text-lg">Agregar turno a la agenda</SheetTitle>
          <SheetDescription className="text-base">
            Completá el formulario para agregar un turno a la agenda
          </SheetDescription>
        </SheetHeader>
        <ScrollArea
          className="**:data-[slot='scroll-area-thumb']:bg-primary **:data-[slot='scroll-area-scrollbar']:bg-primary/20 min-h-0 flex-1"
          color="blue"
          type="auto"
        >
          <form className="flex min-h-0 flex-col gap-6 p-4" id="create-event" onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup className="grid grid-cols-3 gap-6">
              <Controller
                name="title"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid} className="col-span-3 md:col-span-2">
                    <FieldLabel htmlFor="title">Título del turno</FieldLabel>
                    <Input aria-invalid={fieldState.invalid} id="title" {...field} />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
            </FieldGroup>
            <FieldGroup className="grid grid-cols-6 gap-6">
              <Controller
                name="professionalId"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field className="col-span-6 md:col-span-3" data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="professionalId">Profesional</FieldLabel>
                    <UserCombobox
                      aria-invalid={fieldState.invalid}
                      defaultSelected={selectedProfessional?.id}
                      id="professionalId"
                      onChange={field.onChange}
                      userType="professional"
                      value={field.value}
                      width="w-full md:w-60!"
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
              <Controller
                name="userId"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field className="col-span-6 md:col-span-3" data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="userId">Usuario</FieldLabel>
                    {/* TODO: FORMAT INVALID CONTENT */}
                    <UserCombobox
                      aria-invalid={fieldState.invalid}
                      id="userId"
                      onChange={field.onChange}
                      value={field.value}
                      width="w-full md:w-60!"
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
                          {/* disabled={[{ before: new Date() }, { dayOfWeek: [0, 3, 6] }]} */}
                          {/* TODO: set to not selected day if the today day is not included in the working days */}
                          <Calendar
                            aria-invalid={isDateInvalid}
                            className="aspect-square h-fit w-full"
                            disabled={[
                              { dayOfWeek: selectedProfessionalConfig?.excludedDays as any },
                              { from: new Date() },
                            ]}
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
                        <HourGrid form={form} config={calendarConfig} isInvalid={isHourInvalid} />
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
                  form.reset();
                  setOpenSheet(false);
                }}
              >
                Cancelar
              </Button>
              <Button disabled={!form.formState.isDirty} form="create-event" type="submit" variant="default">
                {isSaving ? <Loader color="white" text="Guardando" /> : "Guardar"}
              </Button>
            </div>
          </form>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
