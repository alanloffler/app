import { Button } from "@components/ui/button";
import { Card, CardContent } from "@components/ui/card";
import { Link } from "react-router";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@components/ui/table";

import { es } from "date-fns/locale";
import { format } from "date-fns";
import { useNavigate } from "react-router";

import type { IUser } from "@users/interfaces/user.interface";

interface IProps {
  patients: IUser[];
  className?: string;
}

export function PatientsCard({ patients, className }: IProps) {
  const navigate = useNavigate();

  return (
    <Card className={className}>
      <CardContent className="flex flex-1 flex-col gap-4">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold">Últimos pacientes</h1>
          <Button size="sm" variant="outline" asChild>
            <Link to="/users/role/patient">Ver todos</Link>
          </Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[60px]">ID</TableHead>
              <TableHead>Paciente</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Fecha de alta</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {patients.map((patient) => (
              <TableRow
                className="cursor-pointer hover:bg-gray-50"
                key={patient.id}
                onClick={() => navigate(`/users/view/${patient.id}`, { state: { role: patient.role } })}
              >
                <TableCell className="font-medium">{patient.id.slice(0, 4)}</TableCell>
                <TableCell>{`${patient.firstName} ${patient.lastName}`}</TableCell>
                <TableCell>{patient.email}</TableCell>
                <TableCell>{format(patient.createdAt, "P", { locale: es })}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
