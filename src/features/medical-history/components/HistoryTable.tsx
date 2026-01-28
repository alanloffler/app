import { X, Check, FilePenLine, FileText, Trash2 } from "lucide-react";

import { Button } from "@components/ui/button";
import { Card } from "@components/ui/card";
import { DataTable } from "@components/data-table/DataTable";

import type { ColumnDef } from "@tanstack/react-table";
import { es } from "date-fns/locale";
import { format } from "date-fns";

import type { IMedicalHistory } from "@users/interfaces/medical-history.interface";
import { cn } from "@lib/utils";

interface IProps {
  data?: IMedicalHistory[];
}

export function HistoryTable({ data }: IProps) {
  if (!data) return null;

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "id",
      enableHiding: true,
      enableSorting: false,
      size: 80,
      header: () => <div className="text-center">ID</div>,
      cell: ({ row }) => <div className="flex justify-center">{row.original?.id?.slice(0, 5)}</div>,
    },
    {
      accessorKey: "createdAt",
      header: () => <div className="text-center">Fecha de atención</div>,
      cell: ({ row }) => <div className="text-center">{format(row.original?.createdAt, "P", { locale: es })}</div>,
    },
    {
      accessorKey: "type",
      header: () => <div>Tipo</div>,
    },
    {
      accessorKey: "reason",
      header: () => <div>Motivo</div>,
    },
    {
      accessorKey: "recipe",
      header: () => <div className="text-center">Receta</div>,
      cell: ({ row }) => (
        <div
          className={cn(
            "flex w-fit place-self-center rounded-full border bg-gray-200 p-0.5",
            row.original?.recipe
              ? "border-green-200 bg-green-100 text-green-500 dark:border-green-900/70 dark:bg-green-950"
              : "border-red-200 bg-red-100 text-red-500 dark:border-red-900/70 dark:bg-red-950",
          )}
        >
          {row.original?.recipe ? <Check className="size-3.5" /> : <X className="size-3.5" />}
        </div>
      ),
    },
    {
      id: "actions",
      minSize: 168,
      header: () => <div>Acciones</div>,
      cell: ({ row }) => (
        <div className="flex justify-start gap-1">
          <Button onClick={() => console.log(`Ver ${row.original.id}`)} size="icon-sm" variant="ghost">
            <FileText />
          </Button>
          <Button onClick={() => console.log(`Editar ${row.original.id}`)} size="icon-sm" variant="ghost">
            <FilePenLine />
          </Button>
          <Button onClick={() => console.log(`Eliminar ${row.original.id}`)} size="icon-sm" variant="ghost">
            <Trash2 />
          </Button>
        </div>
      ),
    },
  ];

  return data.length > 0 ? (
    <DataTable columns={columns} data={data} />
  ) : (
    <Card className="text-muted-foreground text-center">El paciente no posee historial médico</Card>
  );
}
