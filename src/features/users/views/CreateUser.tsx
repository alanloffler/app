import { CreateProfessionalForm } from "@users/components/CreateProfessionalForm";

import { useLocation } from "react-router";

import { EUserRole } from "@roles/enums/user-role.enum";

export default function CreateUser() {
  const { state } = useLocation();
  const userRole = state.role;

  return (
    <div className="flex w-full flex-col gap-10 lg:w-[80%] xl:w-[60%]">
      {userRole === EUserRole["admin"] && <div>Mostrar formulario de creacion de admin</div>}
      {userRole === EUserRole["patient"] && <div>Mostrar formulario de creacion de paciente</div>}
      {userRole === EUserRole["professional"] && <CreateProfessionalForm />}
    </div>
  );
}
