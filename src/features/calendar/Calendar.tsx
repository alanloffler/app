import "@calendar/styles/calendar.css";
import "react-big-calendar/lib/css/react-big-calendar.css";

import { Calendar as Schedule } from "react-big-calendar";
import { Toolbar } from "@calendar/components/Toolbar";

import type { ToolbarProps } from "react-big-calendar";
import { es } from "date-fns/locale";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { useState } from "react";
import { dateFnsLocalizer } from "react-big-calendar";

import type { CalendarEvent } from "@calendar/interfaces/calendar-event.interface";

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());

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

  const events: CalendarEvent[] = [
    {
      id: 0,
      title: "Event 1",
      start: new Date("2026-01-07T10:00:00"),
      end: new Date("2026-01-07T10:30:00"),
      resourceId: 1,
    },
    {
      id: 1,
      title: "Event 2",
      start: new Date("2026-01-07T10:30:00"),
      end: new Date("2026-01-07T11:00:00"),
      resourceId: 2,
    },
    {
      id: 2,
      title: "Event 3",
      start: new Date("2026-01-08T10:00:00"),
      end: new Date("2026-01-08T10:30:00"),
      resourceId: 3,
    },
    {
      id: 3,
      title: "Event 4",
      start: new Date("2026-01-08T11:00:00"),
      end: new Date("2026-01-08T11:30:00"),
      resourceId: 4,
    },
    {
      id: 4,
      title: "Event 5",
      start: new Date("2026-01-08T11:30:00"),
      end: new Date("2026-01-08T12:00:00"),
      resourceId: 5,
    },
    {
      id: 5,
      title: "Event 6",
      start: new Date("2026-01-08T13:00:00"),
      end: new Date("2026-01-08T13:30:00"),
      resourceId: 6,
    },
  ];

  return (
    <Schedule
      className="calendar"
      components={{
        toolbar: (props: ToolbarProps<CalendarEvent>) => <Toolbar {...props} currentDate={currentDate} />,
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
