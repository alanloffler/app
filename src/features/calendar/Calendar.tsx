import "@calendar/styles/calendar.css";
import "react-big-calendar/lib/css/react-big-calendar.css";

import { Calendar as Schedule } from "react-big-calendar";
import { ErrorNotification } from "@components/notifications/ErrorNotification";
import { Loader } from "@components/Loader";
import { PageLoader } from "@components/PageLoader";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@components/ui/select";
import { Toolbar } from "@calendar/components/Toolbar";
import { ViewEvent } from "@calendar/components/ViewEvent";

import type { Event, ToolbarProps, View } from "react-big-calendar";
import { dateFnsLocalizer } from "react-big-calendar";
import { es } from "date-fns/locale";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { toast } from "sonner";
import { useCallback, useEffect, useState } from "react";

import type { ICalendarConfig } from "@calendar/interfaces/calendar-config.interface";
import type { ICalendarEvent } from "@calendar/interfaces/calendar-event.interface";
import type { IUser } from "@users/interfaces/user.interface";
import type { TView } from "@calendar/interfaces/calendar-view.type";
import { CalendarService } from "@calendar/services/calendar.service";
import { UsersService } from "@users/services/users.service";
import { cn } from "@lib/utils";
import { useCalendarStore } from "@calendar/stores/calendar.store";
import { usePermission } from "@permissions/hooks/usePermission";
import { useTryCatch } from "@core/hooks/useTryCatch";

// TODO: get config from backend
const config = {
  // startHour: "07:00",
  // endHour: "20:00",
  exceptions: { from: "12:00", to: "15:00" },
  // slotDuration: "30",
};

const locales = { "es-AR": es };

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const messages = {
  allDay: "Todo el día",
  previous: "Anterior",
  next: "Siguiente",
  today: "Hoy",
  month: "Mes",
  week: "Semana",
  day: "Día",
  agenda: "Agenda",
  date: "Fecha",
  time: "Hora",
  event: "Evento",
  noEventsInRange: "No hay eventos en este rango",
  showMore: (total: number) => `${total} más`,
};

function isLunchTime(date: Date): boolean {
  const from = parse(config.exceptions.from, "HH:mm", new Date());
  const to = parse(config.exceptions.to, "HH:mm", new Date());
  const hour = date.getHours();
  return hour >= from.getHours() && hour < to.getHours();
}

function slotPropGetter(date: Date) {
  if (isLunchTime(date)) {
    return { className: "rbc-slot-lunch" };
  }
  return {};
}

export default function Calendar() {
  const [calendarConfig, setCalendarConfig] = useState<ICalendarConfig | undefined>(undefined);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [errorNotification, setErrorNotification] = useState<boolean>(false);
  const [events, setEvents] = useState<ICalendarEvent[] | undefined>(undefined);
  const [openSheet, setOpenSheet] = useState<boolean>(false);
  const [professionals, setProfessionals] = useState<IUser[] | undefined>(undefined);
  const [selectedEvent, setSelectedEvent] = useState<ICalendarEvent | null>(null);
  const [selectedProfessional, setSelectedProfessional] = useState<IUser | undefined>(undefined);
  const canViewEvent = usePermission("events-view");
  const { isLoading: isLoadingEvents, tryCatch: tryCatchEvents } = useTryCatch();
  const { isLoading: isLoadingProfessional, tryCatch: tryCatchProfessional } = useTryCatch();
  const { isLoading: isLoadingProfessionals, tryCatch: tryCatchProfessionals } = useTryCatch();
  const { selectedDate, selectedView, setSelectedDate, setSelectedView } = useCalendarStore();

  const fetchProfessionals = useCallback(async () => {
    const [response, error] = await tryCatchProfessionals(UsersService.findAll("professional"));

    if (error) {
      toast.error(error.message);
      return;
    }

    if (response && response.statusCode === 200 && response.data) {
      setProfessionals(response.data);
    }
  }, [tryCatchProfessionals]);

  useEffect(() => {
    fetchProfessionals();
  }, [fetchProfessionals]);

  const getProfessional = useCallback(
    async (id: string): Promise<void> => {
      const [response, error] = await tryCatchProfessional(UsersService.findOne(id));

      if (error) {
        toast.error(error.message);
        return;
      }

      if (response && response.statusCode === 200 && response.data) {
        setErrorNotification(false);

        if (!response.data.professionalProfile) {
          const errMsg = "El profesional no tiene un perfil profesional";
          setErrorMessage(errMsg);
          setErrorNotification(true);
          return;
        }

        setSelectedProfessional(response.data);

        if (response.data.professionalProfile) {
          const maxHour = new Date();
          maxHour.setHours(
            parseInt(response.data.professionalProfile.endHour.slice(0, 2), 10),
            parseInt(response.data.professionalProfile.endHour.slice(3, 5), 10),
            0,
            0,
          );

          const minHour = new Date();
          minHour.setHours(
            parseInt(response.data.professionalProfile.startHour.slice(0, 2), 10),
            parseInt(response.data.professionalProfile.startHour.slice(3, 5), 10),
            0,
            0,
          );

          const step = Math.ceil(Number(response.data.professionalProfile.slotDuration));
          const timeSlots = Math.ceil(60 / step);

          setCalendarConfig({
            maxHour,
            minHour,
            step,
            timeSlots,
          });
        }
      }
    },
    [tryCatchProfessional],
  );

  const refreshEvents = useCallback(async () => {
    const [response, error] = await tryCatchEvents(CalendarService.findAll());

    if (error) {
      toast.error(error.message);
      setErrorMessage(error.message);
      setErrorNotification(true);
      return;
    }

    if (response && response?.statusCode === 200) {
      setEvents(response.data);
    }
  }, [tryCatchEvents]);

  useEffect(() => {
    refreshEvents();
  }, [refreshEvents]);

  const onView = useCallback(
    (view: View) => {
      if (view === "month") setSelectedDate(new Date());
      setSelectedView(view as TView);
    },
    [setSelectedDate, setSelectedView],
  );

  const onSelectEvent = useCallback((event: Event) => {
    setSelectedEvent(event as ICalendarEvent);
    setOpenSheet(true);
  }, []);

  if (isLoadingEvents) return <PageLoader text="Cargando agenda" />;

  return (
    <>
      <div className="flex flex-col gap-8">
        <div className="flex items-center gap-4">
          <Select
            disabled={!professionals}
            onValueChange={(professionalId) => {
              getProfessional(professionalId);
            }}
          >
            <SelectTrigger id="professionals">
              <SelectValue placeholder={isLoadingProfessionals ? "Cargando profesionales" : "Seleccione profesional"} />
            </SelectTrigger>
            <SelectContent>
              {professionals?.map((professional) => (
                <SelectItem key={professional.id} value={professional.id}>
                  {professional.firstName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {isLoadingProfessional && <Loader text="Cargando profesional" />}
          {isLoadingProfessionals && <Loader text="Cargando profesionales" />}
        </div>
        {errorNotification && <ErrorNotification message={errorMessage} tryAgain={false} />}
        {selectedProfessional && !errorNotification && (
          <Schedule
            className={cn("calendar", !canViewEvent && "[&_.rbc-event]:pointer-events-none")}
            components={{
              toolbar: (props: ToolbarProps<ICalendarEvent>) => (
                <Toolbar
                  {...props}
                  calendarView={props.view as TView}
                  currentDate={selectedDate}
                  onCreateEvent={refreshEvents}
                />
              ),
            }}
            culture="es-AR"
            date={selectedDate}
            endAccessor="endDate"
            events={events}
            formats={{
              eventTimeRangeFormat: (range) => format(range.start, "HH:mm"),
            }}
            key={selectedProfessional.id}
            localizer={localizer}
            max={calendarConfig?.maxHour}
            messages={messages}
            min={calendarConfig?.minHour}
            onNavigate={setSelectedDate}
            onSelectEvent={onSelectEvent}
            onView={onView}
            slotPropGetter={slotPropGetter}
            startAccessor="startDate"
            step={calendarConfig?.step}
            style={{ height: 700 }}
            timeslots={calendarConfig?.timeSlots}
            view={selectedView}
            views={["month", "week", "day"]}
          />
        )}
      </div>
      <ViewEvent event={selectedEvent} onRefresh={refreshEvents} openSheet={openSheet} setOpenSheet={setOpenSheet} />
    </>
  );
}
