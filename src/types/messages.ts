import { MCardMessage } from './mcard-verification';

export interface Conversation {
  otherUserId: string;
  otherUserName: string;
  otherUserProfilePicture?: string | null;
  mcardId: string;
  mcardName: string;
  mcardSlug?: string;
  mcardProfilePicture?: string | null;
  messages: MCardMessage[];
  lastMessage: MCardMessage;
  unreadCount: number;
}

export interface ProcessedMessage extends MCardMessage {
  sender_name: string;
  recipient_name: string;
  mcard_name: string;
  mcard_slug?: string;
  mcard_profile_picture?: string | null;
}
