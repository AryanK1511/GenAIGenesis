'use client';

import { type FC, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle2, AlertCircle, Loader2, Scan, FileText } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Navbar } from './Navbar';

type WebSocketState = 'disconnected' | 'connected' | 'scanning' | 'processing' | 'finished';

interface WebSocketMessage {
  action: 'start' | 'scanning' | 'processing' | 'end';
  page_number?: number;
  ocr_text?: string;
}

export const WebSocketStateManager: FC = () => {
  const [state, setState] = useState<WebSocketState>('disconnected');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const router = useRouter();

  useEffect(() => {
    const ws = new WebSocket(`${process.env.NEXT_PUBLIC_BACKEND_WEBSOCKET_URL}/ws/frontend`);

    ws.onopen = () => {
      console.log('WebSocket Connected');
      setState('disconnected'); // Start with red disconnected state
    };

    ws.onmessage = (event) => {
      const message: WebSocketMessage = JSON.parse(event.data);

      switch (message.action) {
        case 'start':
          setState('connected');
          break;
        case 'scanning':
          setState('scanning');
          if (message.page_number) {
            setCurrentPage(message.page_number);
          }
          break;
        case 'processing':
          setState('processing');
          if (message.page_number) {
            setCurrentPage(message.page_number);
          }
          break;
        case 'end':
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

  const getStatusColor = () => {
    switch (state) {
      case 'disconnected':
        return 'bg-destructive text-destructive-foreground';
      case 'connected':
        return 'bg-green-500 text-white'; // Changed to green for connected state
      case 'scanning':
        return 'bg-amber-500 text-white';
      case 'processing':
        return 'bg-purple-500 text-white';
      case 'finished':
        return 'bg-green-500 text-white';
    }
  };

  const getStatusIcon = () => {
    switch (state) {
      case 'disconnected':
        return <AlertCircle className="h-5 w-5" />;
      case 'connected':
        return <CheckCircle2 className="h-5 w-5" />;
      case 'scanning':
        return <Scan className="h-5 w-5" />;
      case 'processing':
        return <Loader2 className="h-5 w-5 animate-spin" />;
      case 'finished':
        return <CheckCircle2 className="h-5 w-5" />;
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-centerp-4">
      <Navbar />
      <div className="w-full max-w-7xl mx-auto rounded-3xl overflow-hidden relative bg-gradient-to-br">
        <div className="grid md:grid-cols-2 gap-8 p-8 md:p-12 lg:p-16">
          <div className="flex flex-col justify-center space-y-8">
            <div className="flex flex-col items-center md:items-start">
              <div className="flex flex-col md:flex-row items-center mb-4">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif text-[#1D1D3B] text-center md:text-left leading-tight">
                  Robotics meets RAG to read and chat with your notebook <br />
                </h1>
              </div>
            </div>

            <p className="text-gray-600 text-sm md:text-base">
              Pass your notebook to Inksight and it will turn that into an interactive chatbot.
            </p>
          </div>

          <div className="flex items-center justify-center">
            <Card className="w-full max-w-md shadow-lg border-0 overflow-hidden bg-white">
              <CardContent className="p-0">
                <div className="flex items-center justify-between p-4 border-b">
                  <div className="flex items-center gap-2">
                    <div>
                      <h3 className="font-medium text-slate-900">Inksight Status</h3>
                      <p className="text-xs text-slate-500">Real-time monitoring</p>
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    className={`${getStatusColor()} flex items-center gap-1.5 px-3 py-1.5`}
                  >
                    {getStatusIcon()}
                    {state === 'connected'
                      ? 'Waiting'
                      : state.charAt(0).toUpperCase() + state.slice(1)}
                  </Badge>
                </div>

                {/* Status Visualization */}
                <div className="p-6 flex flex-col items-center">
                  <div className="relative w-48 h-48 mb-6">
                    <div
                      className={`absolute inset-0 rounded-full ${
                        state === 'disconnected'
                          ? 'bg-red-100'
                          : state === 'connected'
                            ? 'bg-green-100'
                            : state === 'scanning'
                              ? 'bg-amber-100'
                              : state === 'processing'
                                ? 'bg-purple-100'
                                : 'bg-green-100'
                      } flex items-center justify-center`}
                    >
                      <div
                        className={`w-36 h-36 rounded-full ${
                          state === 'disconnected'
                            ? 'bg-red-200'
                            : state === 'connected'
                              ? 'bg-green-200'
                              : state === 'scanning'
                                ? 'bg-amber-200'
                                : state === 'processing'
                                  ? 'bg-purple-200'
                                  : 'bg-green-200'
                        } flex items-center justify-center`}
                      >
                        <div
                          className={`w-24 h-24 rounded-full ${
                            state === 'disconnected'
                              ? 'bg-red-300'
                              : state === 'connected'
                                ? 'bg-green-300'
                                : state === 'scanning'
                                  ? 'bg-amber-300'
                                  : state === 'processing'
                                    ? 'bg-purple-300'
                                    : 'bg-green-300'
                          } flex items-center justify-center`}
                        >
                          {state === 'scanning' || state === 'processing' ? (
                            <div className="text-center">
                              <div className="text-3xl font-bold">{currentPage}</div>
                            </div>
                          ) : (
                            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center">
                              {state === 'disconnected' && (
                                <AlertCircle className="h-6 w-6 text-red-500" />
                              )}
                              {state === 'connected' && (
                                <CheckCircle2 className="h-6 w-6 text-green-500" />
                              )}
                              {state === 'finished' && (
                                <CheckCircle2 className="h-6 w-6 text-green-500" />
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Animated elements for scanning/processing states */}
                    {(state === 'scanning' || state === 'processing') && (
                      <>
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-white animate-ping" />
                        <div
                          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-white animate-ping"
                          style={{ animationDelay: '0.5s' }}
                        />
                        <div
                          className="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-white animate-ping"
                          style={{ animationDelay: '1s' }}
                        />
                        <div
                          className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-white animate-ping"
                          style={{ animationDelay: '1.5s' }}
                        />
                      </>
                    )}
                  </div>

                  <div className="text-center">
                    <h2 className="text-xl font-semibold mb-2">
                      {state === 'disconnected' && 'Inksight Offline'}
                      {state === 'connected' && 'Ready to Scan'}
                      {state === 'scanning' && 'Scanning in Progress'}
                      {state === 'processing' && 'Processing Content'}
                      {state === 'finished' && 'Scan Complete'}
                    </h2>
                    <p className="text-sm text-slate-500 max-w-xs">
                      {state === 'disconnected' &&
                        'Please check your Inksight connection and try again.'}
                      {state === 'connected' &&
                        'Your Inksight is connected and ready to begin scanning.'}
                      {state === 'scanning' &&
                        `Currently scanning page ${currentPage} of your document.`}
                      {state === 'processing' &&
                        `Processing page ${currentPage}. Converting to interactive content.`}
                      {state === 'finished' &&
                        'Your document has been successfully processed and is ready to view.'}
                    </p>
                  </div>
                </div>

                {/* Status Timeline */}
                <div className="px-6 pb-6">
                  <div className="flex justify-between items-center">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          state !== 'disconnected'
                            ? 'bg-green-100 text-green-600'
                            : 'bg-slate-100 text-slate-400'
                        }`}
                      >
                        <CheckCircle2 className="h-4 w-4" />
                      </div>
                      <span className="text-xs mt-1">Connect</span>
                    </div>
                    <div
                      className={`h-0.5 flex-1 mx-1 ${state !== 'disconnected' ? 'bg-green-200' : 'bg-slate-200'}`}
                    />
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          state === 'scanning' || state === 'processing' || state === 'finished'
                            ? 'bg-amber-100 text-amber-600'
                            : 'bg-slate-100 text-slate-400'
                        }`}
                      >
                        <Scan className="h-4 w-4" />
                      </div>
                      <span className="text-xs mt-1">Scan</span>
                    </div>
                    <div
                      className={`h-0.5 flex-1 mx-1 ${
                        state === 'processing' || state === 'finished'
                          ? 'bg-purple-200'
                          : 'bg-slate-200'
                      }`}
                    />
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          state === 'processing' || state === 'finished'
                            ? 'bg-purple-100 text-purple-600'
                            : 'bg-slate-100 text-slate-400'
                        }`}
                      >
                        <FileText className="h-4 w-4" />
                      </div>
                      <span className="text-xs mt-1">Process</span>
                    </div>
                    <div
                      className={`h-0.5 flex-1 mx-1 ${state === 'finished' ? 'bg-green-200' : 'bg-slate-200'}`}
                    />
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          state === 'finished'
                            ? 'bg-green-100 text-green-600'
                            : 'bg-slate-100 text-slate-400'
                        }`}
                      >
                        <CheckCircle2 className="h-4 w-4" />
                      </div>
                      <span className="text-xs mt-1">Complete</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
};
