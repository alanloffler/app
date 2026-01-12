import { endOfMonth, endOfWeek, format, getWeekOfMonth, startOfMonth, startOfWeek } from "date-fns";
import { es } from "date-fns/locale";
import { useMemo } from "react";

import type { TView } from "@calendar/interfaces/calendar-view.type";

interface IProps {
  calendarView: TView;
  currentDate: Date;
}

export function DateHeader({ calendarView, currentDate }: IProps) {
  const { month, monthShort, day, dayString, year, week, firstDay, lastDay } = useMemo(() => {
    let _firstDay = "";
    let _lastDay = "";

    if (calendarView === "week") {
      _firstDay = format(startOfWeek(currentDate, { locale: es }), "d", { locale: es });
      _lastDay = format(endOfWeek(currentDate, { locale: es }), "d", { locale: es });
    } else if (calendarView === "month") {
      _firstDay = format(startOfMonth(currentDate), "d", { locale: es });
      _lastDay = format(endOfMonth(currentDate), "d", { locale: es });
    }

    return {
      day: format(currentDate, "d", { locale: es }),
      dayString: format(currentDate, "EEEE", { locale: es }),
      firstDay: _firstDay,
      lastDay: _lastDay,
      month: format(currentDate, "MMMM", { locale: es }),
      monthShort: format(currentDate, "MMM", { locale: es }),
      week: getWeekOfMonth(currentDate, { locale: es }),
      year: format(currentDate, "yyyy", { locale: es }),
    };
  }, [calendarView, currentDate]);

  return (
    <div className="flex items-center gap-3">
      <div className="inline-flex min-w-16 flex-col items-center rounded-lg border">
        <span className="bg-accent text-muted-foreground w-full rounded-t-lg px-2 py-1 text-center text-xs font-semibold uppercase">
          {monthShort}
        </span>
        <span className="text-primary text-lg font-bold">{day}</span>
      </div>
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <span className="text-foreground text-lg font-semibold capitalize">
            {month} {year}
          </span>
          <div className="text-muted-foreground rounded-sm border px-1.5 py-0.5 text-xs font-medium">Semana {week}</div>
        </div>
        {calendarView === "day" ? (
          <div className="text-muted-foreground text-sm capitalize">{dayString}</div>
        ) : (
          <div className="text-muted-foreground text-sm capitalize">
            <span>{`${firstDay} ${monthShort} ${year} - ${lastDay} ${monthShort} ${year}`}</span>
          </div>
        )}
      </div>
    </div>
  );
}
