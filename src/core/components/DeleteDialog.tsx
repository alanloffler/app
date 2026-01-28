import { CircleX } from "lucide-react";

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
            <div className="mx-auto flex w-fit items-center gap-2 rounded-md border border-red-200 bg-red-100 p-2 text-sm text-red-600">
              <CircleX className="h-4 w-4" />
              Esta acción no se puede deshacer
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
