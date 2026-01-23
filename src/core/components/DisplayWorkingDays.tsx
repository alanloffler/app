import { addDays, eachDayOfInterval, format, startOfWeek } from "date-fns";
import { es } from "date-fns/locale";

import { uppercaseFirst } from "@core/formatters/uppercase-first.formatter";

interface IProps {
  days?: string[];
}

export function DisplayWorkingDays({ days }: IProps) {
  if (!days) return;

  const firstDayOfCurrentWeek = startOfWeek(new Date(), { locale: es });
  const weekdays = eachDayOfInterval({
    start: firstDayOfCurrentWeek,
    end: addDays(firstDayOfCurrentWeek, 6),
  }).map((day) => format(day, "EEEE", { locale: es }));

  const workingDays = days.map((d) => uppercaseFirst(weekdays[Number(d)]));

  return (
    <span className="inline-flex flex-wrap gap-1">
      {workingDays.map((d: string, idx: number) => (
        <span key={d} className="whitespace-nowrap">
          {d + (idx < workingDays.length - 1 ? "," : "")}
        </span>
      ))}
    </span>
  );
}
