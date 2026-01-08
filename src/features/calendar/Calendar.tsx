import "./styles/calendar.css";
import "react-big-calendar/lib/css/react-big-calendar.css";

import { Calendar as Schedule, dateFnsLocalizer } from "react-big-calendar";

import { es } from "date-fns/locale";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { useEffect, useState } from "react";

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState<string | null>(null);

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

  const events = [
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

  useEffect(() => {
    console.log(currentDate);
    const month = format(currentDate, "MMMM", { locale: es });
    setCurrentMonth(month);
  }, [currentDate]);

  return (
    <div className="myCustomHeight">
      <div>{currentMonth}</div>
      <Schedule
        className="calendar"
        culture="es-AR"
        defaultDate={new Date()}
        defaultView="month"
        endAccessor="end"
        events={events}
        localizer={localizer}
        messages={messages}
        startAccessor="start"
        style={{ height: 700 }}
        views={["month", "week", "day"]}
        onSelectEvent={(event) => {
          console.log(event);
        }}
        onNavigate={(date) => {
          setCurrentDate(date);
        }}
      />
    </div>
    //     selectable={true}
    // onSelectSlot={(date) => {
    //   console.log(date);
    //   setCurrentDate(date.start);
    // }}
  );
}
