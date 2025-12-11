import { Layout } from '@/components/layout/Layout';
import { useRoadmapStore } from '@/hooks/useRoadmapStore';
import { Button } from '@/components/ui/button';
import { Calendar, Flame, Trophy, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const CheckIn = () => {
  const { logs, checkInToday, hasCheckedInToday, calculateStats } = useRoadmapStore();
  const { toast } = useToast();
  const stats = calculateStats();
  const checkedIn = hasCheckedInToday();

  const handleCheckIn = () => {
    const success = checkInToday();
    if (success) {
      toast({
        title: "🎉 Awesome!",
        description: "Study session logged! Your streak continues.",
      });
    } else {
      toast({
        title: "Already logged",
        description: "You've already checked in today. Keep it up tomorrow!",
      });
    }
  };

  // Generate calendar data for current month
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  const firstDay = new Date(currentYear, currentMonth, 1);
  const lastDay = new Date(currentYear, currentMonth + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDay = firstDay.getDay();

  const studyDates = new Set(logs.map(log => log.date));

  const calendarDays = [];
  for (let i = 0; i < startingDay; i++) {
    calendarDays.push(null);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    calendarDays.push({
      day,
      dateStr,
      isStudyDay: studyDates.has(dateStr),
      isToday: day === today.getDate(),
      isPast: new Date(currentYear, currentMonth, day) < today,
    });
  }

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                      'July', 'August', 'September', 'October', 'November', 'December'];

  return (
    <Layout>
      <div className="space-y-8 max-w-2xl mx-auto">
        <div className="text-center animate-fade-in">
          <h1 className="text-3xl font-display font-bold mb-2">Daily Check-In</h1>
          <p className="text-muted-foreground">Mark your study sessions and build your streak</p>
        </div>

        {/* Check-in Button */}
        <div className="flex justify-center animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <Button
            size="lg"
            onClick={handleCheckIn}
            disabled={checkedIn}
            className={cn(
              "h-32 w-64 text-xl flex flex-col gap-3 rounded-2xl transition-all",
              checkedIn 
                ? "bg-success hover:bg-success/90" 
                : "bg-primary hover:bg-primary/90 pulse-glow"
            )}
          >
            {checkedIn ? (
              <>
                <CheckCircle2 className="w-10 h-10" />
                <span>Checked In ✓</span>
              </>
            ) : (
              <>
                <Calendar className="w-10 h-10" />
                <span>I Studied Today</span>
              </>
            )}
          </Button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-4 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <div className="glass-card p-4 text-center">
            <Flame className={cn("w-6 h-6 mx-auto mb-2", stats.currentStreak > 0 ? "text-warning streak-fire" : "text-muted-foreground")} />
            <p className="text-2xl font-display font-bold">{stats.currentStreak}</p>
            <p className="text-xs text-muted-foreground">Current Streak</p>
          </div>
          <div className="glass-card p-4 text-center">
            <Trophy className="w-6 h-6 mx-auto mb-2 text-warning" />
            <p className="text-2xl font-display font-bold">{stats.bestStreak}</p>
            <p className="text-xs text-muted-foreground">Best Streak</p>
          </div>
          <div className="glass-card p-4 text-center">
            <Calendar className="w-6 h-6 mx-auto mb-2 text-primary" />
            <p className="text-2xl font-display font-bold">{logs.length}</p>
            <p className="text-xs text-muted-foreground">Total Days</p>
          </div>
        </div>

        {/* Calendar */}
        <div className="glass-card p-6 animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <h2 className="text-xl font-display font-semibold mb-4 text-center">
            {monthNames[currentMonth]} {currentYear}
          </h2>
          
          <div className="grid grid-cols-7 gap-2 text-center">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-xs font-medium text-muted-foreground py-2">
                {day}
              </div>
            ))}
            
            {calendarDays.map((dayData, index) => (
              <div
                key={index}
                className={cn(
                  "aspect-square flex items-center justify-center rounded-lg text-sm transition-all",
                  !dayData && "invisible",
                  dayData?.isToday && "ring-2 ring-primary",
                  dayData?.isStudyDay && "bg-success text-success-foreground font-medium",
                  !dayData?.isStudyDay && dayData?.isPast && "text-muted-foreground",
                  !dayData?.isStudyDay && !dayData?.isPast && "text-foreground"
                )}
              >
                {dayData?.day}
              </div>
            ))}
          </div>
          
          <div className="flex items-center justify-center gap-6 mt-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-success" />
              <span className="text-muted-foreground">Study day</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded ring-2 ring-primary" />
              <span className="text-muted-foreground">Today</span>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CheckIn;
