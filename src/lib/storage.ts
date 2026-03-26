import type { AppState, User, Group, Message, PrayerRequest, CheckIn } from './types';

const KEY = 'haven_app';

function getState(): AppState {
  const raw = localStorage.getItem(KEY);
  if (!raw) return defaultState();
  try {
    return JSON.parse(raw) as AppState;
  } catch {
    return defaultState();
  }
}

function setState(state: AppState) {
  localStorage.setItem(KEY, JSON.stringify(state));
}

function defaultState(): AppState {
  return {
    currentUserId: null,
    users: [],
    groups: [],
    messages: [],
    prayerRequests: [],
    checkIns: [],
  };
}

// ── User ──────────────────────────────────────────────────────────────────────

export function getCurrentUser(): User | null {
  const state = getState();
  if (!state.currentUserId) return null;
  return state.users.find((u) => u.id === state.currentUserId) ?? null;
}

export function createUser(name: string, avatar: string): User {
  const state = getState();
  const user: User = {
    id: crypto.randomUUID(),
    name,
    avatar,
    joinedAt: Date.now(),
  };
  state.users.push(user);
  state.currentUserId = user.id;
  setState(state);
  return user;
}

export function getUserById(id: string): User | undefined {
  return getState().users.find((u) => u.id === id);
}

export function updateCurrentUser(name: string, avatar: string) {
  const state = getState();
  const idx = state.users.findIndex((u) => u.id === state.currentUserId);
  if (idx !== -1) {
    state.users[idx].name = name;
    state.users[idx].avatar = avatar;
    setState(state);
  }
}

// ── Groups ────────────────────────────────────────────────────────────────────

export function getMyGroups(): Group[] {
  const state = getState();
  const uid = state.currentUserId;
  if (!uid) return [];
  return state.groups.filter((g) => g.memberIds.includes(uid));
}

export function getGroupById(id: string): Group | undefined {
  return getState().groups.find((g) => g.id === id);
}

export function createGroup(name: string, description: string, weeklyFocus: string): Group {
  const state = getState();
  const uid = state.currentUserId!;
  const colors = [
    'from-navy to-navy-light',
    'from-[#1E3A5F] to-[#2D5490]',
    'from-[#2D5490] to-[#4A7BC8]',
    'from-[#1E3A5F] to-[#3D6B9F]',
  ];
  const group: Group = {
    id: crypto.randomUUID(),
    name,
    description,
    inviteCode: Math.random().toString(36).substring(2, 8).toUpperCase(),
    coverColor: colors[Math.floor(Math.random() * colors.length)],
    memberIds: [uid],
    createdAt: Date.now(),
    weeklyFocus,
  };
  state.groups.push(group);
  setState(state);
  return group;
}

export function joinGroup(code: string): Group | null {
  const state = getState();
  const uid = state.currentUserId!;
  const group = state.groups.find((g) => g.inviteCode === code.toUpperCase());
  if (!group) return null;
  if (group.memberIds.includes(uid)) return group;
  if (group.memberIds.length >= 8) return null;
  group.memberIds.push(uid);
  setState(state);
  return group;
}

// ── Messages ──────────────────────────────────────────────────────────────────

export function getMessages(groupId: string): Message[] {
  return getState().messages.filter((m) => m.groupId === groupId);
}

export function sendMessage(groupId: string, text: string, type: Message['type'] = 'text'): Message {
  const state = getState();
  const msg: Message = {
    id: crypto.randomUUID(),
    groupId,
    authorId: state.currentUserId!,
    text,
    type,
    createdAt: Date.now(),
  };
  state.messages.push(msg);
  setState(state);
  return msg;
}

// ── Prayer Requests ───────────────────────────────────────────────────────────

export function getPrayerRequests(groupId: string): PrayerRequest[] {
  return getState().prayerRequests.filter((p) => p.groupId === groupId);
}

export function getAllPrayerRequests(): PrayerRequest[] {
  const state = getState();
  const uid = state.currentUserId;
  if (!uid) return [];
  const myGroupIds = state.groups.filter((g) => g.memberIds.includes(uid)).map((g) => g.id);
  return state.prayerRequests.filter((p) => myGroupIds.includes(p.groupId));
}

export function addPrayerRequest(groupId: string, text: string): PrayerRequest {
  const state = getState();
  const pr: PrayerRequest = {
    id: crypto.randomUUID(),
    groupId,
    authorId: state.currentUserId!,
    text,
    prayerCount: 0,
    prayedByIds: [],
    answered: false,
    createdAt: Date.now(),
  };
  state.prayerRequests.push(pr);
  setState(state);
  return pr;
}

export function prayForRequest(id: string) {
  const state = getState();
  const uid = state.currentUserId!;
  const pr = state.prayerRequests.find((p) => p.id === id);
  if (!pr) return;
  if (pr.prayedByIds.includes(uid)) {
    pr.prayedByIds = pr.prayedByIds.filter((x) => x !== uid);
    pr.prayerCount = Math.max(0, pr.prayerCount - 1);
  } else {
    pr.prayedByIds.push(uid);
    pr.prayerCount++;
  }
  setState(state);
}

export function markAnswered(id: string) {
  const state = getState();
  const pr = state.prayerRequests.find((p) => p.id === id);
  if (pr) {
    pr.answered = !pr.answered;
    setState(state);
  }
}

// ── Check-ins ─────────────────────────────────────────────────────────────────

export function getISOWeek(): string {
  const now = new Date();
  const jan4 = new Date(now.getFullYear(), 0, 4);
  const week = Math.ceil(((now.getTime() - jan4.getTime()) / 86400000 + jan4.getDay() + 1) / 7);
  return `${now.getFullYear()}-W${String(week).padStart(2, '0')}`;
}

export function getCheckIns(groupId: string): CheckIn[] {
  const week = getISOWeek();
  return getState().checkIns.filter((c) => c.groupId === groupId && c.week === week);
}

export function submitCheckIn(groupId: string, response: string): CheckIn {
  const state = getState();
  const uid = state.currentUserId!;
  const week = getISOWeek();
  const existing = state.checkIns.findIndex(
    (c) => c.groupId === groupId && c.userId === uid && c.week === week
  );
  const ci: CheckIn = {
    id: existing !== -1 ? state.checkIns[existing].id : crypto.randomUUID(),
    groupId,
    userId: uid,
    response,
    week,
    createdAt: Date.now(),
  };
  if (existing !== -1) {
    state.checkIns[existing] = ci;
  } else {
    state.checkIns.push(ci);
  }
  setState(state);
  return ci;
}

export function hasCheckedIn(groupId: string): boolean {
  const state = getState();
  const uid = state.currentUserId;
  if (!uid) return false;
  const week = getISOWeek();
  return state.checkIns.some((c) => c.groupId === groupId && c.userId === uid && c.week === week);
}

// ── Seed ──────────────────────────────────────────────────────────────────────

export function isSeeded(): boolean {
  const state = getState();
  return state.groups.some((g) => g.name === 'Lighthouse');
}

export function seedDemoData() {
  if (isSeeded()) return;
  const state = getState();

  const week = getISOWeek();

  // Fake members
  const members: import('./types').User[] = [
    { id: 'user-emma', name: 'Emma', avatar: '🌿', joinedAt: Date.now() - 86400000 * 30 },
    { id: 'user-jake', name: 'Jake', avatar: '⚡', joinedAt: Date.now() - 86400000 * 25 },
    { id: 'user-sarah', name: 'Sarah', avatar: '🌸', joinedAt: Date.now() - 86400000 * 20 },
  ];

  // Nathan user (seeded, not logged in)
  const nathan: import('./types').User = {
    id: 'user-nathan',
    name: 'Nathan',
    avatar: '🔥',
    joinedAt: Date.now() - 86400000 * 35,
  };

  state.users.push(nathan, ...members);

  // Lighthouse group
  const group: Group = {
    id: 'group-lighthouse',
    name: 'Lighthouse',
    description: 'A small group focused on living out faith in everyday life. We meet every Friday evening.',
    inviteCode: 'LIGHT1',
    coverColor: 'from-[#1E3A5F] to-[#2D5490]',
    memberIds: ['user-nathan', 'user-emma', 'user-jake', 'user-sarah'],
    createdAt: Date.now() - 86400000 * 35,
    weeklyFocus: "Share one thing you're grateful for this week — big or small.",
  };
  state.groups.push(group);

  const now = Date.now();
  // Messages
  state.messages.push(
    {
      id: 'msg-1',
      groupId: 'group-lighthouse',
      authorId: 'user-emma',
      text: 'Hey everyone! Excited for this week 🙌',
      type: 'text',
      createdAt: now - 86400000 * 2,
    },
    {
      id: 'msg-2',
      groupId: 'group-lighthouse',
      authorId: 'user-jake',
      text: 'Same! Can\'t wait for Friday',
      type: 'text',
      createdAt: now - 86400000 * 2 + 60000,
    },
    {
      id: 'msg-3',
      groupId: 'group-lighthouse',
      authorId: 'user-nathan',
      text: 'Praying for everyone this week. Let\'s stay connected 🙏',
      type: 'prayer',
      createdAt: now - 86400000,
    },
    {
      id: 'msg-4',
      groupId: 'group-lighthouse',
      authorId: 'user-sarah',
      text: 'Got the job I\'ve been praying about for months! God is so faithful ✨',
      type: 'praise',
      createdAt: now - 3600000 * 5,
    }
  );

  // Prayer requests
  state.prayerRequests.push(
    {
      id: 'pr-1',
      groupId: 'group-lighthouse',
      authorId: 'user-jake',
      text: 'Please pray for my dad\'s surgery next week. Trusting God with the outcome.',
      prayerCount: 3,
      prayedByIds: ['user-emma', 'user-sarah', 'user-nathan'],
      answered: false,
      createdAt: now - 86400000 * 3,
    },
    {
      id: 'pr-2',
      groupId: 'group-lighthouse',
      authorId: 'user-emma',
      text: 'Wisdom for a big decision I\'m facing at work. Really need guidance.',
      prayerCount: 2,
      prayedByIds: ['user-jake', 'user-sarah'],
      answered: false,
      createdAt: now - 86400000 * 2,
    },
    {
      id: 'pr-3',
      groupId: 'group-lighthouse',
      authorId: 'user-sarah',
      text: 'Prayed for a job opportunity — and God came through! Sharing this as answered 🙏',
      prayerCount: 4,
      prayedByIds: ['user-emma', 'user-jake', 'user-nathan', 'user-sarah'],
      answered: true,
      createdAt: now - 86400000 * 10,
    }
  );

  // Check-ins
  state.checkIns.push(
    {
      id: 'ci-1',
      groupId: 'group-lighthouse',
      userId: 'user-emma',
      response: 'Grateful for my family and the small moments that make life meaningful.',
      week,
      createdAt: now - 3600000 * 10,
    },
    {
      id: 'ci-2',
      groupId: 'group-lighthouse',
      userId: 'user-jake',
      response: 'Thankful for this group honestly — it keeps me grounded.',
      week,
      createdAt: now - 3600000 * 8,
    }
  );

  setState(state);
}
