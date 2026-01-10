import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  startOfDay, 
  endOfDay,
  isToday as fnsIsToday,
  isThisMonth as fnsIsThisMonth,
  parseISO,
  isSameMonth,
  isSameDay,
  isValid
} from 'date-fns';

// Safely parse a date string or Date object
const safeParseDate = (date) => {
  if (!date) return null;
  
  try {
    // If it's already a Date object
    if (date instanceof Date) {
      return isValid(date) ? date : null;
    }
    
    // If it's a string
    if (typeof date === 'string') {
      // Try parsing as ISO string first
      let parsed = parseISO(date);
      if (isValid(parsed)) return parsed;
      
      // Try parsing as simple date (YYYY-MM-DD)
      if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        parsed = new Date(date + 'T00:00:00');
        if (isValid(parsed)) return parsed;
      }
      
      // Try direct Date parsing
      parsed = new Date(date);
      if (isValid(parsed)) return parsed;
    }
    
    return null;
  } catch (error) {
    console.error('Error parsing date:', date, error);
    return null;
  }
};

export const formatDate = (date, formatStr = 'dd MMM yyyy') => {
  const parsed = safeParseDate(date);
  if (!parsed) return 'Invalid date';
  return format(parsed, formatStr);
};

export const formatDateShort = (date) => {
  return formatDate(date, 'dd MMM');
};

export const formatDateFull = (date) => {
  return formatDate(date, 'EEEE, dd MMMM yyyy');
};

export const formatMonthYear = (date) => {
  return formatDate(date, 'MMMM yyyy');
};

export const getMonthBounds = (date = new Date()) => {
  const parsed = safeParseDate(date) || new Date();
  return {
    start: startOfMonth(parsed),
    end: endOfMonth(parsed),
  };
};

export const getDayBounds = (date = new Date()) => {
  const parsed = safeParseDate(date) || new Date();
  return {
    start: startOfDay(parsed),
    end: endOfDay(parsed),
  };
};

export const isExpenseToday = (expenseDate) => {
  const parsed = safeParseDate(expenseDate);
  if (!parsed) return false;
  
  const today = new Date();
  return (
    parsed.getFullYear() === today.getFullYear() &&
    parsed.getMonth() === today.getMonth() &&
    parsed.getDate() === today.getDate()
  );
};

export const isExpenseThisMonth = (expenseDate) => {
  const parsed = safeParseDate(expenseDate);
  if (!parsed) return false;
  
  const today = new Date();
  return (
    parsed.getFullYear() === today.getFullYear() &&
    parsed.getMonth() === today.getMonth()
  );
};

export const isExpenseInMonth = (expenseDate, targetMonth) => {
  const expenseParsed = safeParseDate(expenseDate);
  const targetParsed = safeParseDate(targetMonth);
  
  if (!expenseParsed || !targetParsed) return false;
  
  return (
    expenseParsed.getFullYear() === targetParsed.getFullYear() &&
    expenseParsed.getMonth() === targetParsed.getMonth()
  );
};

export const isExpenseOnDay = (expenseDate, targetDay) => {
  const expenseParsed = safeParseDate(expenseDate);
  const targetParsed = safeParseDate(targetDay);
  
  if (!expenseParsed || !targetParsed) return false;
  
  return (
    expenseParsed.getFullYear() === targetParsed.getFullYear() &&
    expenseParsed.getMonth() === targetParsed.getMonth() &&
    expenseParsed.getDate() === targetParsed.getDate()
  );
};

export const getCurrentMonth = () => {
  return format(new Date(), 'yyyy-MM');
};

export const getToday = () => {
  return format(new Date(), 'yyyy-MM-dd');
};

export const getTodayDisplay = () => {
  return format(new Date(), 'dd MMM yyyy');
};