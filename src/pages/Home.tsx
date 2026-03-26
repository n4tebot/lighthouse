import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, Sparkles } from 'lucide-react';
import { getCurrentUser, getMyGroups, getGroupById, getAllPrayerRequests, getUserById } from '../lib/storage';
import { GroupCard } from '../components/GroupCard';
import { Avatar } from '../components/Avatar';
import type { Group, PrayerRequest } from '../lib/types';

export function Home() {
  const navigate = useNavigate();
  const [user, setUser] = useState(getCurrentUser());
  const [groups, setGroups] = useState<Group[]>([]);
  const [recentPrayers, setRecentPrayers] = useState<PrayerRequest[]>([]);

  useEffect(() => {
    const u = getCurrentUser();
    setUser(u);
    if (u) {
      setGroups(getMyGroups());
      setRecentPrayers(getAllPrayerRequests().slice(0, 2));
    }
  }, []);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="px-4 pt-14 pb-4">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-8"
      >
        <div>
          <p className="text-[#1E3A5F]/50 text-sm">{greeting}</p>
          <h1 className="text-[#1E3A5F] text-2xl font-bold">{user?.name ?? 'Friend'} {user?.avatar}</h1>
        </div>
        <div className="w-10 h-10 rounded-full bg-[#C9A853]/20 flex items-center justify-center">
          <Sparkles size={18} className="text-[#C9A853]" />
        </div>
      </motion.div>

      {/* My Groups */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-[#1E3A5F] font-semibold text-base">My Groups</h2>
          <button
            onClick={() => navigate('/groups')}
            className="text-[#C9A853] text-sm font-medium flex items-center gap-0.5"
          >
            See all <ChevronRight size={14} />
          </button>
        </div>

        {groups.length === 0 ? (
          <div className="bg-white rounded-2xl p-6 text-center border border-[#1E3A5F]/8">
            <p className="text-[#1E3A5F]/40 text-sm mb-3">No groups yet</p>
            <button
              onClick={() => navigate('/groups')}
              className="bg-[#1E3A5F] text-white px-4 py-2 rounded-full text-sm font-medium"
            >
              Join or create one
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {groups.map((g) => (
              <GroupCard key={g.id} group={g} onClick={() => navigate(`/groups/${g.id}`)} />
            ))}
          </div>
        )}
      </section>

      {/* Recent Prayers */}
      {recentPrayers.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-[#1E3A5F] font-semibold text-base">Recent Prayers</h2>
            <button
              onClick={() => navigate('/prayer')}
              className="text-[#C9A853] text-sm font-medium flex items-center gap-0.5"
            >
              See all <ChevronRight size={14} />
            </button>
          </div>
          <div className="flex flex-col gap-3">
            {recentPrayers.map((pr) => {
              const author = getUserById(pr.authorId);
              const group = getGroupById(pr.groupId);
              return (
                <div key={pr.id} className="bg-white rounded-xl p-3 border border-[#1E3A5F]/8 flex gap-3">
                  <Avatar emoji={author?.avatar ?? '👤'} size="sm" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-xs font-medium text-[#1E3A5F]/60">{author?.name}</span>
                      {group && <span className="text-[10px] text-[#1E3A5F]/30">· {group.name}</span>}
                    </div>
                    <p className="text-sm text-[#1E3A5F] truncate">{pr.text}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
