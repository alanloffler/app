import { EditEventSheet } from "@calendar/components/sheets/EditEventSheet";
import { ViewEventSheet } from "@calendar/components/sheets/ViewEventSheet";

import { type Dispatch, type SetStateAction, useState } from "react";

import type { ICalendarEvent } from "@calendar/interfaces/calendar-event.interface";

interface IProps {
  event: ICalendarEvent | null;
  onRemoveEvent: () => Promise<void>;
  openSheet: boolean;
  setOpenSheet: Dispatch<SetStateAction<boolean>>;
}

export function ViewEvent({ event, onRemoveEvent, openSheet: openAddSheet, setOpenSheet: setOpenAddSheet }: IProps) {
  const [openEditSheet, setOpenEditSheet] = useState<boolean>(false);

  return (
    <>
      <ViewEventSheet
        event={event}
        open={openAddSheet}
        onRemoveEvent={onRemoveEvent}
        setOpen={setOpenAddSheet}
        setOpenEditSheet={setOpenEditSheet}
      />
      <EditEventSheet event={event} open={openEditSheet} setOpen={setOpenEditSheet} />
    </>
  );
}
