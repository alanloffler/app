import { ArrowLeft, ArrowRight } from "lucide-react";

import { Button } from "@components/ui/button";
import { ButtonGroup } from "@components/ui/button-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@components/ui/select";

import type { CalendarEvent } from "@calendar/interfaces/calendar-event.interface";
import type { ToolbarProps } from "react-big-calendar";

interface IProps extends ToolbarProps<CalendarEvent> {
  currentDate: Date;
}

type TView = "day" | "week" | "month";

export function Navigation(props: IProps) {
  function goToPrevious(): void {
    props.onNavigate("PREV");
  }

  function goToToday(): void {
    props.onNavigate("TODAY");
  }

  function goToNext(): void {
    props.onNavigate("NEXT");
  }

  function handleViewChange(value: string): void {
    props.onView(value as TView);
  }

  return (
    <div className="flex items-center gap-3">
      <ButtonGroup>
        <Button variant="outline" onClick={goToPrevious}>
          <ArrowLeft />
        </Button>
        <Button variant="outline" onClick={goToToday}>
          Hoy
        </Button>
        <Button variant="outline" onClick={goToNext}>
          <ArrowRight />
        </Button>
      </ButtonGroup>
      <Select value={props.view} onValueChange={handleViewChange}>
        <SelectTrigger className="text-foreground! min-w-36.5 text-sm font-medium" id="calendar-view">
          <SelectValue placeholder="Vista" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="day">Vista Diaria</SelectItem>
          <SelectItem value="week">Vista Semanal</SelectItem>
          <SelectItem value="month">Vista Mensual</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
