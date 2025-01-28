'use client';

import { useState } from 'react';
import { IoMic, IoMicOff, IoSunny, IoMoon, IoAttach } from 'react-icons/io5';

interface ChatToolbarProps {
  onVoiceInput: (text: string) => void;
  onLanguageChange: (lang: string) => void;
  onThemeToggle: () => void;
  onFileUpload: (file: File) => void;
}

export default function ChatToolbar({
  onVoiceInput,
  onLanguageChange,
  onThemeToggle,
  onFileUpload
}: ChatToolbarProps) {
  const [isListening, setIsListening] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('en');

  // Voice input handling
  const handleVoiceInput = async () => {
    try {
      const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
      recognition.lang = selectedLanguage;

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        onVoiceInput(transcript);
      };

      recognition.start();
    } catch (error) {
      console.error('Speech recognition error:', error);
      alert('Speech recognition is not supported in this browser.');
    }
  };

  // File upload handling
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileUpload(file);
    }
  };

  return (
    <div className="flex items-center gap-2 p-2 bg-gray-800 rounded-lg">
      <button
        onClick={handleVoiceInput}
        className={`p-2 rounded-lg transition-colors duration-200 ${
          isListening ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-700 hover:bg-gray-600'
        }`}
        title="Voice Input"
      >
        {isListening ? <IoMicOff /> : <IoMic />}
      </button>

      <select
        value={selectedLanguage}
        onChange={(e) => {
          setSelectedLanguage(e.target.value);
          onLanguageChange(e.target.value);
        }}
        className="bg-gray-700 text-white rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="en">English</option>
        <option value="es">Español</option>
        <option value="fr">Français</option>
        <option value="de">Deutsch</option>
        <option value="hi">हिंदी</option>
        <option value="zh">中文</option>
      </select>

      <button
        onClick={onThemeToggle}
        className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors duration-200"
        title="Toggle Theme"
      >
        <IoSunny className="dark:hidden" />
        <IoMoon className="hidden dark:block" />
      </button>

      <label className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors duration-200 cursor-pointer">
        <IoAttach />
        <input
          type="file"
          className="hidden"
          accept="image/*,.pdf,.doc,.docx"
          onChange={handleFileUpload}
        />
      </label>
    </div>
  );
} 