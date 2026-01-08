import { DateItem } from "@calendar/components/DateItem";
import { Navigation } from "@calendar/components/Navigation";

import type { ToolbarProps } from "react-big-calendar";

import type { CalendarEvent } from "@calendar/interfaces/calendar-event.interface";

interface IProps extends ToolbarProps<CalendarEvent> {
  currentDate: Date;
}

export function Toolbar(props: IProps) {
  return (
    <div className="flex items-center justify-between rounded-t-lg border border-b-0 p-6">
      <DateItem currentDate={props.currentDate} />
      <Navigation {...props} />
    </div>
  );
}
