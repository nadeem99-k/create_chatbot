'use client';

import { motion } from 'framer-motion';
import { IoVolumeMedium } from 'react-icons/io5';
import { useState, useEffect, useRef } from 'react';
import CodeBlock from './CodeBlock';

interface ChatMessageProps {
  message: {
    content: string;
    role: 'user' | 'assistant';
    timestamp: number;
  };
  onSpeak: (text: string) => void;
}

export default function ChatMessage({ message, onSpeak }: ChatMessageProps) {
  const [formattedTime, setFormattedTime] = useState<string | null>(null);
  const mounted = useRef(false);

  useEffect(() => {
    mounted.current = true;
    const date = new Date(message.timestamp);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    if (mounted.current) {
      setFormattedTime(`${hours}:${minutes}`);
    }
    return () => {
      mounted.current = false;
    };
  }, [message.timestamp]);

  const renderContent = (content: string) => {
    const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = codeBlockRegex.exec(content)) !== null) {
      // Add text before code block
      if (match.index > lastIndex) {
        parts.push(content.slice(lastIndex, match.index));
      }
      // Add code block
      parts.push(
        <CodeBlock 
          key={match.index} 
          code={match[2].trim()} 
          language={match[1] || 'plaintext'} 
        />
      );
      lastIndex = match.index + match[0].length;
    }
    // Add remaining text
    if (lastIndex < content.length) {
      parts.push(content.slice(lastIndex));
    }
    return parts;
  };

  return (
    <motion.div
      className={`p-4 rounded-xl ${
        message.role === 'user' 
          ? 'bg-blue-500/20 ml-auto' 
          : 'bg-gray-700/30'
      } max-w-[80%] glass-morphism`}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        type: "spring",
        stiffness: 100,
        damping: 15
      }}
    >
      <motion.div 
        className="flex items-start gap-4"
        initial={{ y: 20 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex-1">
          <div className="prose prose-invert max-w-none">
            {renderContent(message.content)}
          </div>
          <div className="mt-2 flex items-center gap-2 text-sm text-gray-400">
            {formattedTime && <span>{formattedTime}</span>}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onSpeak(message.content)}
              className="p-1 hover:bg-white/10 rounded-full transition-colors"
            >
              <IoVolumeMedium />
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
} 