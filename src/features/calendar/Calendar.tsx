import "@calendar/styles/calendar.css";
import "react-big-calendar/lib/css/react-big-calendar.css";

import { Calendar as Schedule } from "react-big-calendar";
import { ErrorNotification } from "@components/notifications/ErrorNotification";
import { PageLoader } from "@components/PageLoader";
import { Toolbar } from "@calendar/components/Toolbar";
import { ViewEvent } from "@calendar/components/ViewEvent";

import type { ToolbarProps } from "react-big-calendar";
import { dateFnsLocalizer } from "react-big-calendar";
import { es } from "date-fns/locale";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { toast } from "sonner";
import { useCallback, useEffect, useState } from "react";

import type { ICalendarEvent } from "@calendar/interfaces/calendar-event.interface";
import type { TView } from "@calendar/interfaces/calendar-view.type";
import { CalendarService } from "@calendar/services/calendar.service";
import { cn } from "@lib/utils";
import { usePermission } from "@permissions/hooks/usePermission";
import { useTryCatch } from "@core/hooks/useTryCatch";

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [errorNotification, setErrorNotification] = useState<boolean>(false);
  const [events, setEvents] = useState<ICalendarEvent[] | undefined>(undefined);
  const [openSheet, setOpenSheet] = useState<boolean>(false);
  const [selectedEvent, setSelectedEvent] = useState<ICalendarEvent | null>(null);
  const canViewEvent = usePermission("events-view");
  const { isLoading: isLoadingEvents, tryCatch: tryCatchEvents } = useTryCatch();

  const locales = {
    "es-AR": es,
  };

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
    showMore: (total: number) => `${total} más...`,
  };

  const getAllEvents = useCallback(async () => {
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
    getAllEvents();
  }, [getAllEvents]);

  // TODO: get config from backend
  const config = {
    startHour: "07:00",
    endHour: "20:00",
    exceptions: { from: "12:00", to: "15:00" },
    slotDuration: "30",
  };

  const maxHour = new Date();
  maxHour.setHours(parseInt(config.endHour.slice(0, 2), 10), parseInt(config.endHour.slice(3, 5), 10), 0, 0);

  const minHour = new Date();
  minHour.setHours(parseInt(config.startHour.slice(0, 2), 10), parseInt(config.startHour.slice(3, 5), 10), 0, 0);

  const isLunchTime = (date: Date): boolean => {
    const from = parse(config.exceptions.from, "HH:mm", new Date());
    const to = parse(config.exceptions.to, "HH:mm", new Date());
    const hour = date.getHours();
    return hour >= from.getHours() && hour < to.getHours();
  };

  const slotPropGetter = (date: Date) => {
    if (isLunchTime(date)) {
      return {
        className: "rbc-slot-lunch",
      };
    }
    return {};
  };

  if (isLoadingEvents) return <PageLoader text="Cargando agenda" />;

  return (
    <>
      <div className="flex flex-col gap-8">
        {errorNotification && <ErrorNotification message={errorMessage} />}
        <Schedule
          className={cn("calendar", !canViewEvent && "[&_.rbc-event]:pointer-events-none")}
          components={{
            toolbar: (props: ToolbarProps<ICalendarEvent>) => (
              <Toolbar
                {...props}
                calendarView={props.view as TView}
                currentDate={currentDate}
                onCreateEvent={getAllEvents}
              />
            ),
          }}
          culture="es-AR"
          defaultDate={minHour}
          defaultView="day"
          endAccessor="endDate"
          events={events}
          localizer={localizer}
          max={maxHour}
          messages={messages}
          min={minHour}
          onNavigate={(date) => {
            setCurrentDate(date);
          }}
          onSelectEvent={(event) => {
            setSelectedEvent(event);
            setOpenSheet(true);
          }}
          slotPropGetter={slotPropGetter}
          startAccessor="startDate"
          style={{ height: 700 }}
          views={["month", "week", "day"]}
        />
      </div>
      <ViewEvent event={selectedEvent} openSheet={openSheet} setOpenSheet={setOpenSheet} onRemoveEvent={getAllEvents} />
    </>
  );
}
