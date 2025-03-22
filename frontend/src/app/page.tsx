// frontend/src/app/page.tsx

import { WebSocketStateManager } from '@/components';

export default function Home() {
  return (
    <main className="min-h-screen">
      <WebSocketStateManager />
    </main>
  );
}
