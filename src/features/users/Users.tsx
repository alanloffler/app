import { Protected } from "@/core/auth/components/Protected";
import { PageHeader } from "@/core/components/pages/PageHeader";
import { Button } from "@/core/components/ui/button";
import { Plus } from "lucide-react";
import { Link } from "react-router";

export default function Users() {
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
    </div>
  );
}
