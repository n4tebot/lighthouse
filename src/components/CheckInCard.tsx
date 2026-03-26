import { motion } from 'framer-motion';
import type { CheckIn, User } from '../lib/types';
import { Avatar } from './Avatar';

interface CheckInCardProps {
  checkIn: CheckIn;
  user: User | undefined;
}

export function CheckInCard({ checkIn, user }: CheckInCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex gap-3 items-start"
    >
      <Avatar emoji={user?.avatar ?? '👤'} size="sm" />
      <div className="flex-1 bg-white rounded-xl p-3 border border-[#1E3A5F]/8">
        <span className="text-xs font-medium text-[#1E3A5F]/50 block mb-1">{user?.name ?? 'Someone'}</span>
        <p className="text-sm text-[#1E3A5F]">{checkIn.response}</p>
      </div>
    </motion.div>
  );
}
