import { motion } from 'framer-motion';
import type { PrayerRequest, User } from '../lib/types';
import { Avatar } from './Avatar';

interface PrayerCardProps {
  prayer: PrayerRequest;
  author: User | undefined;
  currentUserId: string;
  onPray: (id: string) => void;
  onMarkAnswered: (id: string) => void;
  isMyRequest: boolean;
}

function formatDate(ts: number): string {
  const d = new Date(ts);
  return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
}

export function PrayerCard({ prayer, author, currentUserId, onPray, onMarkAnswered, isMyRequest }: PrayerCardProps) {
  const hasPrayed = prayer.prayedByIds.includes(currentUserId);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white rounded-2xl p-4 border shadow-sm ${
        prayer.answered ? 'border-[#C9A853]/40' : 'border-[#1E3A5F]/8'
      }`}
    >
      {prayer.answered && (
        <div className="flex items-center gap-1 text-xs text-[#C9A853] font-medium mb-2">
          <span>✅</span>
          <span>Answered</span>
        </div>
      )}
      <div className="flex gap-3">
        <Avatar emoji={author?.avatar ?? '👤'} size="sm" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-medium text-[#1E3A5F]/60">{author?.name ?? 'Someone'}</span>
            <span className="text-[10px] text-[#1E3A5F]/30">{formatDate(prayer.createdAt)}</span>
          </div>
          <p className="text-sm text-[#1E3A5F] leading-relaxed">{prayer.text}</p>
        </div>
      </div>

      <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#1E3A5F]/6">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => onPray(prayer.id)}
          className={`flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-full transition-colors ${
            hasPrayed
              ? 'bg-[#C9A853]/15 text-[#C9A853]'
              : 'bg-[#1E3A5F]/6 text-[#1E3A5F]/50'
          }`}
        >
          <span>🙏</span>
          <span className="font-medium">{prayer.prayerCount}</span>
        </motion.button>

        {isMyRequest && !prayer.answered && (
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => onMarkAnswered(prayer.id)}
            className="text-xs text-[#1E3A5F]/40 underline"
          >
            Mark answered
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}
