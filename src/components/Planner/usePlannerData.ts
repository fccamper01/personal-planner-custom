import { useState, useEffect, useCallback } from 'react';
import { PlannerData, Task, ChoresData, ThemeType, Note } from './types';
import { auth, db } from '../../lib/firebase';
import { doc, onSnapshot, setDoc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { format } from 'date-fns';

export const INITIAL_DATA: PlannerData = {
  ownerName: '',
  theme: 'light',
  notes: [],
  yearly: {},
  monthly: {},
  weekly: {},
  daily: {},
  study: {
    subjects: [
      { name: '', status: 'To Start', topic: '' },
      { name: '', status: 'To Start', topic: '' },
      { name: '', status: 'To Start', topic: '' }
    ],
    schedule: {
      'Monday': '',
      'Tuesday': '',
      'Wednesday': '',
      'Thursday': '',
      'Friday': '',
      'Saturday': '',
      'Sunday': ''
    }
  },
  current: {
    quote: 'Per aspera ad astra!',
    target: '15 tasks till Monday',
    status: 'In Progress',
    reward: 'Play console and get 2 lunas',
    punishment: 'Do 1 more chore',
    tasks: [],
    weeklyProgress: { 'MON': 0, 'TUE': 0, 'WED': 0, 'THUR': 0, 'FRI': 5, 'SAT': 0, 'SUN': 0 },
    quickNotes: '',
    bottomChecklist: [],
    miniChecklist: [
      { id: '1', text: 'Drink Water', completed: false },
      { id: '2', text: 'Exercise', completed: false },
      { id: '3', text: 'Read', completed: false }
    ]
  },
  businessIdeas: [],
  visionBoards: {},
  tasks: [],
  chores: {
    name: 'Friend',
    week: 1,
    currentPoints: 0,
    dailyChores: [],
    monthlyChores: [],
    quarterlyChores: [],
    semiAnnualChores: [],
    weeklyGoal: 30,
    reward: 'Funday'
  }
};

export function usePlannerData() {
  const [data, setData] = useState<PlannerData>(INITIAL_DATA);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    return onAuthStateChanged(auth, (u) => {
      setUser(u);
      if (!u) {
        setData(INITIAL_DATA);
        setLoading(false);
      }
    });
  }, []);

  useEffect(() => {
    if (!user) return;

    const userDoc = doc(db, 'users', user.uid);
    
    // Initial fetch or create
    const init = async () => {
      const snap = await getDoc(userDoc);
      if (!snap.exists()) {
        await setDoc(userDoc, { ...INITIAL_DATA, ownerName: user.displayName || 'Friend', tasks: [] });
      }
    };
    init();

    const unsub = onSnapshot(userDoc, (doc) => {
      if (doc.exists()) {
        const cloudData = doc.data() as PlannerData;
        setData({
          ...INITIAL_DATA,
          ...cloudData,
          current: { ...INITIAL_DATA.current, ...(cloudData.current || {}) },
          chores: { ...INITIAL_DATA.chores, ...(cloudData.chores || {}) }
        });
      }
      setLoading(false);
    });

    return () => unsub();
  }, [user]);

  const syncData = useCallback(async (newData: PlannerData) => {
    if (!user) {
      setData(newData);
      return;
    }
    const userDoc = doc(db, 'users', user.uid);
    await setDoc(userDoc, newData);
  }, [user]);

  const updateOwnerName = useCallback((name: string) => {
    const newData = { ...data, ownerName: name };
    setData(newData);
    syncData(newData);
  }, [data, syncData]);

  const updateYearly = useCallback((year: string, updates: { 
    monthIndex?: number; 
    lineIndex?: number; 
    value?: string;
    bucketList?: string[];
    priorities?: string[];
  }) => {
    const currentYear = data.yearly[year] || { months: {}, bucketList: [], priorities: [] };
    let newData: PlannerData;
    
    if (updates.monthIndex !== undefined && updates.lineIndex !== undefined && updates.value !== undefined) {
      const currentMonth = currentYear.months[updates.monthIndex] || Array(6).fill('');
      const newMonth = [...currentMonth];
      newMonth[updates.lineIndex] = updates.value;
      
      newData = {
        ...data,
        yearly: {
          ...data.yearly,
          [year]: {
            ...currentYear,
            months: {
              ...currentYear.months,
              [updates.monthIndex]: newMonth
            }
          }
        }
      };
    } else {
      newData = {
        ...data,
        yearly: {
          ...data.yearly,
          [year]: {
            ...currentYear,
            ...updates
          }
        }
      };
    }
    setData(newData);
    syncData(newData);
  }, [data, syncData]);

  const updateMonthly = useCallback((yearMonth: string, fields: Partial<PlannerData['monthly'][string]>) => {
    const newData = {
      ...data,
      monthly: {
        ...data.monthly,
        [yearMonth]: {
          goals: ['', '', ''],
          focus: '',
          ...data.monthly[yearMonth],
          ...fields
        }
      }
    };
    setData(newData);
    syncData(newData);
  }, [data, syncData]);

  const updateWeekly = useCallback((weekId: string, fields: Partial<PlannerData['weekly'][string]>) => {
    const newData = {
      ...data,
      weekly: {
        ...data.weekly,
        [weekId]: {
          focus: '',
          goals: ['', '', ''],
          review: '',
          habits: [
            { name: 'Water', checked: Array(7).fill(false) },
            { name: 'Reading', checked: Array(7).fill(false) },
            { name: 'Meditation', checked: Array(7).fill(false) }
          ],
          ...data.weekly[weekId],
          ...fields
        }
      }
    };
    setData(newData);
    syncData(newData);
  }, [data, syncData]);

  const updateDaily = useCallback((dateKey: string, fields: Partial<PlannerData['daily'][string]>) => {
    const newData = {
      ...data,
      daily: {
        ...data.daily,
        [dateKey]: {
          reflection: '',
          notes: '',
          timeline: {},
          ...data.daily[dateKey],
          ...fields
        }
      }
    };
    setData(newData);
    syncData(newData);
  }, [data, syncData]);

  const updateCurrent = useCallback((fields: Partial<PlannerData['current']>) => {
    const newData = {
      ...data,
      current: { ...data.current, ...fields }
    };
    setData(newData);
    syncData(newData);
  }, [data, syncData]);

  const updateStudy = useCallback((fields: Partial<PlannerData['study']>) => {
    const newData = {
      ...data,
      study: { ...data.study, ...fields }
    };
    setData(newData);
    syncData(newData);
  }, [data, syncData]);

  const updateBusinessIdeas = useCallback((ideas: string[]) => {
    const newData = { ...data, businessIdeas: ideas };
    setData(newData);
    syncData(newData);
  }, [data, syncData]);

  const updateVisionBoard = useCallback((monthKey: string, items: PlannerData['visionBoards'][string]) => {
    const newData = {
      ...data,
      visionBoards: {
        ...data.visionBoards,
        [monthKey]: items
      }
    };
    setData(newData);
    syncData(newData);
  }, [data, syncData]);

  const updateNotes = useCallback((notes: Note[]) => {
    const newData = { ...data, notes };
    setData(newData);
    syncData(newData);
  }, [data, syncData]);

  const addTask = useCallback((task: Omit<Task, 'id' | 'completedDates'>) => {
    const newTask: Task = {
      ...task,
      id: crypto.randomUUID(),
      completedDates: [],
    };
    const newData = { ...data, tasks: [...data.tasks, newTask] };
    setData(newData);
    syncData(newData);
  }, [data, syncData]);

  const deleteTask = useCallback((id: string) => {
    const newData = { ...data, tasks: data.tasks.filter(t => t.id !== id) };
    setData(newData);
    syncData(newData);
  }, [data, syncData]);

  const toggleTaskCompletion = useCallback((taskId: string, date: string) => {
    const dateKey = format(new Date(date), 'yyyy-MM-dd');
    const newTasks = data.tasks.map(task => {
      if (task.id === taskId) {
        const isCompleted = task.completedDates.includes(dateKey);
        return {
          ...task,
          completedDates: isCompleted 
            ? task.completedDates.filter(d => d !== dateKey)
            : [...task.completedDates, dateKey]
        };
      }
      return task;
    });
    const newData = { ...data, tasks: newTasks };
    setData(newData);
    syncData(newData);
  }, [data, syncData]);

  const updateChores = useCallback((fields: Partial<ChoresData>) => {
    const newData = {
      ...data,
      chores: { ...data.chores, ...fields }
    };
    setData(newData);
    syncData(newData);
  }, [data, syncData]);

  const updateTheme = useCallback((theme: ThemeType) => {
    const newData = { ...data, theme };
    setData(newData);
    syncData(newData);
  }, [data, syncData]);

  return {
    data,
    loading,
    user,
    updateOwnerName,
    updateYearly,
    updateMonthly,
    updateWeekly,
    updateDaily,
    updateCurrent,
    updateStudy,
    updateBusinessIdeas,
    updateVisionBoard,
    addTask,
    deleteTask,
    toggleTaskCompletion,
    updateChores,
    updateTheme,
    updateNotes
  };
}
