import { motion } from 'framer-motion';

interface ChatSession {
  id: string;
  title: string;
  timestamp: number;
}

interface ChatSidebarProps {
  sessions: ChatSession[];
  currentSession: string | null;
  onSelectSession: (id: string) => void;
  onNewSession: () => void;
}

// Add formatDate helper function
const formatDate = (timestamp: number) => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(timestamp);
};

export default function ChatSidebar({
  sessions,
  currentSession,
  onSelectSession,
  onNewSession
}: ChatSidebarProps) {
  return (
    <motion.div
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      exit={{ x: -300 }}
      className="w-80 bg-gray-900 border-r border-gray-700/50 p-4"
    >
      <button
        onClick={onNewSession}
        className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-lg px-4 py-2 mb-4 transition-colors duration-200"
      >
        New Chat
      </button>
      
      <div className="space-y-2">
        {sessions.map(session => (
          <motion.div
            key={session.id}
            whileHover={{ scale: 1.02 }}
            className={`p-3 rounded-lg cursor-pointer ${
              currentSession === session.id
                ? 'bg-blue-500'
                : 'bg-gray-800 hover:bg-gray-700'
            }`}
            onClick={() => onSelectSession(session.id)}
          >
            <h3 className="font-medium">{session.title}</h3>
            <p className="text-sm text-gray-400">
              {formatDate(session.timestamp)}
            </p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
} 