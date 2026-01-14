import { EditEventSheet } from "@calendar/components/sheets/EditEventSheet";
import { ViewEventSheet } from "@calendar/components/sheets/ViewEventSheet";

import { type Dispatch, type SetStateAction, useState } from "react";

import type { ICalendarEvent } from "@calendar/interfaces/calendar-event.interface";

interface IProps {
  event: ICalendarEvent | null;
  onRefresh: () => Promise<void>;
  openSheet: boolean;
  setOpenSheet: Dispatch<SetStateAction<boolean>>;
}

export function ViewEvent({ event, onRefresh, openSheet, setOpenSheet }: IProps) {
  const [openEditSheet, setOpenEditSheet] = useState<boolean>(false);

  async function handleEventChange(): Promise<void> {
    setOpenEditSheet(false);
    setOpenSheet(false);
    await onRefresh();
  }

  return (
    <>
      <ViewEventSheet
        event={event}
        onRemoveEvent={handleEventChange}
        open={openSheet}
        setOpen={setOpenSheet}
        setOpenEditSheet={setOpenEditSheet}
      />
      <EditEventSheet event={event} onUpdateEvent={handleEventChange} open={openEditSheet} setOpen={setOpenEditSheet} />
    </>
  );
}
