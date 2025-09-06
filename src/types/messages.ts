import { MCardMessage } from './mcard-verification';

export interface Conversation {
  otherUserId: string;
  otherUserName: string;
  mcardId: string;
  mcardName: string;
  mcardSlug?: string;
  messages: MCardMessage[];
  lastMessage: MCardMessage;
  unreadCount: number;
}

export interface ProcessedMessage extends MCardMessage {
  sender_name: string;
  recipient_name: string;
  mcard_name: string;
}