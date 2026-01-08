import { es } from "date-fns/locale";
import { format, endOfMonth, startOfMonth, getWeekOfMonth } from "date-fns";
import { useMemo } from "react";

interface IProps {
  currentDate: Date;
}

export function DateHeader({ currentDate }: IProps) {
  const { month, monthShort, day, year, week, firstDay, lastDay } = useMemo(() => {
    return {
      day: format(currentDate, "d", { locale: es }),
      firstDay: format(startOfMonth(currentDate), "d", { locale: es }),
      lastDay: format(endOfMonth(currentDate), "d", { locale: es }),
      month: format(currentDate, "MMMM", { locale: es }),
      monthShort: format(currentDate, "MMM", { locale: es }),
      week: getWeekOfMonth(currentDate, { locale: es }),
      year: format(currentDate, "yyyy", { locale: es }),
    };
  }, [currentDate]);

  return (
    <div className="flex items-center gap-3">
      <div className="inline-flex min-w-16 flex-col items-center rounded-lg border">
        <span className="w-full rounded-t-lg bg-gray-50 px-2 py-1 text-center text-xs font-semibold text-gray-500 uppercase">
          {monthShort}
        </span>
        <span className="text-primary text-lg font-bold">{day}</span>
      </div>
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <span className="text-lg font-semibold text-gray-900 capitalize">
            {month} {year}
          </span>
          <div className="rounded-sm border px-1.5 py-0.5 text-xs font-medium text-gray-700">Semana {week}</div>
        </div>
        <div className="text-sm text-gray-600 capitalize">
          <span>{`${firstDay} ${monthShort} ${year} - ${lastDay} ${monthShort} ${year}`}</span>
        </div>
      </div>
    </div>
  );
}
