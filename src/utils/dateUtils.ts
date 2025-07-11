import { format, isToday, isYesterday, isThisWeek, isThisYear } from "date-fns";
import { fr } from "date-fns/locale";

export const formatMessageDate = (date: string | Date): string => {
  const messageDate = new Date(date);
  
  if (isToday(messageDate)) {
    return "Aujourd'hui";
  }
  
  if (isYesterday(messageDate)) {
    return "Hier";
  }
  
  if (isThisWeek(messageDate)) {
    return format(messageDate, "EEEE", { locale: fr });
  }
  
  if (isThisYear(messageDate)) {
    return format(messageDate, "dd MMM", { locale: fr });
  }
  
  return format(messageDate, "dd/MM/yyyy", { locale: fr });
};

export const formatMessageTime = (date: string | Date): string => {
  return format(new Date(date), "HH:mm", { locale: fr });
};