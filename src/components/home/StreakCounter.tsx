import { Flame } from 'lucide-react';

interface StreakCounterProps {
  streak: number;
}

export const StreakCounter = ({ streak }: StreakCounterProps) => {
  return (
    <div className="glass-card p-6 hover-lift">
      <div className="flex items-center gap-4">
        <div className="p-3 rounded-full bg-warning/10">
          <Flame className={`w-8 h-8 text-warning ${streak > 0 ? 'streak-fire' : ''}`} />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Current Streak</p>
          <p className="text-3xl font-display font-bold">{streak} <span className="text-lg text-muted-foreground">days</span></p>
        </div>
      </div>
    </div>
  );
};
