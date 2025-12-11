import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  iconColor?: string;
}

export const StatCard = ({ icon: Icon, label, value, iconColor = 'text-primary' }: StatCardProps) => {
  return (
    <div className="glass-card p-5 hover-lift">
      <div className="flex items-center gap-3">
        <div className={`p-2.5 rounded-lg bg-primary/10`}>
          <Icon className={`w-5 h-5 ${iconColor}`} />
        </div>
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wide">{label}</p>
          <p className="text-xl font-display font-semibold">{value}</p>
        </div>
      </div>
    </div>
  );
};
