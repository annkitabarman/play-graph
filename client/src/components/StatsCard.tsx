import type { LucideIcon } from "lucide-react";

interface StatsCardProps {
  header: string;
  value: string | number;
  icon: LucideIcon;
  note: string;
}

export default function StatsCard({
  header,
  value,
  icon: Icon,
  note,
}: StatsCardProps) {
  return (
    <div className="relative overflow-hidden rounded-[20px] border border-violet-500/30 bg-[#171238] px-5 py-5 shadow-[0_10px_40px_rgba(0,0,0,0.25)]">
      {/* Neon top border */}
      <div className="absolute left-0 right-0 top-0 h-[3px] bg-gradient-to-r from-cyan-400 to-violet-500" />

      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-base font-medium text-violet-300">{header}</p>

        <Icon className="h-5 w-5 text-violet-400" />
      </div>

      {/* Value */}
      <p className="mt-5 text-4xl font-bold tracking-tight text-white">
        {value}
      </p>

      <p className="mt-1 text-sm text-violet-300">{note}</p>
    </div>
  );
}
