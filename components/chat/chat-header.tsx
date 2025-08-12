'use client';

import { Settings, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

type ChatHeaderProps = {
  onSettingsClick: () => void;
};

export default function ChatHeader({ onSettingsClick }: ChatHeaderProps) {
  return (
    <header>
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-2">
           <MessageSquare className="w-8 h-8 text-primary" />
           <h1 className="text-2xl font-bold text-primary font-headline">FileShareChat</h1>
        </div>
        <Button variant="ghost" size="icon" onClick={onSettingsClick} aria-label="Open settings">
          <Settings className="w-6 h-6" />
        </Button>
      </div>
      <Separator />
    </header>
  );
}
