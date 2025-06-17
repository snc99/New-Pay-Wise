import { ReactNode } from "react";
import Image from "next/image";

export function DashboardCard({
  title,
  value,
  subtitle,
  icon,
}: {
  title: string;
  value: string;
  subtitle: string;
  icon: ReactNode;
}) {
  return (
    <div className="relative rounded-xl bg-muted/50 p-4 shadow-md overflow-hidden">
      <div className="relative z-10">
        <div className="text-sm md:text-lg font-semibold">{title}</div>
        <div className="mt-2 text-xl md:text-3xl font-bold">{value}</div>
        <div className="mt-2 text-sm md:text-lg font-semibold">{subtitle}</div>
      </div>
      <div className="absolute -right-25 -top-10">
        <Image
          src="/itemscard.png"
          alt="Shape"
          width={198}
          height={230}
          className="object-contain"
        />
      </div>
      <div className="absolute bottom-4 right-4 text-muted-foreground">
        {icon}
      </div>
    </div>
  );
}
