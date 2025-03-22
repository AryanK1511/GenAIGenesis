// frontend/src/components/custom/WebSocketStateManager.tsx

'use client';

import { FC, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type WebSocketState = 'disconnected' | 'connected' | 'scanning' | 'processing' | 'finished';

interface WebSocketMessage {
  action: 'start' | 'click' | 'process' | 'finished';
  page_number?: number;
}

export const WebSocketStateManager: FC = () => {
  const [state, setState] = useState<WebSocketState>('disconnected');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const router = useRouter();

  useEffect(() => {
    const ws = new WebSocket(`${process.env.NEXT_PUBLIC_BACKEND_WEBSOCKET_URL}/ws/frontend`);

    ws.onopen = () => {
      console.log('WebSocket Connected');
    };

    ws.onmessage = (event) => {
      const message: WebSocketMessage = JSON.parse(event.data);

      switch (message.action) {
        case 'start':
          setState('connected');
          break;
        case 'click':
          setState('scanning');
          if (message.page_number) {
            setCurrentPage(message.page_number);
          }
          break;
        case 'process':
          setState('processing');
          break;
        case 'finished':
          setState('finished');
          router.push('/chat');
          break;
      }
    };

    ws.onclose = () => {
      setState('disconnected');
    };

    return () => {
      ws.close();
    };
  }, [router]);

  const renderContent = () => {
    switch (state) {
      case 'disconnected':
        return (
          <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="p-8 bg-white rounded-lg shadow-lg">
              <h1 className="text-2xl font-bold text-red-600 mb-4">Machine Disconnected</h1>
              <p className="text-gray-600">
                Connecting to {process.env.NEXT_PUBLIC_BACKEND_WEBSOCKET_URL}/ws/frontend...
              </p>
            </div>
          </div>
        );

      case 'connected':
        return (
          <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="p-8 bg-white rounded-lg shadow-lg">
              <h1 className="text-2xl font-bold text-green-600 mb-4">Machine Connected</h1>
              <p className="text-gray-600">Ready to scan documents</p>
            </div>
          </div>
        );

      case 'scanning':
        return (
          <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="p-8 bg-white rounded-lg shadow-lg">
              <h1 className="text-2xl font-bold text-blue-600 mb-4">Scanning Document</h1>
              <p className="text-gray-600">Processing page {currentPage}</p>
              <div className="mt-4 w-64 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 animate-pulse"></div>
              </div>
            </div>
          </div>
        );

      case 'processing':
        return (
          <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="p-8 bg-white rounded-lg shadow-lg">
              <h1 className="text-2xl font-bold text-purple-600 mb-4">Processing Documents</h1>
              <p className="text-gray-600">Embedding documents in vector database...</p>
              <div className="mt-4 w-64 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-purple-500 animate-pulse"></div>
              </div>
            </div>
          </div>
        );

      case 'finished':
        return null;
    }
  };

  return renderContent();
};
