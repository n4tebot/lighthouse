# FaithGroup MVP Brief

## What We're Building
A faith-based small group app that works as a PWA (installable on iPhone/Android).
People can form private small groups to discuss life, faith, pray together, and stay accountable.

## Tech Stack
- React 18 (Vite)
- TypeScript
- Tailwind CSS
- framer-motion (subtle animations)
- localStorage as DB (no backend needed for MVP demo)
- PWA: manifest.json + service worker

## Core Features

### 1. Auth (fake, localStorage)
- Name + profile photo (emoji avatar picker)
- Simple onboarding — no password needed for demo

### 2. Groups
- Create a group (give it a name + description)
- Join via 6-digit invite code
- Max 8 members per group (intimate feel)
- Each group has: name, description, cover color/gradient, member list

### 3. Group Chat
- Real-time feel (messages stored in localStorage)
- Message types: text, prayer request (special styling with 🙏 icon), praise report (✨ icon)
- Timestamps, sender name + avatar

### 4. Weekly Accountability
- Each group has a weekly "focus" — a question or challenge
- Example: "This week's focus: Share one thing you're grateful for"
- Members can check in with a short response
- Shows who has checked in vs not (gentle accountability)

### 5. Prayer Wall
- Members post prayer requests
- Others can react with 🙏 (like a like, but for prayer)
- Answered prayers get marked with ✅

### 6. Navigation
- Bottom tab bar (mobile-first): Home, Groups, Prayer, Profile

## Design Aesthetic
- Clean, warm, modern mobile app feel
- NOT religious kitsch — think calm, minimal, intentional
- Warm cream/off-white background
- Soft navy + warm gold accents
- Rounded cards, generous whitespace
- Font: Inter or system font, clean

## PWA Requirements
- manifest.json with app name, icons, theme color
- Service worker for offline support
- Meta tags for iOS "Add to Home Screen"
- Viewport meta for mobile

## App Name Ideas
- **Haven** — private safe spaces
- **Grove** — small groups that grow
- **Gather** — coming together

Go with "Haven" — clean, memorable.

## File Structure
```
src/
  components/
    Layout.tsx (bottom nav, app shell)
    GroupCard.tsx
    MessageBubble.tsx
    PrayerCard.tsx
    CheckInCard.tsx
    Avatar.tsx
  pages/
    Home.tsx (welcome, your groups)
    Groups.tsx (create/join group)
    GroupDetail.tsx (chat + weekly focus)
    Prayer.tsx (prayer wall)
    Profile.tsx
  lib/
    storage.ts (localStorage helpers)
    types.ts (TypeScript types)
    seed.ts (seed some demo data)
  App.tsx
  main.tsx
```

## Demo Data
Pre-seed with:
- User: "Nathan" with some messages
- One group: "Lighthouse" with 3 other fake members
- A few messages in the chat
- 2-3 prayer requests
- A weekly focus prompt

## After Building
1. npm run build — must pass
2. git add -A && git commit -m "Initial build: Haven faith small group PWA"
3. Push to new public GitHub repo: n4tebot/haven
4. Include README with setup instructions
