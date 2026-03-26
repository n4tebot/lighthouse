import { useState } from 'react';
import { motion } from 'framer-motion';
import { createUser } from '../lib/storage';

const AVATARS = ['🔥', '🌿', '⚡', '🌸', '🌊', '🦋', '🌙', '⭐', '🍃', '🌺', '🎯', '💫', '🌈', '🔮', '🦁', '🐬'];

interface OnboardingProps {
  onComplete: () => void;
}

export function Onboarding({ onComplete }: OnboardingProps) {
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState('🔥');
  const [step, setStep] = useState<'welcome' | 'setup'>('welcome');

  function handleStart() {
    if (!name.trim()) return;
    createUser(name.trim(), avatar);
    onComplete();
  }

  return (
    <div className="min-h-screen bg-[#FAFAF5] flex flex-col items-center justify-center px-6">
      {step === 'welcome' ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-sm text-center"
        >
          <div className="w-20 h-20 rounded-3xl bg-[#1E3A5F] flex items-center justify-center mx-auto mb-6 shadow-lg">
            <span className="text-4xl">🏠</span>
          </div>
          <h1 className="text-[#1E3A5F] text-3xl font-bold mb-2">Lighthouse</h1>
          <p className="text-[#1E3A5F]/60 text-base mb-2">Your small group, connected.</p>
          <p className="text-[#1E3A5F]/40 text-sm mb-10 leading-relaxed">
            A private space for your small group to pray, share, and grow together.
          </p>

          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3 bg-white rounded-2xl p-4 border border-[#1E3A5F]/8 text-left">
              <span className="text-2xl">🙏</span>
              <div>
                <p className="text-[#1E3A5F] font-medium text-sm">Prayer Wall</p>
                <p className="text-[#1E3A5F]/40 text-xs">Share requests, celebrate answers</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-white rounded-2xl p-4 border border-[#1E3A5F]/8 text-left">
              <span className="text-2xl">✅</span>
              <div>
                <p className="text-[#1E3A5F] font-medium text-sm">Weekly Check-ins</p>
                <p className="text-[#1E3A5F]/40 text-xs">Stay accountable, stay connected</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-white rounded-2xl p-4 border border-[#1E3A5F]/8 text-left">
              <span className="text-2xl">💬</span>
              <div>
                <p className="text-[#1E3A5F] font-medium text-sm">Group Chat</p>
                <p className="text-[#1E3A5F]/40 text-xs">Text, prayer requests, praise reports</p>
              </div>
            </div>
          </div>

          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => setStep('setup')}
            className="w-full mt-8 bg-[#1E3A5F] text-white py-4 rounded-2xl font-semibold text-base shadow-md"
          >
            Get Started
          </motion.button>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-sm"
        >
          <h2 className="text-[#1E3A5F] text-2xl font-bold mb-2">Create your profile</h2>
          <p className="text-[#1E3A5F]/50 text-sm mb-8">Just your name and a little avatar. No password needed.</p>

          <p className="text-[#1E3A5F] font-medium text-sm mb-3">Pick an avatar</p>
          <div className="grid grid-cols-8 gap-2 mb-6">
            {AVATARS.map((em) => (
              <motion.button
                key={em}
                whileTap={{ scale: 0.85 }}
                onClick={() => setAvatar(em)}
                className={`w-10 h-10 rounded-full text-xl flex items-center justify-center transition-all ${
                  avatar === em ? 'bg-[#1E3A5F]/15 ring-2 ring-[#C9A853]' : 'bg-white'
                }`}
              >
                {em}
              </motion.button>
            ))}
          </div>

          <label className="text-[#1E3A5F]/60 text-xs mb-1 block">Your name</label>
          <input
            className="w-full bg-white border border-[#1E3A5F]/15 rounded-2xl px-4 py-3.5 text-[#1E3A5F] text-base outline-none focus:border-[#C9A853] mb-6"
            placeholder="e.g. Nathan"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
            onKeyDown={(e) => { if (e.key === 'Enter') handleStart(); }}
          />

          <div className="flex items-center gap-3 mb-6 bg-[#C9A853]/10 rounded-xl p-3">
            <span className="text-3xl">{avatar}</span>
            <div>
              <p className="text-[#1E3A5F] font-medium">{name || 'Your name here'}</p>
              <p className="text-[#1E3A5F]/40 text-xs">Your profile</p>
            </div>
          </div>

          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleStart}
            disabled={!name.trim()}
            className="w-full bg-[#1E3A5F] text-white py-4 rounded-2xl font-semibold text-base disabled:opacity-30 shadow-md"
          >
            Enter Lighthouse
          </motion.button>
        </motion.div>
      )}
    </div>
  );
}
