import { Card } from "@components/ui/card";
import { Link } from "react-router";
import { Protected } from "@auth/components/Protected";

import type { ComponentType, ReactNode, SVGProps } from "react";
import type { LucideIcon } from "lucide-react";

import type { TPermission } from "@permissions/interfaces/permission.type";

interface IProps {
  asCard?: boolean;
  icon: LucideIcon | ComponentType<SVGProps<SVGSVGElement>>;
  children?: ReactNode;
  permission: TPermission | TPermission[];
  permissionMode?: "every" | "some";
  text: string;
  url?: string;
}

export function ActionCard({
  asCard = true,
  children,
  icon: Icon,
  permission,
  permissionMode = "some",
  text,
  url = "#",
}: IProps) {
  return (
    <Protected requiredPermission={permission} mode={permissionMode}>
      {children ? (
        asCard ? (
          <Card className="col-span-2 items-center gap-3 px-6 font-medium">
            <div className="flex items-center gap-3">
              <Icon className="h-6 w-6" />
              <span>{text}</span>
            </div>
            {children}
          </Card>
        ) : (
          <div className="justify-left col-span-2 flex h-full items-center gap-3 rounded-xl p-6 font-medium transition-colors duration-150 hover:bg-neutral-100 dark:hover:bg-neutral-950">
            <div className="flex items-center gap-3">
              <Icon className="h-6 w-6" />
              <span>{text}</span>
            </div>
            {children}
          </div>
        )
      ) : (
        <Link className="col-span-2" to={url}>
          {asCard ? (
            <Card className="items-center gap-3 px-6 font-medium transition-colors duration-150 hover:bg-neutral-50 dark:hover:bg-neutral-950">
              <Icon className="h-6 w-6" />
              <span>{text}</span>
            </Card>
          ) : (
            <div className="justify-left flex h-fit items-center gap-3 rounded-xl p-6 font-medium transition-colors duration-150 hover:bg-neutral-100 dark:hover:bg-neutral-950">
              <Icon className="h-6 w-6" />
              <span>{text}</span>
            </div>
          )}
        </Link>
      )}
    </Protected>
  );
}
