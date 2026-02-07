import { CreateHistoryForm } from "@medical-history/components/forms/CreateHistoryForm";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@components/ui/sheet";

import type { Dispatch, SetStateAction } from "react";

import type { IUser } from "@users/interfaces/user.interface";

interface IProps {
  user: IUser;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

export function CreateHistorySheet({ user, open, setOpen }: IProps) {
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent className="sm:min-w-[480px]" onOpenAutoFocus={(e) => e.preventDefault()}>
        <SheetHeader className="pt-8">
          <SheetTitle className="text-lg">Agregar historia médica</SheetTitle>
          <SheetDescription className="text-base">
            Creación de historia para el paciente {user?.firstName} {user?.lastName}
          </SheetDescription>
        </SheetHeader>
        <div className="flex flex-col gap-6 p-4">
          <CreateHistoryForm />
        </div>
      </SheetContent>
    </Sheet>
  );
}
