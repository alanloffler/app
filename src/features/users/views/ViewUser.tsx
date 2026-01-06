import { FilePenLine, RotateCcw, Trash2 } from "lucide-react";

import { BackButton } from "@components/BackButton";
import { Button } from "@components/ui/button";
import { Badge } from "@components/Badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@components/ui/card";
import { CreatedAt } from "@components/CreatedAt";
import { HoldButton } from "@components/ui/HoldButton";
import { Link } from "react-router";
import { Loader } from "@components/Loader";
import { PageHeader } from "@components/pages/PageHeader";
import { Protected } from "@auth/components/Protected";

import { toast } from "sonner";
import { Activity, useCallback, useEffect, useState } from "react";
import { useParams } from "react-router";

import type { IUser } from "@users/interfaces/user.interface";
import { ERoles } from "@auth/enums/role.enum";
import { UsersService } from "@users/services/users.service";
import { useAuthStore } from "@auth/stores/auth.store";
import { usePermission } from "@permissions/hooks/usePermission";
import { useTryCatch } from "@core/hooks/useTryCatch";

export default function ViewAdmin() {
  const [user, setUser] = useState<IUser | undefined>(undefined);
  const adminAuth = useAuthStore((state) => state.admin);
  const hasPermissions = usePermission(["users-delete", "users-delete-hard", "users-restore", "users-update"], "some");
  const { id } = useParams();
  const { isLoading: isLoadingUser, tryCatch: tryCatchUser } = useTryCatch();

  const findOneUser = useCallback(
    async function (id: string) {
      const isSuperAdmin = adminAuth?.role.value === ERoles.SUPER;
      const serviceByRole = isSuperAdmin ? UsersService.findOneSoftRemoved(id) : UsersService.findOne(id);

      const [response, responseError] = await tryCatchUser(serviceByRole);

      if (responseError) {
        toast.error(responseError.message);
        return;
      }

      if (response && response.statusCode === 200) {
        setUser(response.data);
      }
    },
    [adminAuth?.role.value, tryCatchUser],
  );

  async function removeUser(id: string): Promise<void> {
    console.log(id);
    // const [response, error] = await tryCatch(AdminService.softRemove(id));
    //
    // if (error) {
    //   toast.error(error.message);
    //   return;
    // }
    //
    // if (response && response.statusCode === 200) {
    //   toast.success(response.message);
    //   findOneUser(id);
    // }
  }

  async function hardRemoveUser(id: string): Promise<void> {
    console.log(id);
    // const [response, error] = await tryCatch(AdminService.remove(id));
    //
    // if (error) {
    //   toast.error(error.message);
    //   return;
    // }
    //
    // if (response && response.statusCode === 200) {
    //   toast.success(response.message);
    //   navigate(-1);
    // }
  }

  async function restoreUser(id: string) {
    console.log(id);
    // const [response, error] = await tryCatch(AdminService.restore(id));
    //
    // if (error) {
    //   toast.error(error.message);
    //   return;
    // }
    //
    // if (response && response.statusCode === 200) {
    //   toast.success(response.message);
    //   findOneUser(id);
    // }
  }

  useEffect(() => {
    findOneUser(id!);
  }, [id, findOneUser]);

  return (
    <section className="flex flex-col gap-6">
      <PageHeader title="Detalles del paciente" />
      <Card className="relative w-full p-6 text-center md:max-w-100 md:p-10">
        {isLoadingUser ? (
          <div className="flex justify-center">
            <Loader size={20} text="Cargando paciente" />
          </div>
        ) : (
          <>
            <BackButton />
            <CardHeader>
              <CardTitle className="text-xl">{`${user?.firstName} ${user?.lastName}`}</CardTitle>
              <CardDescription className="text-base">{user?.role.name}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 space-y-6 px-0">
              <ul className="space-y-2">
                <li className="flex justify-between">
                  <span className="font-semibold">Paciente</span>
                  <span>{user?.userName}</span>
                </li>
                <li className="flex justify-between">
                  <span className="font-semibold">DNI</span>
                  <span>{user?.ic}</span>
                </li>
                <li className="flex justify-between">
                  <span className="font-semibold">E-mail</span>
                  <span>{user?.email}</span>
                </li>
                <li className="flex justify-between">
                  <span className="font-semibold">Teléfono</span>
                  <span>{user?.phoneNumber}</span>
                </li>
              </ul>
              <CreatedAt>{`Paciente desde el ${user && new Date(user.createdAt.split("T")[0]).toLocaleDateString()}`}</CreatedAt>
            </CardContent>
            <Activity mode={hasPermissions ? "visible" : "hidden"}>
              <CardFooter className="justify-end gap-3 px-0">
                {user?.deletedAt && user?.deletedAt !== null ? (
                  <div className="flex w-full items-center justify-between">
                    <Badge size="small" variant="red">
                      Eliminado
                    </Badge>
                    <HoldButton callback={() => id && restoreUser(id)} size="icon" type="restore" variant="outline">
                      <RotateCcw className="h-4 w-4" />
                    </HoldButton>
                  </div>
                ) : (
                  <>
                    <Protected requiredPermission="users-update">
                      <Button className="px-5! hover:text-green-500" variant="outline" asChild>
                        <Link to={`/users/edit/${id}`}>
                          <FilePenLine className="h-4 w-4" />
                        </Link>
                      </Button>
                    </Protected>
                    <Protected requiredPermission="users-delete">
                      <HoldButton callback={() => id && removeUser(id)} size="icon" type="delete" variant="outline">
                        <Trash2 className="h-4 w-4" />
                      </HoldButton>
                    </Protected>
                    <Protected requiredPermission="users-delete-hard">
                      <HoldButton
                        callback={() => id && hardRemoveUser(id)}
                        size="icon"
                        type="hard-delete"
                        variant="outline"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span>!</span>
                      </HoldButton>
                    </Protected>
                  </>
                )}
              </CardFooter>
            </Activity>
          </>
        )}
      </Card>
    </section>
  );
}
