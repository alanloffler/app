import { EditForm } from "@users/components/EditForm";

import { useParams } from "react-router";

export default function EditUser() {
  const { id } = useParams();

  return (
    <div className="flex w-full flex-col gap-10 lg:w-[80%] xl:w-[60%]">
      <EditForm userId={id!} />
    </div>
  );
}
