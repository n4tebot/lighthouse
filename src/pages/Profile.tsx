import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getCurrentUser, updateCurrentUser, getMyGroups } from '../lib/storage';
import type { User, Group } from '../lib/types';

const AVATARS = ['🔥', '🌿', '⚡', '🌸', '🌊', '🦋', '🌙', '⭐', '🍃', '🌺', '🎯', '💫', '🌈', '🔮', '🦁', '🐬'];

export function Profile() {
  const [user, setUser] = useState<User | null>(getCurrentUser());
  const [groups, setGroups] = useState<Group[]>([]);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState('');

  useEffect(() => {
    const u = getCurrentUser();
    setUser(u);
    if (u) {
      setName(u.name);
      setAvatar(u.avatar);
      setGroups(getMyGroups());
    }
  }, []);

  function handleSave() {
    if (!name.trim()) return;
    updateCurrentUser(name.trim(), avatar);
    setUser(getCurrentUser());
    setEditing(false);
  }

  if (!user) return null;

  return (
    <div className="px-4 pt-14 pb-8">
      <h1 className="text-[#1E3A5F] text-2xl font-bold mb-8">Profile</h1>

      {/* Avatar + Name */}
      <div className="flex flex-col items-center mb-8">
        <div className="w-20 h-20 rounded-full bg-[#1E3A5F]/10 flex items-center justify-center text-4xl mb-3">
          {user.avatar}
        </div>
        <h2 className="text-[#1E3A5F] text-xl font-bold">{user.name}</h2>
        <p className="text-[#1E3A5F]/40 text-sm mt-0.5">Member of {groups.length} group{groups.length !== 1 ? 's' : ''}</p>
      </div>

      {/* Edit section */}
      {editing ? (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-4 border border-[#1E3A5F]/8 mb-4"
        >
          <p className="text-[#1E3A5F] font-medium text-sm mb-3">Choose your avatar</p>
          <div className="grid grid-cols-8 gap-2 mb-4">
            {AVATARS.map((em) => (
              <motion.button
                key={em}
                whileTap={{ scale: 0.85 }}
                onClick={() => setAvatar(em)}
                className={`w-9 h-9 rounded-full text-xl flex items-center justify-center transition-all ${
                  avatar === em ? 'bg-[#1E3A5F]/15 ring-2 ring-[#C9A853]' : 'hover:bg-[#1E3A5F]/8'
                }`}
              >
                {em}
              </motion.button>
            ))}
          </div>

          <label className="text-xs text-[#1E3A5F]/50 mb-1 block">Name</label>
          <input
            className="w-full bg-[#FAFAF5] border border-[#1E3A5F]/15 rounded-xl px-4 py-3 text-[#1E3A5F] text-sm outline-none focus:border-[#C9A853] mb-3"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <div className="flex gap-2">
            <button
              onClick={() => setEditing(false)}
              className="flex-1 py-2.5 rounded-xl border border-[#1E3A5F]/20 text-[#1E3A5F] text-sm font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex-1 py-2.5 rounded-xl bg-[#1E3A5F] text-white text-sm font-medium"
            >
              Save
            </button>
          </div>
        </motion.div>
      ) : (
        <button
          onClick={() => setEditing(true)}
          className="w-full py-3 rounded-xl border border-[#1E3A5F]/20 text-[#1E3A5F] text-sm font-medium mb-6"
        >
          Edit Profile
        </button>
      )}

      {/* My Groups */}
      {groups.length > 0 && (
        <div>
          <p className="text-[#1E3A5F] font-semibold text-sm mb-3">My Groups</p>
          <div className="flex flex-col gap-2">
            {groups.map((g) => (
              <div key={g.id} className={`bg-gradient-to-r ${g.coverColor} rounded-xl px-4 py-3 flex items-center justify-between`}>
                <div>
                  <p className="text-white font-medium text-sm">{g.name}</p>
                  <p className="text-white/60 text-xs">{g.memberIds.length} members</p>
                </div>
                <div className="text-white/60 text-xs font-mono">{g.inviteCode}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* App info */}
      <div className="mt-10 text-center">
        <p className="text-[#C9A853] text-lg font-bold tracking-tight">Haven</p>
        <p className="text-[#1E3A5F]/30 text-xs mt-0.5">Faith. Community. Growth.</p>
      </div>
    </div>
  );
}
