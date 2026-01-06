import { CreateForm } from "@users/components/CreateForm";

export default function CreateUser() {
  return (
    <div className="flex w-full flex-col gap-10 lg:w-[80%] xl:w-[60%]">
      <CreateForm />
    </div>
  );
}
