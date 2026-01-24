import { AddEvent } from "@calendar/components/AddEvent";
import { DateHeader } from "@calendar/components/DateHeader";
import { Navigation } from "@calendar/components/Navigation";

import type { ToolbarProps } from "react-big-calendar";

import type { ICalendarConfig } from "@calendar/interfaces/calendar-config.interface";
import type { ICalendarEvent } from "@calendar/interfaces/calendar-event.interface";
import type { TView } from "@calendar/interfaces/calendar-view.type";
import { cn } from "@lib/utils";
import { useSidebar } from "@components/ui/sidebar";

interface IProps extends ToolbarProps<ICalendarEvent> {
  calendarConfig?: ICalendarConfig;
  calendarView: TView;
  currentDate: Date;
  onCreateEvent: () => void;
  selectedId?: string;
}

export function Toolbar(props: IProps) {
  const { open } = useSidebar();

  if (!props.calendarConfig) return null;

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-between gap-4 rounded-t-lg border border-b-0 p-6 lg:flex-row",
        open ? "md:flex-col" : "md:flex-row",
      )}
    >
      <DateHeader calendarView={props.calendarView} currentDate={props.currentDate} />
      <div className="flex flex-col items-center gap-3 md:flex-row">
        <Navigation {...props} />
        <AddEvent
          selectedId={props.selectedId}
          calendarConfig={props.calendarConfig}
          onCreateEvent={props.onCreateEvent}
        />
      </div>
    </div>
  );
}
