import { Card, CardContent } from "@components/ui/card";

import type { IBusiness } from "@business/interfaces/business.interface";

interface IProps {
  business: IBusiness;
  className?: string;
}

export function BusinessCard({ business, className }: IProps) {
  return (
    <Card className={className}>
      <CardContent className="flex flex-1 flex-col gap-4">
        <h1 className="text-xl font-semibold">{business.tradeName}</h1>
        <ul className="flex flex-col gap-1">
          <li className="flex justify-start gap-3">
            <h3 className="font-medium">Razón social:</h3>
            <span>{business.companyName}</span>
          </li>
          <li className="flex justify-start gap-3">
            <h3 className="font-medium">CUIT</h3>
            <span>{business.taxId}</span>
          </li>
          <li className="flex justify-start gap-3">
            <h3 className="font-medium">Descripción:</h3>
            <span>{business.description}</span>
          </li>
          <li className="flex justify-start gap-3">
            <h3 className="font-medium">Dirección:</h3>
            <span>{`${business.street}, ${business.city}, ${business.province}, ${business.zipCode}`}</span>
          </li>
        </ul>
      </CardContent>
    </Card>
  );
}
