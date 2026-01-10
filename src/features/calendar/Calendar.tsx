import "@calendar/styles/calendar.css";
import "react-big-calendar/lib/css/react-big-calendar.css";

import { Calendar as Schedule } from "react-big-calendar";
import { PageLoader } from "@components/PageLoader";
import { Toolbar } from "@calendar/components/Toolbar";

import type { ToolbarProps } from "react-big-calendar";
import { dateFnsLocalizer } from "react-big-calendar";
import { es } from "date-fns/locale";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { useCallback, useEffect, useState } from "react";

import type { ICalendarEvent } from "@calendar/interfaces/calendar-event.interface";
import { CalendarService } from "@calendar/services/calendar.service";
import { useTryCatch } from "@core/hooks/useTryCatch";

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [events, setEvents] = useState<ICalendarEvent[] | undefined>(undefined);
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

    if (error) console.log(error);
    if (response && response?.statusCode === 200) {
      setEvents(response.data);
    }
  }, [tryCatchEvents]);

  useEffect(() => {
    getAllEvents();
  }, [getAllEvents]);

  if (isLoadingEvents) return <PageLoader text="Cargando agenda" />;

  return (
    <Schedule
      className="calendar"
      components={{
        toolbar: (props: ToolbarProps<ICalendarEvent>) => <Toolbar {...props} currentDate={currentDate} />,
      }}
      culture="es-AR"
      defaultDate={new Date()}
      defaultView="month"
      endAccessor="end"
      events={events}
      localizer={localizer}
      messages={messages}
      onNavigate={(date) => {
        setCurrentDate(date);
      }}
      onSelectEvent={(event) => {
        console.log(event);
      }}
      startAccessor="start"
      style={{ height: 700 }}
      views={["month", "week", "day"]}
    />
  );
}
