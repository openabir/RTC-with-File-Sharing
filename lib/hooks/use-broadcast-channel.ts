'use client';

import { useEffect, useRef, useCallback } from 'react';
import type { Message } from '@/lib/types';

const CHANNEL_NAME = 'fileshare-chat';

export function useBroadcastChannel(
  onMessageReceived: (message: Message) => void
) {
  const channel = useRef<BroadcastChannel | null>(null);

  useEffect(() => {
    channel.current = new BroadcastChannel(CHANNEL_NAME);

    const handleMessage = (event: MessageEvent<Message>) => {
      onMessageReceived(event.data);
    };

    channel.current.addEventListener('message', handleMessage);

    return () => {
      channel.current?.removeEventListener('message', handleMessage);
      channel.current?.close();
    };
  }, [onMessageReceived]);

  const postMessage = useCallback((message: Message) => {
    channel.current?.postMessage(message);
  }, []);

  return { postMessage };
}
