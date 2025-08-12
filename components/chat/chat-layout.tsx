'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Message, User } from '@/lib/types';
import { useBroadcastChannel } from '@/lib/hooks/use-broadcast-channel';
import ChatHeader from '@/components/chat/chat-header';
import ChatMessages from '@/components/chat/chat-messages';
import ChatInput from '@/components/chat/chat-input';
import ChatSettings from '@/components/chat/chat-settings';
import { summarizeUrl } from '@/ai/flows/summarize-url';
import { useToast } from '@/hooks/use-toast';

const urlRegex = /(https?:\/\/[^\s]+)/g;

export default function ChatLayout() {
  const [user, setUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [isSettingsOpen, setSettingsOpen] = useState(false);
  const [isUrlSummaryEnabled, setUrlSummaryEnabled] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const onMessageReceived = useCallback((newMessage: Message) => {
    setMessages((prevMessages) => {
      if (prevMessages.some((msg) => msg.id === newMessage.id)) {
        return prevMessages;
      }
      return [...prevMessages, newMessage].sort(
        (a, b) => a.timestamp - b.timestamp
      );
    });
  }, []);

  const { postMessage } = useBroadcastChannel(onMessageReceived);

  useEffect(() => {
    if (!isMounted) return;

    let userId = localStorage.getItem('fileshare-chat-userId');
    let userName = localStorage.getItem('fileshare-chat-userName');
    let avatarColor = localStorage.getItem('fileshare-chat-avatarColor');

    if (!userId || !userName || !avatarColor) {
      const randomId = Math.random().toString(36).substr(2, 9);
      userId = `user-${randomId}`;
      userName = `User-${randomId.slice(0, 4)}`;
      const colors = ['#e57373', '#81c784', '#64b5f6', '#f06292', '#ffb74d', '#ba68c8'];
      avatarColor = colors[Math.floor(Math.random() * colors.length)];

      localStorage.setItem('fileshare-chat-userId', userId);
      localStorage.setItem('fileshare-chat-userName', userName);
      localStorage.setItem('fileshare-chat-avatarColor', avatarColor);
    }
    
    const newUser = {
      id: userId,
      name: userName,
      avatarColor,
    };
    setUser(newUser);
    
    const summarySetting = localStorage.getItem('urlSummaryEnabled');
    if (summarySetting !== null) {
      setUrlSummaryEnabled(JSON.parse(summarySetting));
    }

    const welcomeMessage: Message = {
      id: crypto.randomUUID(),
      sender: newUser,
      timestamp: Date.now(),
      type: 'info',
      content: `${newUser.name} has joined the chat.`,
    };
    setMessages([welcomeMessage]);
    postMessage(welcomeMessage);
  }, [isMounted, postMessage]);

  const handleSendMessage = (content: string) => {
    if (!user) return;

    const message: Message = {
      id: crypto.randomUUID(),
      type: 'text',
      content,
      sender: user,
      timestamp: Date.now(),
    };
    postMessage(message);
    onMessageReceived(message);

    if (isUrlSummaryEnabled) {
      const urls = content.match(urlRegex);
      if (urls && urls.length > 0) {
        handleSummarizeUrl(urls[0]);
      }
    }
  };

  const handleSummarizeUrl = async (url: string) => {
    if (!user) return;
    setIsSummarizing(true);
    try {
      const { summary } = await summarizeUrl({ url });
      const summaryMessage: Message = {
        id: crypto.randomUUID(),
        type: 'summary',
        url,
        summary,
        sender: { id: 'ai-bot', name: 'AI', avatarColor: '#77B5FE' },
        timestamp: Date.now() + 1,
      };
      postMessage(summaryMessage);
      onMessageReceived(summaryMessage);
    } catch (error) {
      console.error('Error summarizing URL:', error);
       toast({
        title: "Summarization Failed",
        description: "Could not summarize the provided URL.",
        variant: "destructive",
      });
    } finally {
      setIsSummarizing(false);
    }
  };

  const handleSendFile = (file: File) => {
    if (!user) return;
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

    if (file.size > MAX_FILE_SIZE) {
      toast({
        title: "File Too Large",
        description: `Please select a file smaller than ${MAX_FILE_SIZE / 1024 / 1024}MB.`,
        variant: "destructive",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const message: Message = {
        id: crypto.randomUUID(),
        type: 'file',
        file: {
          name: file.name,
          type: file.type,
          size: file.size,
          url: e.target?.result as string,
        },
        sender: user,
        timestamp: Date.now(),
      };
      postMessage(message);
      onMessageReceived(message);
    };
    reader.readAsDataURL(file);
  };
  
  const handleToggleUrlSummary = (enabled: boolean) => {
    setUrlSummaryEnabled(enabled);
    localStorage.setItem('urlSummaryEnabled', JSON.stringify(enabled));
  };

  if (!isMounted) {
    return null;
  }

  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto bg-card rounded-lg shadow-2xl">
      <ChatHeader onSettingsClick={() => setSettingsOpen(true)} />
      <ChatMessages messages={messages} currentUser={user} />
      <ChatInput
        onSendMessage={handleSendMessage}
        onSendFile={handleSendFile}
        isSummarizing={isSummarizing}
      />
      <ChatSettings
        isOpen={isSettingsOpen}
        onOpenChange={setSettingsOpen}
        isUrlSummaryEnabled={isUrlSummaryEnabled}
        onUrlSummaryToggle={handleToggleUrlSummary}
      />
    </div>
  );
}
