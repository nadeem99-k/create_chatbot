import ChatInterface from '@/components/ChatInterface';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 py-8 px-4">
      <div className="container mx-auto max-w-6xl">
        <h1 className="text-4xl font-bold text-center text-white mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-600">
          AI Chat Assistant
        </h1>
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-700/50">
          <ChatInterface />
        </div>
      </div>
    </div>
  );
}
