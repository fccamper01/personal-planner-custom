import { useCallback } from 'react';
import { Task } from './types';
import { 
  isSameDay, 
  isAfter, 
  isBefore, 
  startOfDay,
  addWeeks,
  differenceInDays,
  differenceInWeeks,
  differenceInMonths,
  differenceInYears
} from 'date-fns';

export function useTasks(tasks: Task[]) {
  /**
   * Checks if a specific task occurs on a given target date.
   */
  const doesTaskOccurOnDate = useCallback((task: Task, date: Date) => {
    const targetDate = startOfDay(date);
    const startDate = startOfDay(new Date(task.startDate));

    // If target is before start, it doesn't occur
    if (isBefore(targetDate, startDate)) return false;

    // If there's an end date and target is after it
    if (task.recurrence?.endDate && isAfter(targetDate, startOfDay(new Date(task.recurrence.endDate)))) {
      return false;
    }

    if (!task.recurrence) {
      return isSameDay(targetDate, startDate);
    }

    const { type, interval } = task.recurrence;

    switch (type) {
      case 'daily': {
        const diff = differenceInDays(targetDate, startDate);
        return diff % interval === 0;
      }
      case 'weekly': {
        const diff = differenceInWeeks(targetDate, startDate);
        return isSameDay(targetDate, addWeeks(startDate, diff)) && diff % interval === 0;
      }
      case 'monthly': {
        const diff = differenceInMonths(targetDate, startDate);
        // Check if day of month matches (e.g., 15th)
        return targetDate.getDate() === startDate.getDate() && diff % interval === 0;
      }
      case 'yearly': {
        const diff = differenceInYears(targetDate, startDate);
        // Date-fns same day handles year difference naturally if Month/Day match
        return targetDate.getMonth() === startDate.getMonth() && targetDate.getDate() === startDate.getDate() && diff % interval === 0;
      }
      default:
        return false;
    }
  }, []);

  const getTasksForDate = useCallback((date: Date) => {
    return tasks.filter(task => doesTaskOccurOnDate(task, date));
  }, [tasks, doesTaskOccurOnDate]);

  return {
    getTasksForDate
  };
}
