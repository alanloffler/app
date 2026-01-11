import { BriefcaseMedical, CalendarDays, CircleX, Clock, FilePenLine, Smartphone, Trash2 } from "lucide-react";
import { Patients } from "@components/icons/Patients";
import { WhatsApp } from "@components/icons/WhatsApp";

import { Badge } from "@components/Badge";
import { Button } from "@components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@components/ui/dialog";
import { Link } from "react-router";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@components/ui/sheet";

import { es } from "date-fns/locale";
import { format } from "date-fns";
import { type Dispatch, type SetStateAction, useState } from "react";

import type { ICalendarEvent } from "@calendar/interfaces/calendar-event.interface";

interface IProps {
  event: ICalendarEvent | null;
  openSheet: boolean;
  setOpenSheet: Dispatch<SetStateAction<boolean>>;
}

export function ViewEvent({ event, openSheet, setOpenSheet }: IProps) {
  const [openRemoveDialog, setOpenRemoveDialog] = useState<boolean>(false);
  if (!event) return null;

  function removeEventDialog(): void {
    setOpenRemoveDialog(true);
  }

  return (
    <>
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
                <h2 className="text-base font-semibold md:text-lg">{event.title}</h2>
              </header>
              <ul className="flex flex-col gap-3 text-sm md:text-base">
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
                    <span>{`${event.user.firstName} ${event.user.lastName}`}</span>
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
              <footer className="flex justify-end gap-3">
                <Button className="hover:text-rose-500" onClick={removeEventDialog} size="icon" variant="outline">
                  {/* <CalendarX2 className="h-4 w-4" /> */}
                  <Trash2 className="h-4 w-4" />
                </Button>
                <Button className="hover:text-green-500" size="icon" variant="outline" asChild>
                  <Link to={`/patient/${event.user.id}`}>
                    <FilePenLine className="h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  className="hover:text-green-600"
                  onClick={() => console.log("Enviar recordatorio")}
                  variant="outline"
                >
                  <WhatsApp className="h-3.5! w-3.5!" />
                </Button>
              </footer>
            </article>
          </div>
        </SheetContent>
      </Sheet>
      <Dialog open={openRemoveDialog} onOpenChange={setOpenRemoveDialog}>
        <DialogContent className="gap-6 sm:min-w-[480px]">
          <DialogHeader>
            <DialogTitle>Eliminar turno</DialogTitle>
            <DialogDescription>¿Seguro que deseas eliminar el turno?</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="flex flex-col gap-1">
              <p className="flex items-center gap-3">
                <Patients className="h-4.5 w-4.5 -translate-x-px" />
                {`${event.user.firstName} ${event.user.lastName}`}
              </p>
              <p className="flex items-center gap-3">
                <CalendarDays className="h-4 w-4" />
                {`El ${event.startDate && format(event.startDate, "dd 'de' MMMM 'de' yyyy", { locale: es })},
                  de ${event.startDate && format(event.startDate, "HH':'mm", { locale: es }) + " - "} 
                  ${event.endDate && format(event.endDate, "HH':'mm", { locale: es })}`}
              </p>
            </div>
            <div className="flex items-center gap-2 rounded-md border border-red-200 bg-red-100 p-2 text-sm text-red-600">
              <CircleX className="h-4 w-4" />
              Esta acción no se puede deshacer
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setOpenRemoveDialog(false)} variant="ghost">
              Cancelar
            </Button>
            <Button onClick={() => setOpenRemoveDialog(false)} variant="destructive">
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
