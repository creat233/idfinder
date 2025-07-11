import { format, isSameDay } from "date-fns";

export interface MessageGroup {
  date: string;
  messages: any[];
}

export const groupMessagesByDate = (messages: any[]): MessageGroup[] => {
  if (!messages.length) return [];

  const groups: MessageGroup[] = [];
  let currentGroup: MessageGroup | null = null;

  messages.forEach((message) => {
    const messageDate = new Date(message.created_at);
    const dateString = format(messageDate, 'yyyy-MM-dd');

    if (!currentGroup || currentGroup.date !== dateString) {
      currentGroup = {
        date: dateString,
        messages: [message]
      };
      groups.push(currentGroup);
    } else {
      currentGroup.messages.push(message);
    }
  });

  return groups;
};