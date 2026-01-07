import { Ban, Eye, FilePenLine, Plus, RotateCcw, Trash2 } from "lucide-react";

import { Badge } from "@components/Badge";
import { Button } from "@components/ui/button";
import { DataTable } from "@components/data-table/DataTable";
import { HoldButton } from "@components/ui/HoldButton";
import { Link } from "react-router";
import { PageHeader } from "@components/pages/PageHeader";
import { Protected } from "@auth/components/Protected";
import { SortableHeader } from "@components/data-table/SortableHeader";

import type { ColumnDef } from "@tanstack/react-table";
import { toast } from "sonner";
import { useCallback, useEffect, useState } from "react";

import type { IUser } from "@users/interfaces/user.interface";
import { ERoles } from "@auth/enums/role.enum";
import { UsersService } from "@users/services/users.service";
import { tryCatch } from "@core/utils/try-catch";
import { useAuthStore } from "@auth/stores/auth.store";
import { useSidebar } from "@components/ui/sidebar";
import { useTryCatch } from "@core/hooks/useTryCatch";

export default function Users() {
  const [users, setUsers] = useState<IUser[] | undefined>(undefined);
  const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean> | undefined>(undefined);
  const admin = useAuthStore((state) => state.admin);
  const { isLoading: isLoadingUsers, tryCatch: tryCatchAdmins } = useTryCatch();
  const { open: sidebarIsOpen } = useSidebar();

  const fetchUsers = useCallback(async () => {
    const isSuperAdmin = admin?.role.value === ERoles.SUPER;
    const serviceByRole = isSuperAdmin ? UsersService.findAllSoftRemoved() : UsersService.findAll();

    const [response, error] = await tryCatchAdmins(serviceByRole);

    if (error) {
      toast.error(error.message);
      return;
    }

    if (response && response.statusCode === 200) {
      setUsers(response.data);
    }
  }, [admin?.role.value, tryCatchAdmins]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  async function removeUser(id: string): Promise<void> {
    const [response, error] = await tryCatch(UsersService.softRemove(id));

    if (error) {
      toast.error(error.message);
      return;
    }

    if (response && response.statusCode === 200) {
      toast.success(response.message);
      fetchUsers();
    }
  }

  async function restoreUser(id: string) {
    const [response, error] = await tryCatch(UsersService.restore(id));

    if (error) {
      toast.error(error.message);

      return;
    }

    if (response && response.statusCode === 200) {
      toast.success(response.message);
      fetchUsers();
    }
  }

  async function hardRemoveUser(id: string): Promise<void> {
    const [response, error] = await tryCatch(UsersService.remove(id));

    if (error) {
      toast.error(error.message);
      return;
    }

    if (response && response.statusCode === 200) {
      toast.success(response.message);
      fetchUsers();
    }
  }

  useEffect(() => {
    function getColumnVisibility(width: number): Record<string, boolean> | undefined {
      if (width < 768) {
        return { id: false, ic: false, firstName: false, lastName: false, userName: false };
      }

      if (width < 1280) {
        return {
          id: !sidebarIsOpen,
          firstName: false,
          lastName: false,
          userName: !sidebarIsOpen,
        };
      }

      return undefined;
    }

    function handleResize() {
      setColumnVisibility(getColumnVisibility(window.innerWidth));
    }

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, [sidebarIsOpen]);

  const columns: ColumnDef<IUser>[] = [
    {
      accessorKey: "id",
      enableHiding: true,
      enableSorting: false,
      header: () => <div className="text-center">ID</div>,
      cell: ({ row }) => (
        <div className="flex justify-center">
          <Badge size="small" variant="id">
            {row.original?.id?.slice(0, 5)}
          </Badge>
        </div>
      ),
    },
    {
      accessorKey: "ic",
      enableHiding: true,
      header: ({ column }) => (
        <SortableHeader alignment="center" column={column}>
          DNI
        </SortableHeader>
      ),
      cell: ({ row }) => (
        <div className="flex justify-center">
          <Badge size="small" variant="ic">
            {row.original.ic}
          </Badge>
        </div>
      ),
    },
    {
      accessorKey: "userName",
      enableHiding: true,
      header: ({ column }) => <SortableHeader column={column}>Usuario</SortableHeader>,
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <span>{row.original.userName}</span>
          {row.original.deletedAt && <Ban className="h-4 w-4 text-rose-500" />}
        </div>
      ),
    },
    {
      accessorKey: "email",
      header: ({ column }) => <SortableHeader column={column}>Email</SortableHeader>,
    },
    {
      accessorKey: "firstName",
      enableHiding: true,
      header: ({ column }) => <SortableHeader column={column}>Nombre</SortableHeader>,
    },
    {
      accessorKey: "lastName",
      enableHiding: true,
      header: ({ column }) => <SortableHeader column={column}>Apellido</SortableHeader>,
    },
    {
      accessorKey: "role.name",
      header: ({ column }) => (
        <SortableHeader alignment="center" column={column}>
          Rol
        </SortableHeader>
      ),
      cell: ({ row }) => (
        <div className="flex justify-center">
          <Badge size="small" variant="role">
            {row.original.role?.name}
          </Badge>
        </div>
      ),
    },
    {
      id: "actions",
      minSize: 168,
      cell: ({ row }) => (
        <div className="flex justify-end gap-2">
          <Button className="px-5! hover:text-sky-500" variant="outline" asChild>
            <Link to={`/users/view/${row.original.id}`}>
              <Eye className="h-4 w-4" />
            </Link>
          </Button>
          {!row.original.deletedAt && (
            <Protected requiredPermission="users-update">
              <Button className="px-5! hover:text-green-500" variant="outline" asChild>
                <Link to={`/users/edit/${row.original.id}`}>
                  <FilePenLine className="h-4 w-4" />
                </Link>
              </Button>
            </Protected>
          )}
          {row.original.deletedAt ? (
            <Protected requiredPermission="users-restore">
              <HoldButton callback={() => restoreUser(row.original.id)} size="icon" type="restore" variant="outline">
                <RotateCcw className="h-4 w-4" />
              </HoldButton>
            </Protected>
          ) : (
            <>
              <Protected requiredPermission="users-delete">
                {admin && row.original.ic !== admin.ic && (
                  <HoldButton callback={() => removeUser(row.original.id)} size="icon" type="delete" variant="outline">
                    <Trash2 className="h-4 w-4" />
                  </HoldButton>
                )}
              </Protected>
              <Protected requiredPermission="users-delete-hard">
                {admin && row.original.ic !== admin.ic && (
                  <HoldButton
                    callback={() => hardRemoveUser(row.original.id)}
                    size="icon"
                    type="hard-delete"
                    variant="outline"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span>!</span>
                  </HoldButton>
                )}
              </Protected>
            </>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-8">
      <PageHeader title="Pacientes" subtitle="Gestioná los pacientes del sistema">
        <Protected requiredPermission="users-create">
          <Button variant="default" size="lg" asChild>
            <Link to="/users/create">
              <Plus />
              Crear paciente
            </Link>
          </Button>
        </Protected>
      </PageHeader>
      <DataTable
        columnVisibility={columnVisibility}
        columns={columns}
        data={users}
        defaultPageSize={10}
        defaultSorting={[{ id: "userName", desc: false }]}
        loading={isLoadingUsers}
        pageSizes={[5, 10, 20, 50]}
      />
    </div>
  );
}
