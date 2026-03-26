import type { Message, User } from '../lib/types';
import { Avatar } from './Avatar';

interface MessageBubbleProps {
  message: Message;
  author: User | undefined;
  isMe: boolean;
}

function formatTime(ts: number): string {
  const d = new Date(ts);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

const typeStyles: Record<Message['type'], string> = {
  text: '',
  prayer: 'border-l-4 border-[#C9A853] bg-[#C9A853]/8',
  praise: 'border-l-4 border-[#4A7BC8] bg-[#4A7BC8]/8',
};

const typePrefix: Record<Message['type'], string> = {
  text: '',
  prayer: '🙏 ',
  praise: '✨ ',
};

export function MessageBubble({ message, author, isMe }: MessageBubbleProps) {
  const isPrayerOrPraise = message.type !== 'text';

  return (
    <div className={`flex gap-2 items-end ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
      {!isMe && (
        <Avatar emoji={author?.avatar ?? '👤'} size="sm" />
      )}
      <div className={`flex flex-col gap-0.5 max-w-[72%] ${isMe ? 'items-end' : 'items-start'}`}>
        {!isMe && (
          <span className="text-xs text-[#1E3A5F]/50 ml-1">{author?.name ?? 'Someone'}</span>
        )}
        <div
          className={`rounded-2xl px-3 py-2 text-sm ${
            isPrayerOrPraise
              ? `${typeStyles[message.type]} text-[#1E3A5F] rounded-tl-sm`
              : isMe
              ? 'bg-[#1E3A5F] text-white rounded-br-sm'
              : 'bg-white text-[#1E3A5F] rounded-bl-sm border border-[#1E3A5F]/8'
          }`}
        >
          <span>{typePrefix[message.type]}{message.text}</span>
        </div>
        <span className="text-[10px] text-[#1E3A5F]/30 mx-1">{formatTime(message.createdAt)}</span>
      </div>
    </div>
  );
}
