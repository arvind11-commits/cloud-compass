import { Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { ProgressRing } from '@/components/home/ProgressRing';
import { StreakCounter } from '@/components/home/StreakCounter';
import { StatCard } from '@/components/home/StatCard';
import { Button } from '@/components/ui/button';
import { useRoadmapStore } from '@/hooks/useRoadmapStore';
import { Calendar, Map, BookOpen, Target, CheckCircle2, Trophy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const { calculateStats, getCurrentPhase, checkInToday, hasCheckedInToday } = useRoadmapStore();
  const { toast } = useToast();
  const stats = calculateStats();
  const currentPhase = getCurrentPhase();
  const checkedIn = hasCheckedInToday();

  const handleCheckIn = () => {
    const success = checkInToday();
    if (success) {
      toast({
        title: "🎉 Great job!",
        description: "You've checked in for today. Keep the streak going!",
      });
    } else {
      toast({
        title: "Already checked in",
        description: "You've already logged your study session for today.",
      });
    }
  };

  return (
    <Layout>
      <div className="space-y-8">
        {/* Hero Section */}
        <section className="text-center py-8 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
            My <span className="gradient-text">Cloud Computing</span> Journey
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            180 Day Roadmap Tracker • Track progress • Maintain streaks • Become top 1% in India
          </p>
        </section>

        {/* Main Stats Grid */}
        <section className="grid md:grid-cols-2 gap-8 items-center">
          <div className="flex justify-center animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <ProgressRing progress={stats.completionPercentage} size={220} />
          </div>
          
          <div className="space-y-4 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <StreakCounter streak={stats.currentStreak} />
            <div className="grid grid-cols-2 gap-4">
              <StatCard 
                icon={CheckCircle2} 
                label="Days Done" 
                value={`${stats.totalDaysCompleted}/180`}
                iconColor="text-success"
              />
              <StatCard 
                icon={Trophy} 
                label="Best Streak" 
                value={`${stats.bestStreak} days`}
                iconColor="text-warning"
              />
            </div>
          </div>
        </section>

        {/* Current Phase */}
        <section className="glass-card p-6 animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <div className="flex items-center gap-3 mb-2">
            <Target className="w-5 h-5 text-primary" />
            <span className="text-sm text-muted-foreground">Currently In</span>
          </div>
          <h2 className="text-2xl font-display font-bold">{currentPhase?.name}</h2>
          <p className="text-muted-foreground">{currentPhase?.description}</p>
        </section>

        {/* Action Buttons */}
        <section className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <Button 
            size="lg" 
            className={`h-auto py-4 flex flex-col gap-2 ${checkedIn ? 'bg-success hover:bg-success/90' : 'pulse-glow'}`}
            onClick={handleCheckIn}
          >
            <Calendar className="w-6 h-6" />
            <span>{checkedIn ? 'Checked In ✓' : 'Check In Today'}</span>
          </Button>
          
          <Button size="lg" variant="outline" className="h-auto py-4 flex flex-col gap-2 hover-lift" asChild>
            <Link to="/roadmap">
              <Map className="w-6 h-6" />
              <span>View Roadmap</span>
            </Link>
          </Button>
          
          <Button size="lg" variant="outline" className="h-auto py-4 flex flex-col gap-2 hover-lift" asChild>
            <Link to="/resources">
              <BookOpen className="w-6 h-6" />
              <span>Add Resources</span>
            </Link>
          </Button>
          
          <Button size="lg" variant="outline" className="h-auto py-4 flex flex-col gap-2 hover-lift" asChild>
            <Link to="/checkin">
              <Calendar className="w-6 h-6" />
              <span>Daily Log</span>
            </Link>
          </Button>
        </section>
      </div>
    </Layout>
  );
};

export default Index;
