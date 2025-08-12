'use client';

import type { User } from '@/lib/types';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Bot } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

type UserAvatarProps = {
  user: User;
};

export default function UserAvatar({ user }: UserAvatarProps) {
  return (
    <TooltipProvider delayDuration={100}>
      <Tooltip>
        <TooltipTrigger>
          <Avatar className="w-8 h-8">
            <AvatarFallback
              style={{ backgroundColor: user.avatarColor }}
              className="text-white dark:text-black font-bold"
            >
              {user.id === 'ai-bot' ? <Bot className="w-5 h-5"/> : user.name[0].toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </TooltipTrigger>
        <TooltipContent>
          <p>{user.name}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
