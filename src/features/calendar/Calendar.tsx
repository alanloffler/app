import { Calendar as Schedule, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { es } from "date-fns/locale";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./styles/calendar.css";

export default function Calendar() {
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
    showMore: (total: number) => `+ Ver más (${total})`,
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
  ];

  return (
    <div className="myCustomHeight">
      <Schedule
        className="calendar"
        culture="es-AR"
        defaultDate={new Date()}
        defaultView="week"
        endAccessor="end"
        events={events}
        localizer={localizer}
        messages={messages}
        startAccessor="start"
        style={{ height: 700 }}
        views={["month", "week", "day"]}
      />
    </div>
  );
}
