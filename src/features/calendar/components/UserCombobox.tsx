import { Check, ChevronsUpDown } from "lucide-react";

import { Button } from "@components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@components/ui/popover";

import { useCallback, useEffect, useState } from "react";

import type { IUser } from "@users/interfaces/user.interface";
import { UsersService } from "@users/services/users.service";
import { cn } from "@lib/utils";
import { useTryCatch } from "@core/hooks/useTryCatch";

interface IProps {
  "aria-invalid"?: boolean;
  id?: string;
  onChange?: (value: string) => void;
  value?: string;
}

export function UserCombobox({ "aria-invalid": ariaInvalid, id, onChange, value = "" }: IProps) {
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState<boolean>(false);
  const [users, setUsers] = useState<IUser[] | undefined>(undefined);
  const { isLoading, tryCatch } = useTryCatch();

  const findUsers = useCallback(async () => {
    const [response, error] = await tryCatch(UsersService.findAll());

    if (error) {
      setError("Error");
    }

    if (response && response?.statusCode === 200) {
      setUsers(response?.data);
    }
  }, [tryCatch]);

  useEffect(() => {
    findUsers();
  }, [findUsers]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          aria-expanded={open}
          aria-invalid={ariaInvalid}
          className={cn(
            "w-[200px] disabled:opacity-100",
            value || error || isLoading ? "justify-between" : "justify-end",
            error || ariaInvalid ? "text-destructive border-destructive" : "",
          )}
          disabled={isLoading || error !== null}
          id={id}
          role="combobox"
          variant="outline"
        >
          {isLoading && "Cargando..."}
          {error && "Error"}
          {value ? users?.find((user) => user.id === value)?.firstName : ""}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="" className="h-9" />
          <CommandList>
            <CommandEmpty>Sin resultados</CommandEmpty>
            <CommandGroup>
              {users?.map((user) => (
                <CommandItem
                  key={user.id}
                  value={user.id}
                  onSelect={(currentValue) => {
                    const newValue = currentValue === value ? "" : currentValue;
                    onChange?.(newValue);
                    setOpen(false);
                  }}
                >
                  {user.firstName} {user.lastName}
                  <Check className={cn("ml-auto", value === user.id ? "opacity-100" : "opacity-0")} />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
