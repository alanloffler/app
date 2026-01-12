import { AddEvent } from "@calendar/components/AddEvent";
import { DateHeader } from "@calendar/components/DateHeader";
import { Navigation } from "@calendar/components/Navigation";

import type { ToolbarProps } from "react-big-calendar";

import type { ICalendarEvent } from "@calendar/interfaces/calendar-event.interface";
import type { TView } from "@calendar/interfaces/calendar-view.type";
import { cn } from "@lib/utils";
import { useSidebar } from "@components/ui/sidebar";

interface IProps extends ToolbarProps<ICalendarEvent> {
  calendarView: TView;
  currentDate: Date;
  onCreateEvent: () => void;
}

export function Toolbar(props: IProps) {
  const { open } = useSidebar();

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-between gap-4 rounded-t-lg border border-b-0 p-6 lg:flex-row",
        open ? "md:flex-col" : "md:flex-row",
      )}
    >
      <DateHeader calendarView={props.calendarView} currentDate={props.currentDate} />
      <div className="flex items-center gap-3">
        <Navigation {...props} />
        <AddEvent onCreateEvent={props.onCreateEvent} />
      </div>
    </div>
  );
}
