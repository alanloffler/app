import { CircleX } from "lucide-react";

import { Button } from "@components/ui/button";

interface IProps {
  message: string;
  tryAgain?: boolean;
}

export function ErrorNotification({ message, tryAgain = true }: IProps) {
  return (
    <div className="mx-auto flex w-fit flex-col items-center gap-3 rounded-lg border border-red-200 bg-red-100 p-3 text-sm font-medium text-red-500 md:flex-row">
      <div className="flex items-center gap-3">
        <CircleX className="h-5 w-5 shrink-0" />
        <p>{message}</p>
      </div>
      {tryAgain && (
        <Button onClick={() => window.location.reload()} size="sm" variant="destructive">
          Intentálo de nuevo
        </Button>
      )}
    </div>
  );
}
