'use client';

import type { Message } from '@/lib/types';
import { cn } from '@/lib/utils';
import UserAvatar from '@/components/chat/user-avatar';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { FileText, ImageIcon, VideoIcon, File, Download } from 'lucide-react';
import Image from 'next/image';

type ChatMessageProps = {
  message: Message;
  isCurrentUser: boolean;
};

const FilePreview = ({ file }: { file: Message['file'] }) => {
  if (file.type.startsWith('image/')) {
    return (
      <div className="relative mt-2">
        <Image
          src={file.url}
          alt={file.name}
          width={300}
          height={200}
          className="rounded-lg object-cover"
        />
      </div>
    );
  }
  if (file.type.startsWith('video/')) {
    return <video src={file.url} controls className="mt-2 rounded-lg max-w-xs" />;
  }
  
  const FileIcon = file.type.startsWith('image/') ? ImageIcon :
                   file.type.startsWith('video/') ? VideoIcon :
                   file.type.startsWith('text/') ? FileText : File;

  return (
    <div className="flex items-center p-2 mt-2 border rounded-lg bg-secondary/50">
      <FileIcon className="w-8 h-8 mr-3 text-secondary-foreground" />
      <div className="flex-grow">
        <p className="text-sm font-medium truncate">{file.name}</p>
        <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(2)} KB</p>
      </div>
      <a href={file.url} download={file.name} className="p-2 rounded-full hover:bg-accent">
        <Download className="w-5 h-5" />
      </a>
    </div>
  );
};


export default function ChatMessage({ message, isCurrentUser }: ChatMessageProps) {
  if (message.type === 'info') {
    return (
      <div className="text-center text-xs text-muted-foreground py-2">
        {message.content}
      </div>
    );
  }

  return (
    <div
      className={cn('flex items-end gap-2', { 'justify-end': isCurrentUser })}
      data-state="open"
    >
      {!isCurrentUser && message.sender.id !== 'ai-bot' && <UserAvatar user={message.sender} />}
      {message.sender.id === 'ai-bot' && <UserAvatar user={message.sender} />}
      
      <div
        className={cn(
          'max-w-md p-3 rounded-lg animate-in fade-in zoom-in-95',
          isCurrentUser
            ? 'bg-primary text-primary-foreground rounded-br-none'
            : 'bg-secondary text-secondary-foreground rounded-bl-none',
          { 'bg-accent/20 text-accent-foreground': message.sender.id === 'ai-bot' }
        )}
      >
        <div className="flex items-baseline gap-2 text-xs">
          {!isCurrentUser && (
            <span className="font-bold">{message.sender.name}</span>
          )}
          <time className={cn('opacity-70', {'text-primary-foreground/70': isCurrentUser})}>
            {format(message.timestamp, 'HH:mm')}
          </time>
        </div>
        {message.type === 'text' && <p className="mt-1 whitespace-pre-wrap">{message.content}</p>}
        {message.type === 'file' && <FilePreview file={message.file} />}
        {message.type === 'summary' && (
          <Card className="mt-2 bg-background/70">
            <CardHeader className="p-3">
              <CardTitle className="text-sm">Summary</CardTitle>
              <CardDescription className="truncate text-xs">{message.url}</CardDescription>
            </CardHeader>
            <CardContent className="p-3 pt-0">
              <p className="text-sm">{message.summary}</p>
            </CardContent>
          </Card>
        )}
      </div>
      
      {isCurrentUser && <UserAvatar user={message.sender} />}
    </div>
  );
}
