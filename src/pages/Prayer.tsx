import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X } from 'lucide-react';
import {
  getAllPrayerRequests,
  addPrayerRequest,
  prayForRequest,
  markAnswered,
  getCurrentUser,
  getUserById,
  getMyGroups,
} from '../lib/storage';
import { PrayerCard } from '../components/PrayerCard';
import type { PrayerRequest, Group } from '../lib/types';

export function Prayer() {
  const [prayers, setPrayers] = useState<PrayerRequest[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [newText, setNewText] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('');
  const [filter, setFilter] = useState<'all' | 'answered'>('all');
  const currentUser = getCurrentUser();

  useEffect(() => {
    refresh();
    const g = getMyGroups();
    setGroups(g);
    if (g.length > 0) setSelectedGroup(g[0].id);
  }, []);

  function refresh() {
    setPrayers(getAllPrayerRequests().sort((a, b) => b.createdAt - a.createdAt));
  }

  function handleAdd() {
    if (!newText.trim() || !selectedGroup) return;
    addPrayerRequest(selectedGroup, newText.trim());
    setNewText('');
    setShowAdd(false);
    refresh();
  }

  function handlePray(id: string) {
    prayForRequest(id);
    refresh();
  }

  function handleAnswered(id: string) {
    markAnswered(id);
    refresh();
  }

  const filtered = filter === 'answered'
    ? prayers.filter((p) => p.answered)
    : prayers.filter((p) => !p.answered);

  return (
    <div className="px-4 pt-14 pb-4">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-[#1E3A5F] text-2xl font-bold">Prayer Wall</h1>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => setShowAdd(true)}
          className="w-9 h-9 rounded-full bg-[#1E3A5F] text-white flex items-center justify-center"
        >
          <Plus size={18} />
        </motion.button>
      </div>

      <p className="text-[#1E3A5F]/50 text-sm mb-5">Lift each other up in prayer 🙏</p>

      {/* Filter */}
      <div className="flex gap-2 mb-5">
        {(['all', 'answered'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              filter === f
                ? 'bg-[#1E3A5F] text-white'
                : 'bg-[#1E3A5F]/8 text-[#1E3A5F]/50'
            }`}
          >
            {f === 'all' ? 'Active' : '✅ Answered'}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-3xl mb-3">🙏</p>
          <p className="text-[#1E3A5F]/40 text-sm">
            {filter === 'answered' ? 'No answered prayers yet' : 'No prayer requests yet'}
          </p>
          {filter === 'all' && (
            <button
              onClick={() => setShowAdd(true)}
              className="mt-4 text-[#C9A853] text-sm font-medium underline"
            >
              Add the first one
            </button>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((pr) => {
            const author = getUserById(pr.authorId);
            return (
              <PrayerCard
                key={pr.id}
                prayer={pr}
                author={author}
                currentUserId={currentUser?.id ?? ''}
                onPray={handlePray}
                onMarkAnswered={handleAnswered}
                isMyRequest={pr.authorId === currentUser?.id}
              />
            );
          })}
        </div>
      )}

      {/* Add Prayer Modal */}
      <AnimatePresence>
        {showAdd && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-50 flex items-end"
            onClick={(e) => { if (e.target === e.currentTarget) setShowAdd(false); }}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="bg-[#FAFAF5] w-full rounded-t-3xl p-6 pb-10"
            >
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-[#1E3A5F] font-bold text-lg">Add Prayer Request</h2>
                <button onClick={() => setShowAdd(false)} className="text-[#1E3A5F]/40">
                  <X size={20} />
                </button>
              </div>

              {groups.length > 1 && (
                <div className="mb-3">
                  <label className="text-xs text-[#1E3A5F]/50 mb-1 block">Group</label>
                  <select
                    className="w-full bg-white border border-[#1E3A5F]/15 rounded-xl px-4 py-3 text-[#1E3A5F] text-sm outline-none"
                    value={selectedGroup}
                    onChange={(e) => setSelectedGroup(e.target.value)}
                  >
                    {groups.map((g) => (
                      <option key={g.id} value={g.id}>{g.name}</option>
                    ))}
                  </select>
                </div>
              )}

              <textarea
                className="w-full bg-white border border-[#1E3A5F]/15 rounded-xl px-4 py-3 text-[#1E3A5F] text-sm outline-none focus:border-[#C9A853] resize-none"
                placeholder="What would you like prayer for?"
                rows={4}
                value={newText}
                onChange={(e) => setNewText(e.target.value)}
                autoFocus
              />

              <button
                onClick={handleAdd}
                disabled={!newText.trim() || !selectedGroup}
                className="w-full mt-3 bg-[#1E3A5F] text-white rounded-xl py-3 font-semibold disabled:opacity-30"
              >
                Share Request
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
