interface AvatarProps {
  emoji: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizes = {
  sm: 'w-8 h-8 text-base',
  md: 'w-10 h-10 text-xl',
  lg: 'w-14 h-14 text-3xl',
};

export function Avatar({ emoji, size = 'md', className = '' }: AvatarProps) {
  return (
    <div
      className={`${sizes[size]} rounded-full bg-[#1E3A5F]/10 flex items-center justify-center flex-shrink-0 ${className}`}
    >
      {emoji}
    </div>
  );
}
