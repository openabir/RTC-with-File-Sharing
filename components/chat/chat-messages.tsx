'use client';

import { useEffect, useRef } from 'react';
import type { Message, User } from '@/lib/types';
import ChatMessage from '@/components/chat/chat-message';
import { ScrollArea } from '@/components/ui/scroll-area';

type ChatMessagesProps = {
  messages: Message[];
  currentUser: User | null;
};

export default function ChatMessages({
  messages,
  currentUser,
}: ChatMessagesProps) {
  const viewportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (viewportRef.current) {
      viewportRef.current.scrollTo({
        top: viewportRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages]);

  return (
    <ScrollArea className="flex-1">
      <div className="p-4 space-y-4" ref={viewportRef}>
        {messages.map((message) => (
          <ChatMessage
            key={message.id}
            message={message}
            isCurrentUser={currentUser?.id === message.sender.id}
          />
        ))}
      </div>
    </ScrollArea>
  );
}
