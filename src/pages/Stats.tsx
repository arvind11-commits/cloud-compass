import { Layout } from '@/components/layout/Layout';
import { useRoadmapStore } from '@/hooks/useRoadmapStore';
import { StatCard } from '@/components/home/StatCard';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, Flame, Trophy, Target, BookOpen, TrendingUp, Award } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const Stats = () => {
  const { calculateStats, phases, days } = useRoadmapStore();
  const stats = calculateStats();

  // Phase progress data for pie chart
  const phaseData = phases.map(phase => {
    const phaseDays = days.filter(d => d.phaseId === phase.id);
    const completed = phaseDays.filter(d => d.completed).length;
    return {
      name: phase.name.replace('Phase ', '').replace(' –', ':'),
      value: completed,
      total: phaseDays.length,
      percentage: phaseDays.length > 0 ? Math.round((completed / phaseDays.length) * 100) : 0,
    };
  });

  const COLORS = ['hsl(var(--primary))', 'hsl(var(--accent))', 'hsl(var(--success))', 'hsl(var(--warning))', 'hsl(142, 76%, 50%)', 'hsl(280, 70%, 60%)'];

  // Milestones
  const milestones = [
    { target: 25, label: '25% Complete', icon: Award },
    { target: 50, label: 'Halfway There!', icon: Target },
    { target: 75, label: '75% Done', icon: TrendingUp },
    { target: 100, label: 'Journey Complete!', icon: Trophy },
  ];

  return (
    <Layout>
      <div className="space-y-8">
        <div className="animate-fade-in">
          <h1 className="text-3xl font-display font-bold mb-2">Your Stats</h1>
          <p className="text-muted-foreground">Track your learning performance and achievements</p>
        </div>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <StatCard icon={CheckCircle2} label="Days Completed" value={`${stats.totalDaysCompleted}/180`} iconColor="text-success" />
          <StatCard icon={Flame} label="Current Streak" value={`${stats.currentStreak} days`} iconColor="text-warning" />
          <StatCard icon={Trophy} label="Best Streak" value={`${stats.bestStreak} days`} iconColor="text-warning" />
          <StatCard icon={BookOpen} label="Resources" value={stats.totalResources} iconColor="text-primary" />
        </div>

        {/* Progress Overview */}
        <div className="glass-card p-6 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <h2 className="text-xl font-display font-semibold mb-4">Overall Progress</h2>
          <div className="flex items-center gap-4 mb-2">
            <div className="flex-1">
              <Progress value={stats.completionPercentage} className="h-4" />
            </div>
            <span className="text-2xl font-display font-bold gradient-text">{stats.completionPercentage}%</span>
          </div>
          <p className="text-sm text-muted-foreground">
            {180 - stats.totalDaysCompleted} days remaining to complete your cloud journey
          </p>
        </div>

        {/* Charts Row */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Weekly Activity */}
          <div className="glass-card p-6 animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <h2 className="text-xl font-display font-semibold mb-4">Weekly Activity</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.weeklyData}>
                  <XAxis dataKey="week" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Bar dataKey="days" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Phase Progress */}
          <div className="glass-card p-6 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <h2 className="text-xl font-display font-semibold mb-4">Phase Progress</h2>
            <div className="space-y-3">
              {phaseData.map((phase, index) => (
                <div key={phase.name} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="truncate">{phase.name}</span>
                    <span className="text-muted-foreground">{phase.value}/{phase.total}</span>
                  </div>
                  <Progress value={phase.percentage} className="h-2" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Milestones */}
        <div className="glass-card p-6 animate-fade-in" style={{ animationDelay: '0.5s' }}>
          <h2 className="text-xl font-display font-semibold mb-4">Milestones</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {milestones.map((milestone) => {
              const achieved = stats.completionPercentage >= milestone.target;
              return (
                <div 
                  key={milestone.target}
                  className={`p-4 rounded-lg border text-center transition-all ${
                    achieved 
                      ? 'bg-success/10 border-success/30' 
                      : 'bg-secondary/50 border-border'
                  }`}
                >
                  <milestone.icon className={`w-8 h-8 mx-auto mb-2 ${achieved ? 'text-success' : 'text-muted-foreground'}`} />
                  <p className={`font-medium ${achieved ? 'text-success' : 'text-muted-foreground'}`}>
                    {milestone.label}
                  </p>
                  {achieved && <span className="text-xs text-success">✓ Achieved</span>}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Stats;
