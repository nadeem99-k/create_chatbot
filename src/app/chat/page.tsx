import ChatInterface from '@/components/ChatInterface';

export default function ChatPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 py-8 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-700/50">
          <ChatInterface />
        </div>
      </div>
    </div>
  );
} 