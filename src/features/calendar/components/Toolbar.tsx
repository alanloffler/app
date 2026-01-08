import { DateHeader } from "@calendar/components/DateHeader";
import { Navigation } from "@calendar/components/Navigation";

import type { ToolbarProps } from "react-big-calendar";

import type { CalendarEvent } from "@calendar/interfaces/calendar-event.interface";
import { cn } from "@/lib/utils";
import { useSidebar } from "@components/ui/sidebar";

interface IProps extends ToolbarProps<CalendarEvent> {
  currentDate: Date;
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
      <DateHeader currentDate={props.currentDate} />
      <Navigation {...props} />
    </div>
  );
}
