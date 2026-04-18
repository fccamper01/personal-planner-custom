export type ViewType = 
  | 'index' 
  | 'current'
  | 'yearly' 
  | 'monthly' 
  | 'weekly' 
  | 'daily' 
  | 'vision' 
  | 'study' 
  | 'books' 
  | 'tv' 
  | 'notes'
  | 'business'
  | 'chores'
  | 'projects';

export type VisionBoardItem = {
  id: string;
  type: 'text' | 'image' | 'circle' | 'rect' | 'star' | 'triangle' | 'heart' | 'hexagon';
  x: number;
  y: number;
  width?: number;
  height?: number;
  fill?: string;
  text?: string;
  fontSize?: number;
  src?: string;
  rotation?: number;
  scaleX?: number;
  scaleY?: number;
};

export interface CheckItem {
  id: string;
  text: string;
  count: number;
  completed: boolean;
}

export interface CurrentDayData {
  quote: string;
  target: string;
  status: string;
  reward: string;
  punishment: string; // Keeping for compatibility, but will hide/repurpose in UI
  tasks: CheckItem[];
  weeklyProgress: { [day: string]: number }; // Mon-Sun counts
  quickNotes: string;
  bottomChecklist: { id: string; text: string; completed: boolean }[];
  miniChecklist: { id: string; text: string; completed: boolean }[];
}

export type RecurrenceType = 'daily' | 'weekly' | 'monthly' | 'yearly';

export interface RecurringRule {
  type: RecurrenceType;
  interval: number;
  endDate?: string; // ISO string
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  startDate: string; // ISO string (just date part matters usually)
  recurrence?: RecurringRule;
  completedDates: string[]; // Dates (YYYY-MM-DD) where this item was checked off
}

export interface ChoreItem {
  id: string;
  text: string;
  points: number;
  completed?: boolean;
}

export interface DailyChore extends ChoreItem {
  days: boolean[]; // 7 days MON-SUN
}

export interface ChoresData {
  name: string;
  week: number;
  currentPoints: number;
  dailyChores: DailyChore[];
  monthlyChores: ChoreItem[];
  quarterlyChores: ChoreItem[];
  semiAnnualChores: ChoreItem[];
  weeklyGoal: number;
  reward: string;
}

export type ThemeType = 'light' | 'dark' | 'medium';

export interface CheckListItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  color: string;
  isChecklist: boolean;
  checklist: CheckListItem[];
  updatedAt: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  content: string;
  color: string;
  updatedAt: string;
}

export interface PlannerData {
  ownerName: string;
  theme: ThemeType;
  notes: Note[];
  projects: ProjectItem[];
  yearly: {
    [year: string]: {
      months: { [monthIndex: number]: string[] }; // Array of 6 lines for each month
      bucketList: string[]; // Yearly bucket list
      priorities: string[]; // Yearly priorities
    };
  };
  monthly: {
    [key: string]: { // key is "YYYY-MM"
      goals: string[];
      focus: string;
    };
  };
  weekly: {
    [key: string]: { // key is "YYYY-W##"
      focus: string;
      goals: string[];
      review: string;
      habits: { name: string; checked: boolean[] }[];
    };
  };
  daily: {
    [key: string]: { // key is "YYYY-MM-DD"
      reflection: string;
      notes: string;
      timeline: { [hour: number]: string };
    };
  };
  study: {
    subjects: { name: string; status: 'Ongoing' | 'Completed' | 'To Start'; topic: string }[];
    schedule: { [day: string]: string }; // Day names as keys
  };
  current: CurrentDayData;
  businessIdeas: string[];
  visionBoards: {
    [monthKey: string]: VisionBoardItem[];
  };
  tasks: Task[];
  chores: ChoresData;
}

export interface PlannerState {
  activeView: ViewType;
  activeMonth: number;
  activeDate: string; // ISO string for the selected day
}
