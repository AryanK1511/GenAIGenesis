// frontend/src/components/custom/WebSocketStateManager.tsx

'use client';

import { type FC, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Wifi, WifiOff } from 'lucide-react';

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

  const getStateColor = () => {
    switch (state) {
      case 'disconnected':
        return 'bg-red-50 border-red-100 text-red-700';
      case 'connected':
        return 'bg-green-50 border-green-100 text-green-700';
      case 'scanning':
        return 'bg-blue-50 border-blue-100 text-blue-700';
      case 'processing':
        return 'bg-amber-50 border-amber-100 text-amber-700';
      case 'finished':
        return 'bg-green-50 border-green-100 text-green-700';
    }
  };

  return (
    <div className="min-h-screen bg-sky-50 bg-[url('/grid-pattern.svg')] relative">
      {/* Decorative elements */}
      <div className="absolute top-40 left-20 w-16 h-16 rounded-lg bg-lime-300 rotate-12 z-0" />
      <div className="absolute top-60 left-32 w-12 h-12 rounded-lg bg-amber-300 -rotate-6 z-0" />

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="container mx-auto px-6 py-4 flex items-center">
          <div className="flex items-center">
            <span className="text-lg font-bold text-slate-800 flex items-center">
              <span className="flex items-center justify-center w-7 h-7 bg-slate-900 text-white rounded-md mr-2">
                NB
              </span>
              Notebook Buddy
              <span className="ml-2 text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                BETA
              </span>
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="min-h-screen flex items-center justify-center px-6 pt-24 relative z-10">
        <div className="w-full max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Left Column - Text Content */}
            <div className="space-y-6">
              <div className="space-y-3">
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-slate-100 text-slate-800 text-sm font-medium">
                  <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                  {state === 'connected' ? 'Ready to go' : state}
                </div>

                <h1 className="text-3xl md:text-5xl font-bold text-slate-900 leading-tight pt-serif-font">
                  Your Study <span className="text-blue-600">Buddy</span>
                </h1>
                <p className="text-lg text-slate-600 max-w-lg outfit-font">
                  Transform your handwritten notes into interactive study materials. Let AI help you
                  understand, organize, and master your content.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-6 py-4 text-sm font-medium transition-all duration-200 flex items-center justify-center">
                  Get started for free
                  <svg
                    className="ml-2 w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </Button>
                <Button
                  variant="outline"
                  className="border-slate-300 text-slate-700 hover:bg-slate-100 rounded-lg px-6 py-4 text-sm font-medium transition-all duration-200"
                >
                  See how it works
                </Button>
              </div>

              <div className="flex items-center space-x-3 text-sm text-slate-500">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="w-7 h-7 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center text-xs font-medium text-slate-600"
                    >
                      {i}
                    </div>
                  ))}
                </div>
                <p>Over 5k students are using Notebook Buddy</p>
              </div>
            </div>

            {/* Right Column - Status Card */}
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden bg-white shadow-[0_10px_40px_rgba(0,0,0,0.08)] border border-slate-100">
                <div className="p-6">
                  {/* Status Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-lg font-semibold text-slate-900">Scanner Status</h2>
                      <p className="text-xs text-slate-500 mt-0.5">Real-time scanning progress</p>
                    </div>
                    <div
                      className={`px-3 py-1.5 rounded-full text-xs font-medium ${getStateColor()}`}
                    >
                      {state.charAt(0).toUpperCase() + state.slice(1)}
                    </div>
                  </div>

                  {/* Main Status Display */}
                  <div className="relative h-[320px] rounded-xl overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100 mb-6">
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <div className="text-center w-full max-w-sm mx-auto px-4">
                        {state === 'disconnected' && (
                          <div className="space-y-6">
                            <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mx-auto">
                              <WifiOff className="w-12 h-12 text-slate-400" />
                            </div>
                            <div className="space-y-2">
                              <p className="text-xl font-semibold text-slate-800">No Connection</p>
                              <p className="text-sm text-slate-500">
                                Please check your scanner connection
                              </p>
                            </div>
                          </div>
                        )}

                        {state === 'connected' && (
                          <div className="space-y-6">
                            <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center mx-auto">
                              <Wifi className="w-12 h-12 text-green-500" />
                            </div>
                            <div className="space-y-2">
                              <p className="text-xl font-semibold text-slate-800">Ready to Scan</p>
                              <p className="text-sm text-slate-500">
                                Place your notebook on the scanner
                              </p>
                            </div>
                          </div>
                        )}

                        {state === 'scanning' && (
                          <div className="flex flex-col items-center justify-center h-full">
                            <div className="relative">
                              <div className="text-7xl font-bold text-blue-600 mb-2">
                                {currentPage}
                              </div>
                              <div className="text-sm text-slate-500 text-center">
                                Scanning Page {currentPage}
                              </div>
                            </div>
                            <div className="mt-8 w-full max-w-xs">
                              <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                <div className="h-full w-[30%] bg-gradient-to-r from-blue-500 to-blue-400 rounded-full transition-all duration-500" />
                              </div>
                            </div>
                          </div>
                        )}

                        {state === 'processing' && (
                          <div className="flex flex-col items-center justify-center h-full">
                            <div className="relative">
                              <div className="text-7xl font-bold text-amber-600 mb-2">
                                {currentPage}
                              </div>
                              <div className="text-sm text-slate-500 text-center">
                                Processing Page {currentPage}
                              </div>
                            </div>
                            <div className="mt-8 w-full max-w-xs">
                              <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                <div className="h-full w-[60%] bg-gradient-to-r from-amber-500 to-amber-400 rounded-full transition-all duration-500" />
                              </div>
                            </div>
                          </div>
                        )}

                        {state === 'finished' && (
                          <div className="space-y-6">
                            <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center mx-auto">
                              <svg
                                className="w-12 h-12 text-green-500"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                            </div>
                            <div className="space-y-2">
                              <p className="text-xl font-semibold text-slate-800">
                                Notes Processed Successfully
                              </p>
                              <p className="text-sm text-slate-500">
                                Redirecting to chat interface...
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-between">
                    <Button
                      variant="outline"
                      className="text-slate-600 border-slate-200 hover:bg-slate-50 px-6 py-4 text-sm font-medium"
                    >
                      Cancel
                    </Button>
                    <Button
                      disabled={
                        state === 'disconnected' || state === 'scanning' || state === 'processing'
                      }
                      className={`${
                        state === 'disconnected' || state === 'scanning' || state === 'processing'
                          ? 'bg-slate-400'
                          : 'bg-blue-600 hover:bg-blue-700'
                      } text-white px-6 py-4 text-sm font-medium`}
                    >
                      {state === 'scanning'
                        ? 'Scanning...'
                        : state === 'processing'
                          ? 'Processing...'
                          : 'Continue'}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
