import { Patients } from "@components/icons/Patients";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@components/ui/sheet";

import type { Dispatch, SetStateAction } from "react";
import { format } from "date-fns";

import type { ICalendarEvent } from "@calendar/interfaces/calendar-event.interface";

interface IProps {
  event: ICalendarEvent | null;
  openSheet: boolean;
  setOpenSheet: Dispatch<SetStateAction<boolean>>;
}

export function ViewEvent({ event, openSheet, setOpenSheet }: IProps) {
  if (!event) return null;

  return (
    <Sheet open={openSheet} onOpenChange={setOpenSheet}>
      <SheetTrigger asChild></SheetTrigger>
      <SheetContent className="sm:min-w-[480px]">
        <SheetHeader className="pt-8">
          <SheetTitle className="text-lg">Detalles del turno</SheetTitle>
          <SheetDescription className="text-base">Descripción del turno seleccionado</SheetDescription>
        </SheetHeader>
        <div className="flex flex-col gap-6 p-4">
          <article className="flex flex-col gap-2 rounded-lg border">
            <header className="flex justify-center">
              <h2>{event.title}</h2>
            </header>
            <ul>
              <li>
                <Patients />
                <span>
                  {event.user.firstName} {event.user.lastName}
                </span>
              </li>
            </ul>
          </article>
        </div>
      </SheetContent>
    </Sheet>
  );
}
