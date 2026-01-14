import { EditEventSheet } from "@calendar/components/sheets/EditEventSheet";
import { ViewEventSheet } from "@calendar/components/sheets/ViewEventSheet";

import { type Dispatch, type SetStateAction, useState } from "react";

import type { ICalendarEvent } from "@calendar/interfaces/calendar-event.interface";

interface IProps {
  event: ICalendarEvent | null;
  onRefresh: (keepOpen?: boolean) => Promise<void>;
  openSheet: boolean;
  setOpenSheet: Dispatch<SetStateAction<boolean>>;
}

export function ViewEvent({ event, onRefresh, openSheet, setOpenSheet }: IProps) {
  const [openEditSheet, setOpenEditSheet] = useState<boolean>(false);

  async function handleRemove(): Promise<void> {
    setOpenEditSheet(false);
    setOpenSheet(false);
    await onRefresh();
  }

  async function handleUpdate(): Promise<void> {
    setOpenEditSheet(false);
    await onRefresh(true);
  }

  return (
    <>
      <ViewEventSheet
        event={event}
        onRemoveEvent={handleRemove}
        open={openSheet}
        setOpen={setOpenSheet}
        setOpenEditSheet={setOpenEditSheet}
      />
      <EditEventSheet event={event} onUpdateEvent={handleUpdate} open={openEditSheet} setOpen={setOpenEditSheet} />
    </>
  );
}
