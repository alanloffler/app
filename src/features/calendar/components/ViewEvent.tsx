import { BriefcaseMedical, CalendarDays, Clock, Smartphone } from "lucide-react";
import { Patients } from "@components/icons/Patients";
import { WhatsApp } from "@components/icons/WhatsApp";

import { Badge } from "@components/Badge";
import { Button } from "@components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@components/ui/sheet";

import type { Dispatch, SetStateAction } from "react";
import { es } from "date-fns/locale";
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
          <SheetDescription className="text-base">Detalles del turno seleccionado</SheetDescription>
        </SheetHeader>
        <div className="flex flex-col gap-6 p-4">
          <article className="flex flex-col gap-4 rounded-lg border p-4">
            <header className="flex justify-center">
              <h2 className="text-lg font-semibold">{event.title}</h2>
            </header>
            <ul className="flex flex-col gap-3">
              <li>
                <div className="flex items-center gap-3">
                  <BriefcaseMedical className="h-4.5 w-4.5 shrink-0" strokeWidth={1.5} />
                  {/* TODO: get professional data, must make entity @backend */}
                  <span>{event.professionalId}</span>
                </div>
              </li>
              <li>
                <div className="flex items-center gap-3">
                  <Patients className="h-5 w-5 shrink-0 -translate-x-px" />
                  <span>
                    {event.user.firstName} {event.user.lastName}
                  </span>
                  <Badge variant="id" size="small">
                    {event.user.ic}
                  </Badge>
                </div>
              </li>
              <li>
                <div className="flex items-center gap-3">
                  <CalendarDays className="h-4.5 w-4.5 shrink-0" strokeWidth={1.5} />
                  <span>{event.startDate && format(event.startDate, "dd 'de' MMMM 'de' yyyy", { locale: es })}</span>
                </div>
              </li>
              <li>
                <div className="flex items-center gap-3">
                  <Clock className="h-4.5 w-4.5 shrink-0" strokeWidth={1.5} />
                  <span>
                    {event.startDate && format(event.startDate, "HH':'mm", { locale: es }) + " - "}
                    {event.endDate && format(event.endDate, "HH':'mm", { locale: es })}
                  </span>
                </div>
              </li>

              <li>
                <div className="flex items-center gap-3">
                  <Smartphone className="h-4.5 w-4.5 shrink-0" strokeWidth={1.5} />
                  <span>{event.user.phoneNumber}</span>
                </div>
              </li>
            </ul>
            <footer className="flex justify-end">
              <Button onClick={() => console.log("Enviar recordatorio")} variant="outline">
                <WhatsApp className="h-3.5! w-3.5! text-green-600" />
                Enviar recordatorio
              </Button>
            </footer>
          </article>
        </div>
      </SheetContent>
    </Sheet>
  );
}
