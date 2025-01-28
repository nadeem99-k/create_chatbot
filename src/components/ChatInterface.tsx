'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IoSend, IoSunny, IoMoon, IoMic, IoAttach, IoMenu, IoPin, IoTrash } from 'react-icons/io5';
import ChatMessage from './ChatMessage';
import MoodSelector, { Mood } from './MoodSelector';
import { useTheme } from 'next-themes';

interface Message {
  content: string;
  role: 'user' | 'assistant';
  id: string;
  timestamp: number;
  isPinned?: boolean;
}

interface ChatSession {
  id: string;
  messages: Message[];
  mood: Mood;
  timestamp: number;
  title: string;
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [currentSession, setCurrentSession] = useState<string | null>(null);
  const [currentMood, setCurrentMood] = useState<Mood>({
    id: 'programmer',
    name: 'Programming Expert',
    prompt: 'You are an expert programming assistant.'
  });
  const { theme, setTheme } = useTheme();
  const isClient = useRef(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    isClient.current = true;
    const savedSessions = localStorage.getItem('chatSessions');
    if (savedSessions) {
      try {
        const parsed = JSON.parse(savedSessions);
        setChatSessions(parsed);
      } catch (e) {
        console.error('Error parsing saved sessions:', e);
      }
    }
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (isClient.current) {
      localStorage.setItem('chatSessions', JSON.stringify(chatSessions));
    }
  }, [chatSessions]);

  useEffect(() => {
    setCurrentMood(prev => ({
      ...prev,
      name: '👨‍💻 Programming Expert'
    }));
  }, []);

  const handleNewSession = () => {
    if (!isClient.current) return;
    
    const newSession: ChatSession = {
      id: crypto.randomUUID(),
      messages: [],
      mood: currentMood,
      timestamp: Date.now(),
      title: `Chat ${chatSessions.length + 1}`
    };

    setChatSessions([newSession, ...chatSessions]);
    setCurrentSession(newSession.id);
    setMessages([]);
  };

  const handlePinMessage = (messageId: string) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, isPinned: !msg.isPinned } : msg
    ));
  };

  const handleDeleteMessage = (messageId: string) => {
    setMessages(prev => prev.filter(msg => msg.id !== messageId));
  };

  const handleMoodSelect = (mood: Mood) => {
    setCurrentMood(mood);
    setMessages([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !isClient.current) return;

    const now = Date.now();
    const userMessage: Message = {
      role: 'user',
      content: input,
      id: now.toString(),
      timestamp: now
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          message: input,
          mood: currentMood.prompt
        }),
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: data.response,
        id: Date.now().toString(),
        timestamp: Date.now()
      }]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Sorry, I encountered an error. Please try again.',
        id: Date.now().toString(),
        timestamp: Date.now()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleThemeToggle = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const handleFileUpload = async (file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      alert('File size should be less than 5MB');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Upload failed');

      setInput(prev => prev + `\n[Attached file: ${file.name}]`);
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload file');
    }
  };

  const speakMessage = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  };

  if (!isInitialized) {
    return <div className="min-h-screen bg-gray-900" />;
  }

  return (
    <div className="flex h-screen">
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            className="w-80 bg-gray-900 border-r border-gray-700/50 overflow-y-auto"
          >
            <div className="p-4">
              <button
                onClick={handleNewSession}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-lg px-4 py-2 mb-4"
              >
                New Chat
              </button>
              
              <div className="space-y-2">
                {chatSessions.map(session => (
                  <motion.div
                    key={session.id}
                    whileHover={{ scale: 1.02 }}
                    className={`p-3 rounded-lg cursor-pointer ${
                      currentSession === session.id
                        ? 'bg-blue-500'
                        : 'bg-gray-800 hover:bg-gray-700'
                    }`}
                    onClick={() => setCurrentSession(session.id)}
                  >
                    <h3 className="font-medium">{session.title}</h3>
                    <p className="text-sm text-gray-400">
                      {new Date(session.timestamp).toLocaleDateString()}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex-1 flex flex-col">
        <div className="bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-2xl border border-gray-700/50 m-4 overflow-hidden">
          <motion.div 
            className="p-4 border-b border-gray-700/50 bg-gradient-to-r from-gray-800 to-gray-900 flex items-center justify-between"
          >
            <button
              onClick={() => setSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-gray-700 rounded-lg transition-colors duration-200"
            >
              <IoMenu className="text-xl" />
            </button>
            
            <MoodSelector 
              onSelectMood={handleMoodSelect} 
              currentMood={currentMood}
            />
            
            <button
              onClick={handleThemeToggle}
              className="p-2 hover:bg-gray-700 rounded-lg transition-colors duration-200"
            >
              {theme === 'dark' ? <IoSunny /> : <IoMoon />}
            </button>
          </motion.div>

          <div className="h-[calc(100vh-16rem)] overflow-y-auto p-6 space-y-4">
            <AnimatePresence mode="popLayout">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  layout
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ 
                    opacity: 1, 
                    y: 0, 
                    scale: 1,
                    transition: {
                      type: "spring",
                      stiffness: 100,
                      damping: 15
                    }
                  }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  whileHover={{ 
                    scale: 1.01,
                    transition: { duration: 0.2 }
                  }}
                  className="relative group glass-morphism rounded-xl shadow-lg"
                >
                  <ChatMessage 
                    message={message}
                    onSpeak={speakMessage}
                  />
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="absolute top-2 right-2 hidden group-hover:flex space-x-2"
                  >
                    <motion.button
                      whileHover={{ scale: 1.1, rotate: 15 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handlePinMessage(message.id)}
                      className="p-2 glass-button rounded-full"
                    >
                      <IoPin className={`text-xl ${message.isPinned ? 'text-blue-400' : 'text-gray-400'}`} />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1, rotate: -15 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleDeleteMessage(message.id)}
                      className="p-2 glass-button rounded-full"
                    >
                      <IoTrash className="text-xl text-red-400" />
                    </motion.button>
                  </motion.div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <motion.form 
            onSubmit={handleSubmit}
            className="p-4 border-t border-gray-700/50 bg-gradient-to-r from-gray-900 to-gray-800"
          >
            <div className="flex items-center space-x-2">
              <motion.button
                type="button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
                  recognition.onresult = (event) => {
                    const transcript = event.results[0][0].transcript;
                    setInput(transcript);
                  };
                  recognition.start();
                }}
                className="p-2 bg-gray-700/50 hover:bg-gray-600/50 rounded-lg"
                title="Voice Input"
              >
                <IoMic className="text-blue-400 hover:text-blue-300" />
              </motion.button>

              <motion.label 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 bg-gray-700/50 hover:bg-gray-600/50 rounded-lg cursor-pointer"
              >
                <IoAttach className="text-blue-400 hover:text-blue-300" />
                <input
                  type="file"
                  className="hidden"
                  accept="image/*,.pdf,.doc,.docx"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileUpload(file);
                  }}
                />
              </motion.label>

              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 bg-gray-700/50 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                placeholder="Type your message..."
              />

              <motion.button
                type="submit"
                disabled={isLoading}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg px-6 py-2 flex items-center space-x-2 disabled:opacity-50"
              >
                <span>Send</span>
                <IoSend />
              </motion.button>
            </div>
          </motion.form>
        </div>
      </div>
    </div>
  );
} 