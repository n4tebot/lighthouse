export type MessageType = 'text' | 'prayer' | 'praise';

export interface User {
  id: string;
  name: string;
  avatar: string; // emoji
  joinedAt: number;
}

export interface Group {
  id: string;
  name: string;
  description: string;
  inviteCode: string;
  coverColor: string;
  memberIds: string[];
  createdAt: number;
  weeklyFocus: string;
}

export interface Message {
  id: string;
  groupId: string;
  authorId: string;
  text: string;
  type: MessageType;
  createdAt: number;
}

export interface PrayerRequest {
  id: string;
  groupId: string;
  authorId: string;
  text: string;
  prayerCount: number;
  prayedByIds: string[];
  answered: boolean;
  createdAt: number;
}

export interface CheckIn {
  id: string;
  groupId: string;
  userId: string;
  response: string;
  week: string; // ISO week string e.g. "2026-W13"
  createdAt: number;
}

export interface AppState {
  currentUserId: string | null;
  users: User[];
  groups: Group[];
  messages: Message[];
  prayerRequests: PrayerRequest[];
  checkIns: CheckIn[];
}
