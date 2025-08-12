'use client';

import { useState, useRef, KeyboardEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Paperclip, Send, Loader2 } from 'lucide-react';
import { Textarea } from '../ui/textarea';

type ChatInputProps = {
  onSendMessage: (content: string) => void;
  onSendFile: (file: File) => void;
  isSummarizing: boolean;
};

export default function ChatInput({
  onSendMessage,
  onSendFile,
  isSummarizing,
}: ChatInputProps) {
  const [inputValue, setInputValue] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSend = () => {
    if (inputValue.trim()) {
      onSendMessage(inputValue);
      setInputValue('');
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onSendFile(file);
    }
  };

  return (
    <div className="p-4 border-t bg-background">
      <div className="relative">
        <Textarea
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message or drop a file..."
          className="pr-24 min-h-[52px] resize-none"
          rows={1}
        />
        <div className="absolute top-1/2 right-2 transform -translate-y-1/2 flex gap-1">
          <Button variant="ghost" size="icon" onClick={handleFileClick} aria-label="Attach file">
            <Paperclip className="w-5 h-5" />
          </Button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />
          <Button onClick={handleSend} disabled={!inputValue.trim() || isSummarizing} aria-label="Send message">
            {isSummarizing ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
