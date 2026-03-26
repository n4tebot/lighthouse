import { motion } from 'framer-motion';
import { Users } from 'lucide-react';
import type { Group } from '../lib/types';

interface GroupCardProps {
  group: Group;
  onClick: () => void;
}

export function GroupCard({ group, onClick }: GroupCardProps) {
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className="w-full text-left rounded-2xl overflow-hidden shadow-sm border border-[#1E3A5F]/8"
    >
      {/* Cover gradient */}
      <div className={`h-20 bg-gradient-to-br ${group.coverColor} flex items-end px-4 pb-3`}>
        <h3 className="text-white font-semibold text-lg">{group.name}</h3>
      </div>
      {/* Body */}
      <div className="bg-white px-4 py-3">
        <p className="text-[#1E3A5F]/60 text-sm line-clamp-2">{group.description}</p>
        <div className="flex items-center gap-1 mt-2 text-[#1E3A5F]/40 text-xs">
          <Users size={12} />
          <span>{group.memberIds.length} members</span>
        </div>
      </div>
    </motion.button>
  );
}
