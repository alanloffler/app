import { LoginForm } from "@login/components/LoginForm";

export function UserLogin() {
  return (
    <div className="flex h-screen w-full items-center justify-center p-4 sm:p-6 md:p-10">
      <LoginForm type="user" />
    </div>
  );
}
