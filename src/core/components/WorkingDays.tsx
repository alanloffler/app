import { Checkbox } from "@components/ui/checkbox";

import { addDays, eachDayOfInterval, format, startOfWeek } from "date-fns";
import { es } from "date-fns/locale";

import { cn } from "@lib/utils";

interface IProps {
  "aria-invalid"?: boolean;
  disabled?: boolean;
  onChange?: (value: number[]) => void;
  value?: number[];
}

export function WorkingDays({ "aria-invalid": ariaInvalid, disabled, onChange, value = [] }: IProps) {
  const firstDayOfCurrentWeek = startOfWeek(new Date(), { locale: es });
  const weekdays = eachDayOfInterval({
    start: firstDayOfCurrentWeek,
    end: addDays(firstDayOfCurrentWeek, 6),
  }).map((day) => format(day, "EE", { locale: es }));

  function handleChecked(index: number, checked: "indeterminate" | boolean) {
    if (!onChange) return;

    if (checked === true) {
      onChange([...value, index].sort((a, b) => a - b));
    } else {
      onChange(value.filter((day) => day !== index));
    }
  }

  return (
    <div className={cn("flex justify-start gap-3 rounded-md p-1", ariaInvalid && "ring-destructive ring-2")}>
      {weekdays.map((dayLabel, index) => (
        <div key={index} className="flex flex-col items-center gap-1">
          <Checkbox
            aria-invalid={ariaInvalid}
            checked={value.includes(index)}
            disabled={disabled}
            onCheckedChange={(checked) => handleChecked(index, checked)}
          />
          <span className="text-xs font-normal uppercase">{dayLabel}</span>
        </div>
      ))}
    </div>
  );
}
