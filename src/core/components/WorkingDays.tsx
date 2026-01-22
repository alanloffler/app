import { Checkbox } from "@components/ui/checkbox";
import { addDays, eachDayOfInterval, format, startOfWeek } from "date-fns";
import { es } from "date-fns/locale";

import { useEffect, useState } from "react";

export function WorkingDays({
  data,
}: {
  label: string;
  data: string[];
  handleWorkingDaysValues: (values: string[]) => void;
}) {
  const [selectedDays, setSelectedDays] = useState<number[]>([]);

  const firstDayOfCurrentWeek = startOfWeek(new Date(), { locale: es });
  const weekdays = eachDayOfInterval({
    start: firstDayOfCurrentWeek,
    end: addDays(firstDayOfCurrentWeek, 6),
  }).map((day) => format(day, "EE", { locale: es }));

  useEffect(() => {
    function handleResize(): void {
      const windowWidth: number = window.innerWidth;
      console.log(windowWidth);

      // if (windowWidth < 1140 && windowWidth >= 768) {
      //   setDays(range("ddd", i18n.resolvedLanguage).map((day) => day));
      // } else {
      //   setDays(range("dddd", i18n.resolvedLanguage).map((day) => day));
      // }
    }

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {}, [data]);

  function handleChecked(index: number, checked: string | boolean) {
    setSelectedDays((prev) => {
      if (checked) {
        return [...prev, index].sort((a, b) => a - b);
      } else {
        return prev.filter((day) => day !== index);
      }
    });
  }

  return (
    <div className="flex w-full flex-col space-y-3">
      <div className="flex flex-row justify-start space-x-3">
        {weekdays &&
          weekdays.map((_, index) => (
            <div key={index} className="flex flex-col items-center">
              <Checkbox onCheckedChange={(checked) => handleChecked(index, checked)} />
              <span className="text-xs font-normal uppercase">{weekdays[index]}</span>
            </div>
          ))}
      </div>
      <div>Selected: {selectedDays?.map((day) => String(day))}</div>
    </div>
  );
}
