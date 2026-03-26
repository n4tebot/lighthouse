import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Send, ChevronDown, ChevronUp, Copy, Check } from 'lucide-react';
import {
  getGroupById,
  getMessages,
  sendMessage,
  getCurrentUser,
  getUserById,
  getCheckIns,
  submitCheckIn,
  hasCheckedIn,
} from '../lib/storage';
import { MessageBubble } from '../components/MessageBubble';
import { CheckInCard } from '../components/CheckInCard';
import { Avatar } from '../components/Avatar';
import type { Group, Message, CheckIn, MessageType } from '../lib/types';

type Tab = 'chat' | 'checkin';

export function GroupDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const currentUser = getCurrentUser();

  const [group, setGroup] = useState<Group | undefined>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [checkIns, setCheckIns] = useState<CheckIn[]>([]);
  const [tab, setTab] = useState<Tab>('chat');
  const [text, setText] = useState('');
  const [msgType, setMsgType] = useState<MessageType>('text');
  const [showInvite, setShowInvite] = useState(false);
  const [copied, setCopied] = useState(false);
  const [checkInText, setCheckInText] = useState('');
  const [checkedIn, setCheckedIn] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!id) return;
    const g = getGroupById(id);
    setGroup(g);
    if (g) {
      setMessages(getMessages(id));
      setCheckIns(getCheckIns(id));
      setCheckedIn(hasCheckedIn(id));
    }
  }, [id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  function handleSend() {
    if (!text.trim() || !id) return;
    sendMessage(id, text.trim(), msgType);
    setText('');
    setMessages(getMessages(id));
  }

  function handleCheckIn() {
    if (!checkInText.trim() || !id) return;
    submitCheckIn(id, checkInText.trim());
    setCheckInText('');
    setCheckedIn(true);
    setCheckIns(getCheckIns(id));
  }

  function copyInviteCode() {
    if (!group) return;
    navigator.clipboard.writeText(group.inviteCode).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (!group) return (
    <div className="flex items-center justify-center h-screen text-[#1E3A5F]/40">Group not found</div>
  );

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className={`bg-gradient-to-r ${group.coverColor} px-4 pt-14 pb-4 flex-shrink-0`}>
        <div className="flex items-center gap-3 mb-3">
          <button onClick={() => navigate(-1)} className="text-white/80">
            <ArrowLeft size={20} />
          </button>
          <div className="flex-1">
            <h1 className="text-white font-bold text-lg">{group.name}</h1>
            <p className="text-white/60 text-xs">{group.memberIds.length} members</p>
          </div>
          <button
            onClick={() => setShowInvite(!showInvite)}
            className="text-white/80"
          >
            {showInvite ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
        </div>

        {/* Member avatars */}
        <div className="flex gap-1.5 mb-3">
          {group.memberIds.slice(0, 6).map((mid) => {
            const u = getUserById(mid);
            return <Avatar key={mid} emoji={u?.avatar ?? '👤'} size="sm" className="border-2 border-white/20" />;
          })}
          {group.memberIds.length > 6 && (
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white text-xs">
              +{group.memberIds.length - 6}
            </div>
          )}
        </div>

        {/* Invite code panel */}
        <AnimatePresence>
          {showInvite && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="bg-white/15 rounded-xl p-3 flex items-center justify-between">
                <div>
                  <p className="text-white/60 text-xs mb-0.5">Invite Code</p>
                  <p className="text-white font-mono font-bold text-xl tracking-widest">{group.inviteCode}</p>
                </div>
                <button
                  onClick={copyInviteCode}
                  className="flex items-center gap-1.5 bg-white/20 text-white text-sm px-3 py-1.5 rounded-lg"
                >
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tabs */}
        <div className="flex gap-2 mt-3">
          {(['chat', 'checkin'] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                tab === t ? 'bg-white text-[#1E3A5F]' : 'text-white/70'
              }`}
            >
              {t === 'chat' ? 'Chat' : 'Check-in'}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {tab === 'chat' ? (
        <>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-3">
            {messages.length === 0 && (
              <div className="text-center py-8 text-[#1E3A5F]/30 text-sm">
                No messages yet. Say hi!
              </div>
            )}
            {messages.map((msg) => {
              const author = getUserById(msg.authorId);
              const isMe = msg.authorId === currentUser?.id;
              return <MessageBubble key={msg.id} message={msg} author={author} isMe={isMe} />;
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <div className="flex-shrink-0 bg-white border-t border-[#1E3A5F]/8 px-3 py-3" style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 84px)' }}>
            {/* Type selector */}
            <div className="flex gap-2 mb-2">
              {(['text', 'prayer', 'praise'] as MessageType[]).map((t) => (
                <button
                  key={t}
                  onClick={() => setMsgType(t)}
                  className={`text-xs px-2.5 py-1 rounded-full transition-colors ${
                    msgType === t
                      ? 'bg-[#1E3A5F] text-white'
                      : 'bg-[#1E3A5F]/8 text-[#1E3A5F]/50'
                  }`}
                >
                  {t === 'text' ? 'Message' : t === 'prayer' ? '🙏 Prayer' : '✨ Praise'}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                className="flex-1 bg-[#FAFAF5] border border-[#1E3A5F]/15 rounded-xl px-3 py-2.5 text-sm text-[#1E3A5F] outline-none focus:border-[#C9A853]"
                placeholder={
                  msgType === 'prayer' ? 'Share a prayer request...' :
                  msgType === 'praise' ? 'Share a praise report...' :
                  'Type a message...'
                }
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleSend(); }}
              />
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={handleSend}
                disabled={!text.trim()}
                className="w-10 h-10 rounded-xl bg-[#1E3A5F] text-white flex items-center justify-center disabled:opacity-30"
              >
                <Send size={16} />
              </motion.button>
            </div>
          </div>
        </>
      ) : (
        /* Check-in Tab */
        <div className="flex-1 overflow-y-auto px-4 py-4">
          {/* Weekly Focus */}
          <div className="bg-[#C9A853]/12 border border-[#C9A853]/30 rounded-2xl p-4 mb-5">
            <p className="text-[#C9A853] text-xs font-semibold uppercase tracking-wide mb-1">This Week's Focus</p>
            <p className="text-[#1E3A5F] text-sm leading-relaxed">{group.weeklyFocus}</p>
          </div>

          {/* My check-in */}
          {!checkedIn ? (
            <div className="mb-5">
              <p className="text-[#1E3A5F] font-medium text-sm mb-2">Your response</p>
              <textarea
                className="w-full bg-white border border-[#1E3A5F]/15 rounded-xl px-4 py-3 text-[#1E3A5F] text-sm outline-none focus:border-[#C9A853] resize-none"
                placeholder="Share your response..."
                rows={3}
                value={checkInText}
                onChange={(e) => setCheckInText(e.target.value)}
              />
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={handleCheckIn}
                disabled={!checkInText.trim()}
                className="w-full mt-2 bg-[#1E3A5F] text-white rounded-xl py-3 font-semibold text-sm disabled:opacity-30"
              >
                Check In
              </motion.button>
            </div>
          ) : (
            <div className="mb-5 bg-[#1E3A5F]/6 rounded-xl p-3 text-center">
              <span className="text-[#1E3A5F]/60 text-sm">✓ You checked in this week</span>
            </div>
          )}

          {/* Who checked in */}
          <p className="text-[#1E3A5F] font-medium text-sm mb-3">
            {checkIns.length} / {group.memberIds.length} checked in
          </p>

          <div className="flex flex-col gap-3 mb-5">
            {checkIns.map((ci) => {
              const user = getUserById(ci.userId);
              return <CheckInCard key={ci.id} checkIn={ci} user={user} />;
            })}
          </div>

          {/* Who hasn't checked in */}
          {(() => {
            const checkedInIds = checkIns.map((c) => c.userId);
            const pending = group.memberIds.filter((mid) => !checkedInIds.includes(mid));
            if (pending.length === 0) return null;
            return (
              <div>
                <p className="text-[#1E3A5F]/40 text-xs font-medium mb-2">Still waiting on</p>
                <div className="flex gap-2 flex-wrap">
                  {pending.map((mid) => {
                    const u = getUserById(mid);
                    return (
                      <div key={mid} className="flex items-center gap-1.5 bg-white border border-[#1E3A5F]/8 rounded-full px-3 py-1.5">
                        <span className="text-sm">{u?.avatar ?? '👤'}</span>
                        <span className="text-xs text-[#1E3A5F]/50">{u?.name ?? 'Someone'}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
}
