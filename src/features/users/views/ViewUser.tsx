import { FileClock, FilePenLine, RotateCcw, Trash2 } from "lucide-react";

import { Activity } from "react";
import { BackButton } from "@components/BackButton";
import { Button } from "@components/ui/button";
import { Badge } from "@components/Badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@components/ui/card";
import { CreatedAt } from "@components/CreatedAt";
import { DeleteDialog } from "@components/DeleteDialog";
import { DisplayWorkingDays } from "@components/DisplayWorkingDays";
import { HistoryTable } from "@medical-history/components/HistoryTable";
import { Link } from "react-router";
import { Loader } from "@components/Loader";
import { PageHeader } from "@components/pages/PageHeader";
import { Protected } from "@auth/components/Protected";
import { Tooltip } from "@components/ui/tooltip";
import { TooltipContent, TooltipTrigger } from "@components/ui/tooltip";

import { es } from "date-fns/locale";
import { format } from "date-fns";
import { toast } from "sonner";
import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router";

import type { IUser } from "@users/interfaces/user.interface";
import type { TPermission } from "@permissions/interfaces/permission.type";
import { ERoles } from "@auth/enums/role.enum";
import { EUserRole } from "@roles/enums/user-role.enum";
import { UsersService } from "@users/services/users.service";
import { formatIc } from "@core/formatters/ic.formatter";
import { tryCatch } from "@core/utils/try-catch";
import { useAuthStore } from "@auth/stores/auth.store";
import { usePermission } from "@permissions/hooks/usePermission";
import { useTryCatch } from "@core/hooks/useTryCatch";

export default function ViewUser() {
  const [openRemoveDialog, setOpenRemoveDialog] = useState<boolean>(false);
  const [openRemoveHardDialog, setOpenRemoveHardDialog] = useState<boolean>(false);
  const [user, setUser] = useState<IUser | undefined>(undefined);
  const adminAuth = useAuthStore((state) => state.admin);
  const location = useLocation();
  const navigate = useNavigate();
  const userRole = location.state.role;
  const { id } = useParams();
  const { isLoading: isLoadingUser, tryCatch: tryCatchUser } = useTryCatch();
  const { isLoading: isRemoving, tryCatch: tryCatchRemove } = useTryCatch();
  const { isLoading: isRemovingHard, tryCatch: tryCatchRemoveHard } = useTryCatch();

  const hasPermissions = usePermission(
    [
      `${userRole.value}-delete`,
      `${userRole.value}-delete-hard`,
      `${userRole.value}-restore`,
      `${userRole.value}-update`,
    ] as TPermission[],
    "some",
  );

  const findOneUser = useCallback(
    async function (id: string) {
      const isSuperAdmin = adminAuth?.role.value === ERoles.super;
      const serviceByRole = isSuperAdmin
        ? UsersService.findPatientSoftRemovedWithHistory(id)
        : UsersService.findPatientWithHistory(id);

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
    const [response, error] = await tryCatchRemove(UsersService.softRemove(id));

    if (error) {
      toast.error(error.message);
      return;
    }

    if (response && response.statusCode === 200) {
      toast.success(response.message);
      findOneUser(id);
    }
  }

  async function hardRemoveUser(id: string): Promise<void> {
    const [response, error] = await tryCatchRemoveHard(UsersService.remove(id));

    if (error) {
      toast.error(error.message);
      return;
    }

    if (response && response.statusCode === 200) {
      toast.success(response.message);
      navigate(-1);
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
      findOneUser(id);
    }
  }

  useEffect(() => {
    findOneUser(id!);
  }, [id, findOneUser]);

  if (!user) return null;

  return (
    <section className="flex flex-col gap-8">
      <div className="flex flex-col gap-3">
        <PageHeader title={`Detalles del ${userRole.name.toLowerCase()}`} />
        <Card className="relative w-full p-6 text-center md:w-[70%]">
          {isLoadingUser ? (
            <div className="flex justify-center">
              <Loader size={20} text={`Cargando ${userRole.name.toLowerCase()}`} />
            </div>
          ) : (
            <>
              <BackButton />
              <CardHeader>
                <CardTitle className="text-xl">
                  <Activity mode={user.role.value === EUserRole["professional"] ? "visible" : "hidden"}>
                    {`${user.professionalProfile?.professionalPrefix ?? ""} `}
                  </Activity>
                  {`${user.firstName} ${user.lastName}`}
                </CardTitle>
                <CardDescription className="text-base">{user.role?.name}</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-8 px-0">
                <div className="columns-1 space-y-6 space-x-6 md:columns-2">
                  <div className="flex break-inside-avoid flex-col items-start gap-3">
                    <h2 className="text-muted-foreground w-full border-b text-start text-base font-medium">
                      Datos personales
                    </h2>
                    <ul className="flex flex-col gap-2 text-sm">
                      <li className="flex justify-start gap-2">
                        <span className="font-semibold">Nombre:</span>
                        <span>{user.firstName}</span>
                      </li>
                      <li className="flex justify-start gap-2">
                        <span className="font-semibold">Apellido:</span>
                        <span>{user.lastName}</span>
                      </li>
                      <li className="flex justify-start gap-2">
                        <span className="font-semibold">Usuario:</span>
                        <span>{user.userName}</span>
                      </li>
                      <li className="flex justify-start gap-2">
                        <span className="font-semibold">DNI:</span>
                        <span>{user.ic}</span>
                      </li>
                    </ul>
                  </div>
                  <Activity mode={user.role.value === EUserRole["professional"] ? "visible" : "hidden"}>
                    <div className="flex break-inside-avoid flex-col items-start gap-3">
                      <h2 className="text-muted-foreground w-full border-b text-start text-base font-medium">
                        Datos profesionales
                      </h2>
                      <ul className="flex flex-col gap-2 text-sm">
                        <li className="flex justify-start gap-2">
                          <span className="font-semibold">Nº de matrícula:</span>
                          <span>{user.professionalProfile?.licenseId}</span>
                        </li>
                        <li className="flex justify-start gap-2">
                          <span className="font-semibold">Especialidad:</span>
                          <span>{user.professionalProfile?.specialty}</span>
                        </li>
                      </ul>
                    </div>
                  </Activity>
                  <div className="flex break-inside-avoid flex-col items-start gap-3">
                    <h2 className="text-muted-foreground w-full border-b text-start text-base font-medium">
                      Medios de contacto
                    </h2>
                    <ul className="flex flex-col gap-2 text-sm">
                      <li className="flex justify-start gap-2">
                        <span className="font-semibold">E-mail:</span>
                        <span>{user.email}</span>
                      </li>
                      <li className="flex justify-start gap-2">
                        <span className="font-semibold">Teléfono:</span>
                        <span>{user.phoneNumber}</span>
                      </li>
                    </ul>
                  </div>
                  <Activity
                    mode={
                      user.role.value === EUserRole["professional"] && user.professionalProfile ? "visible" : "hidden"
                    }
                  >
                    <div className="flex break-inside-avoid flex-col items-start gap-3">
                      <h2 className="text-muted-foreground w-full border-b text-start text-base font-medium">
                        Configuración de la agenda
                      </h2>
                      <ul className="flex flex-col gap-2 text-sm">
                        <li className="flex flex-wrap items-center gap-2">
                          <span className="font-semibold">Días laborales:</span>
                          <DisplayWorkingDays days={user.professionalProfile?.workingDays} />
                        </li>
                        <li className="flex flex-wrap items-center gap-2">
                          <span className="font-semibold">Horario:</span>
                          {user.professionalProfile?.dailyExceptionStart && user.professionalProfile?.dailyExceptionEnd
                            ? `${user.professionalProfile?.startHour} - ${user.professionalProfile?.dailyExceptionStart} / ${user.professionalProfile?.dailyExceptionEnd} - ${user.professionalProfile?.endHour} hs.`
                            : `${user.professionalProfile?.startHour} - ${user.professionalProfile?.endHour} hs.`}
                        </li>
                        <li className="flex flex-wrap items-center gap-2">
                          <span className="font-semibold">Duración del turno:</span>
                          <span>{user.professionalProfile?.slotDuration} min.</span>
                        </li>
                      </ul>
                    </div>
                  </Activity>
                </div>
                <CreatedAt>
                  {`${user.role.name} creado el ${user && format(user.createdAt, "dd/MM/yyyy", { locale: es })}`}
                </CreatedAt>
              </CardContent>
              <Activity mode={hasPermissions ? "visible" : "hidden"}>
                <CardFooter className="px-0">
                  {user?.deletedAt && user?.deletedAt !== null ? (
                    <div className="flex w-full items-center justify-between">
                      <Badge size="small" variant="red">
                        Eliminado
                      </Badge>
                      <Protected requiredPermission={`${userRole.value}-restore` as TPermission}>
                        <Button
                          className="hover:text-amber-600"
                          onClick={() => id && restoreUser(id)}
                          size="icon"
                          variant="outline"
                        >
                          <RotateCcw />
                        </Button>
                      </Protected>
                    </div>
                  ) : (
                    <div className="flex w-full items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button className="hover:text-fuchsia-500" size="icon" variant="outline">
                              <FileClock className="h-5 w-5" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Agregar historia médica</TooltipContent>
                        </Tooltip>
                      </div>
                      <div className="flex items-center gap-3">
                        <Protected requiredPermission={`${userRole.value}-update` as TPermission}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button className="hover:text-green-500" size="icon" variant="outline" asChild>
                                <Link to={`/users/edit/${id}`} state={{ role: userRole.value }}>
                                  <FilePenLine className="h-5 w-5" />
                                </Link>
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Editar</TooltipContent>
                          </Tooltip>
                        </Protected>
                        <Protected requiredPermission={`${userRole.value}-delete` as TPermission}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                className="hover:text-red-500"
                                onClick={() => setOpenRemoveDialog(true)}
                                size="icon"
                                variant="outline"
                              >
                                <Trash2 className="h-5 w-5" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Eliminar</TooltipContent>
                          </Tooltip>
                        </Protected>
                        <Protected requiredPermission={`${userRole.value}-delete-hard` as TPermission}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                className="gap-0 hover:text-red-500"
                                onClick={() => setOpenRemoveHardDialog(true)}
                                size="icon"
                                variant="outline"
                              >
                                <Trash2 className="h-5 w-5" />
                                <span>!</span>
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Eliminar irreversible</TooltipContent>
                          </Tooltip>
                        </Protected>
                      </div>
                    </div>
                  )}
                </CardFooter>
              </Activity>
            </>
          )}
        </Card>
      </div>
      <div className="flex flex-col gap-3">
        <PageHeader title="Historial médico" />
        <HistoryTable patient={user} />
      </div>
      <DeleteDialog
        title="Eliminar paciente"
        description="¿Seguro que querés eliminar a este paciente?"
        callback={() => id && removeUser(id)}
        loader={isRemoving}
        open={openRemoveDialog}
        setOpen={setOpenRemoveDialog}
      >
        <ul>
          <li className="flex items-center gap-2">
            <span className="font-semibold">Nombre:</span>
            {`${user.firstName} ${user.lastName}`}
          </li>
          <li className="flex items-center gap-2">
            <span className="font-semibold">DNI:</span>
            {formatIc(user.ic)}
          </li>
        </ul>
      </DeleteDialog>
      <DeleteDialog
        title="Eliminar paciente"
        description="¿Seguro que querés eliminar a este paciente?"
        alertMessage="Todos los turnos y el historial médico relacionados al paciente, serán eliminados de la base de datos. Esta acción es irreversible."
        callback={() => id && hardRemoveUser(id)}
        loader={isRemovingHard}
        open={openRemoveHardDialog}
        setOpen={setOpenRemoveHardDialog}
        showAlert
      >
        <ul className="flex flex-col gap-1">
          <li className="flex items-center gap-2">
            <span className="font-semibold">Nombre completo:</span>
            {`${user.firstName} ${user.lastName}`}
          </li>
          <li className="flex items-center gap-2">
            <span className="font-semibold">DNI:</span>
            {formatIc(user.ic)}
          </li>
        </ul>
      </DeleteDialog>
    </section>
  );
}
