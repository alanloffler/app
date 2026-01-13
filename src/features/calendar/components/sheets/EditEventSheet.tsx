import type { Dispatch, SetStateAction } from "react";

import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@components/ui/sheet";

import type { ICalendarEvent } from "@calendar/interfaces/calendar-event.interface";

interface IProps {
  event: ICalendarEvent | null;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

export function EditEventSheet({ event, open, setOpen }: IProps) {
  return (
    <Sheet open={event !== null && open} onOpenChange={setOpen}>
      <SheetTrigger asChild></SheetTrigger>
      <SheetContent className="sm:min-w-[480px]" onFocus={(e) => e.preventDefault()}>
        <SheetHeader className="pt-8">
          <SheetTitle className="text-lg">Edición del turno</SheetTitle>
          <SheetDescription className="text-base">Formulario para la edición del turno seleccionado</SheetDescription>
        </SheetHeader>
        <div className="flex flex-col gap-6 p-4">{JSON.stringify(event, null, 2)}</div>
      </SheetContent>
    </Sheet>
  );
}
