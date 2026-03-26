import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Hash, X } from 'lucide-react';
import { getMyGroups, createGroup, joinGroup } from '../lib/storage';
import { GroupCard } from '../components/GroupCard';
import type { Group } from '../lib/types';

type Modal = 'none' | 'create' | 'join';

export function Groups() {
  const navigate = useNavigate();
  const [groups, setGroups] = useState<Group[]>([]);
  const [modal, setModal] = useState<Modal>('none');
  const [error, setError] = useState('');

  // Create form
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [focus, setFocus] = useState('');

  // Join form
  const [code, setCode] = useState('');

  useEffect(() => {
    setGroups(getMyGroups());
  }, []);

  function refresh() {
    setGroups(getMyGroups());
  }

  function handleCreate() {
    if (!name.trim()) { setError('Group name is required'); return; }
    createGroup(name.trim(), desc.trim(), focus.trim() || 'What is God putting on your heart this week?');
    refresh();
    setModal('none');
    setName(''); setDesc(''); setFocus(''); setError('');
  }

  function handleJoin() {
    if (!code.trim()) { setError('Enter an invite code'); return; }
    const group = joinGroup(code.trim());
    if (!group) { setError('Invalid code or group is full'); return; }
    refresh();
    setModal('none');
    setCode(''); setError('');
    navigate(`/groups/${group.id}`);
  }

  return (
    <div className="px-4 pt-14 pb-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-[#1E3A5F] text-2xl font-bold">Groups</h1>
        <div className="flex gap-2">
          <button
            onClick={() => { setModal('join'); setError(''); }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-full border border-[#1E3A5F]/20 text-[#1E3A5F] text-sm font-medium"
          >
            <Hash size={14} /> Join
          </button>
          <button
            onClick={() => { setModal('create'); setError(''); }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-[#1E3A5F] text-white text-sm font-medium"
          >
            <Plus size={14} /> Create
          </button>
        </div>
      </div>

      {groups.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-4xl mb-3">🏡</p>
          <p className="text-[#1E3A5F] font-medium">No groups yet</p>
          <p className="text-[#1E3A5F]/50 text-sm mt-1">Create or join a small group to get started</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {groups.map((g) => (
            <GroupCard key={g.id} group={g} onClick={() => navigate(`/groups/${g.id}`)} />
          ))}
        </div>
      )}

      {/* Modals */}
      <AnimatePresence>
        {modal !== 'none' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-50 flex items-end"
            onClick={(e) => { if (e.target === e.currentTarget) setModal('none'); }}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="bg-[#FAFAF5] w-full rounded-t-3xl p-6 pb-10"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-[#1E3A5F] font-bold text-lg">
                  {modal === 'create' ? 'Create a Group' : 'Join a Group'}
                </h2>
                <button onClick={() => setModal('none')} className="text-[#1E3A5F]/40">
                  <X size={20} />
                </button>
              </div>

              {modal === 'create' ? (
                <div className="flex flex-col gap-3">
                  <input
                    className="w-full bg-white border border-[#1E3A5F]/15 rounded-xl px-4 py-3 text-[#1E3A5F] text-sm outline-none focus:border-[#C9A853]"
                    placeholder="Group name *"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  <textarea
                    className="w-full bg-white border border-[#1E3A5F]/15 rounded-xl px-4 py-3 text-[#1E3A5F] text-sm outline-none focus:border-[#C9A853] resize-none"
                    placeholder="Description (optional)"
                    rows={2}
                    value={desc}
                    onChange={(e) => setDesc(e.target.value)}
                  />
                  <input
                    className="w-full bg-white border border-[#1E3A5F]/15 rounded-xl px-4 py-3 text-[#1E3A5F] text-sm outline-none focus:border-[#C9A853]"
                    placeholder="Weekly focus question (optional)"
                    value={focus}
                    onChange={(e) => setFocus(e.target.value)}
                  />
                  {error && <p className="text-red-500 text-xs">{error}</p>}
                  <button
                    onClick={handleCreate}
                    className="w-full bg-[#1E3A5F] text-white rounded-xl py-3 font-semibold mt-2"
                  >
                    Create Group
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  <p className="text-[#1E3A5F]/60 text-sm">Enter the 6-digit invite code from your group leader.</p>
                  <input
                    className="w-full bg-white border border-[#1E3A5F]/15 rounded-xl px-4 py-3 text-[#1E3A5F] text-sm outline-none focus:border-[#C9A853] tracking-widest text-center font-mono text-lg uppercase"
                    placeholder="ABC123"
                    maxLength={6}
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                  />
                  {error && <p className="text-red-500 text-xs text-center">{error}</p>}
                  <button
                    onClick={handleJoin}
                    className="w-full bg-[#1E3A5F] text-white rounded-xl py-3 font-semibold mt-2"
                  >
                    Join Group
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
