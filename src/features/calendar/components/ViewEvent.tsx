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
import { Loader } from "@components/Loader";
import { Protected } from "@auth/components/Protected";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@components/ui/sheet";

import { Activity, type Dispatch, type SetStateAction, useState } from "react";
import { es } from "date-fns/locale";
import { format } from "date-fns";
import { toast } from "sonner";

import type { ICalendarEvent } from "@calendar/interfaces/calendar-event.interface";
import { CalendarService } from "@calendar/services/calendar.service";
import { usePermission } from "@permissions/hooks/usePermission";
import { useTryCatch } from "@core/hooks/useTryCatch";

interface IProps {
  event: ICalendarEvent | null;
  openSheet: boolean;
  onRemoveEvent: () => Promise<void>;
  setOpenSheet: Dispatch<SetStateAction<boolean>>;
}

export function ViewEvent({ event, openSheet, onRemoveEvent, setOpenSheet }: IProps) {
  const [openRemoveDialog, setOpenRemoveDialog] = useState<boolean>(false);
  const hasPermissions = usePermission(["events-delete-hard", "events-update", "events-notify"], "some");
  const { isLoading: isRemoving, tryCatch: tryCatchRemoveEvent } = useTryCatch();

  if (!event) return null;

  function removeEventDialog(): void {
    setOpenRemoveDialog(true);
  }

  async function removeEvent(id: string): Promise<void> {
    const [response, error] = await tryCatchRemoveEvent(CalendarService.remove(id));

    if (error) {
      toast.error(error.message);
      return;
    }

    if (response && response.statusCode === 200) {
      toast.success("Turno eliminado");
      setOpenRemoveDialog(false);
      setOpenSheet(false);
      onRemoveEvent();
    }
  }

  return (
    <>
      <Sheet open={openSheet} onOpenChange={setOpenSheet}>
        <SheetTrigger asChild></SheetTrigger>
        <SheetContent className="sm:min-w-[480px]" onOpenAutoFocus={(e) => e.preventDefault()}>
          <SheetHeader className="pt-8">
            <SheetTitle className="text-lg">Detalles del turno</SheetTitle>
            <SheetDescription className="text-base">Detalles del turno seleccionado</SheetDescription>
          </SheetHeader>
          <div className="flex flex-col gap-6 p-4">
            <article className="flex flex-col rounded-lg border p-4">
              <header className="flex justify-center">
                <h2 className="text-base font-semibold md:text-lg">{event.title}</h2>
              </header>
              <ul className="mt-4 flex flex-col gap-3 text-sm md:text-base">
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
              <Activity mode={hasPermissions ? "visible" : "hidden"}>
                <footer className="mt-4 flex justify-end gap-3">
                  <Protected requiredPermission="events-delete-hard">
                    <Button className="hover:text-rose-500" onClick={removeEventDialog} size="icon" variant="outline">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </Protected>
                  <Protected requiredPermission="events-update">
                    <Button className="hover:text-green-500" size="icon" variant="outline" asChild>
                      <Link to={`/patient/${event.user.id}`}>
                        <FilePenLine className="h-4 w-4" />
                      </Link>
                    </Button>
                  </Protected>
                  <Protected requiredPermission="events-notify">
                    <Button
                      className="hover:text-green-600"
                      onClick={() => console.log("Enviar recordatorio")}
                      variant="outline"
                    >
                      <WhatsApp className="h-3.5! w-3.5!" />
                    </Button>
                  </Protected>
                </footer>
              </Activity>
            </article>
          </div>
        </SheetContent>
      </Sheet>
      <Dialog open={openRemoveDialog} onOpenChange={setOpenRemoveDialog}>
        <DialogContent className="gap-6 sm:min-w-[480px]" onOpenAutoFocus={(e) => e.preventDefault()}>
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
            <div className="mx-auto flex w-fit items-center gap-2 rounded-md border border-red-200 bg-red-100 p-2 text-sm text-red-600">
              <CircleX className="h-4 w-4" />
              Esta acción no se puede deshacer
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setOpenRemoveDialog(false)} variant="ghost">
              Cancelar
            </Button>
            <Button onClick={() => removeEvent(event.id)} variant="destructive">
              {isRemoving ? <Loader color="white" text="Eliminando" /> : "Eliminar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
