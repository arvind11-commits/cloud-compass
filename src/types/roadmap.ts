export interface Phase {
  id: string;
  name: string;
  description: string;
  startDay: number;
  endDay: number;
  order: number;
}

export interface Day {
  id: string;
  phaseId: string;
  dayNumber: number;
  title: string;
  description: string;
  completed: boolean;
  completedAt?: string;
  notes: string;
}

export interface DailyLog {
  id: string;
  date: string;
  studiedToday: boolean;
  timestamp: string;
}

export interface Resource {
  id: string;
  category: 'linux' | 'networking' | 'aws' | 'devops' | 'projects' | 'general';
  type: 'link' | 'video' | 'pdf' | 'code' | 'summary';
  title: string;
  content: string;
  url?: string;
  dayId?: string;
  createdAt: string;
}

export interface Stats {
  totalDaysCompleted: number;
  currentStreak: number;
  bestStreak: number;
  completionPercentage: number;
  totalResources: number;
  weeklyData: { week: string; days: number }[];
}
