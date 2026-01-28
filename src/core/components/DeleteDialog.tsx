import { CircleAlert } from "lucide-react";

import { Button } from "@components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@components/ui/dialog";
import { Loader } from "@components/Loader";

import type { Dispatch, ReactNode, SetStateAction } from "react";

interface IProps {
  alertMessage?: string;
  callback: () => void;
  children: ReactNode;
  description?: string;
  loader?: boolean;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  showAlert?: boolean;
  title: string;
}
export function DeleteDialog({
  alertMessage,
  callback,
  children,
  description,
  loader = false,
  open,
  setOpen,
  showAlert = false,
  title,
}: IProps) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="gap-6 sm:min-w-[480px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <div className="grid gap-4">
          <div className="flex flex-col gap-1">{children}</div>
          {showAlert && (
            <div className="mx-auto flex w-fit items-center gap-2 rounded-md border border-amber-300/70 bg-amber-200/70 p-2 text-sm font-medium text-pretty text-amber-600">
              <CircleAlert className="h-5 w-5 shrink-0" />
              {alertMessage ? alertMessage : "Esta acción es irreversible."}
            </div>
          )}
        </div>
        <DialogFooter>
          <Button onClick={() => setOpen(false)} variant="ghost">
            Cancelar
          </Button>
          <Button
            onClick={() => {
              callback();
              setOpen(false);
            }}
            variant="destructive"
          >
            {loader ? <Loader color="white" text="Eliminando" /> : "Eliminar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
