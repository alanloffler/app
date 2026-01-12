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
  width?: string;
  id?: string;
  onChange?: (value: string) => void;
  value?: string;
}

export function UserCombobox({ "aria-invalid": ariaInvalid, width, id, onChange, value = "" }: IProps) {
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

  function getSelectedUser(value: string): string {
    const user = users?.find((user) => user.id === value);
    if (!users || !value || !user) return "";

    return `${user.firstName} ${user.lastName}`;
  }

  useEffect(() => {
    findUsers();
  }, [findUsers]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild className={cn(width ? width : "w-full")}>
        <Button
          aria-expanded={open}
          aria-invalid={ariaInvalid}
          className={cn(
            "font-normal disabled:opacity-100",
            value || error || isLoading ? "justify-between" : "justify-end",
            error || ariaInvalid ? "text-destructive border-destructive" : "",
          )}
          disabled={isLoading || error !== null}
          id={id}
          role="combobox"
          variant="outline"
        >
          {isLoading && "Cargando..."}
          {error || (ariaInvalid && "Error")}
          {value ? getSelectedUser(value) : ""}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className={cn("p-0", width ? width : "w-full")}>
        <Command>
          <CommandInput placeholder="" className="h-9" />
          <CommandList>
            <CommandEmpty>Sin resultados</CommandEmpty>
            <CommandGroup>
              {users?.map((user) => (
                <CommandItem
                  key={user.id}
                  keywords={[user.firstName, user.lastName]}
                  onSelect={(currentValue) => {
                    const newValue = currentValue === value ? "" : currentValue;
                    onChange?.(newValue);
                    setOpen(false);
                  }}
                  value={user.id}
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
