import { useState, useEffect, useRef, useMemo } from 'react';
import { IoAdd, IoClose } from 'react-icons/io5';
import { useLocalStorage } from '../hooks/useLocalStorage';
import MoodCodeExporter from './MoodCodeExporter';

export interface Mood {
  id: string;
  name: string;
  prompt: string;
}

interface MoodSelectorProps {
  onSelectMood: (mood: Mood) => void;
  currentMood: Mood;
}

export default function MoodSelector({ onSelectMood, currentMood }: MoodSelectorProps) {
  const [moods, setMoods] = useLocalStorage<Mood[]>('customMoods', [
    {
      id: 'programmer',
      name: 'Programming Expert',
      prompt: 'You are an expert programming assistant.'
    },
    {
      id: 'doctor',
      name: 'Medical Expert',
      prompt: 'You are a medical expert.'
    },
    {
      id: 'business',
      name: 'Business Consultant',
      prompt: 'You are a business consultant.'
    }
  ]);
  const [isAdding, setIsAdding] = useState(false);
  const [newMood, setNewMood] = useState({ name: '', prompt: '' });

  const initialMoodsRef = useRef(moods);

  useEffect(() => {
    const updatedMoods = initialMoodsRef.current.map(mood => ({
      ...mood,
      name: mood.id === 'programmer' ? '👨‍💻 Programming Expert' :
            mood.id === 'doctor' ? '👨‍⚕️ Medical Expert' :
            mood.id === 'business' ? '💼 Business Consultant' :
            mood.name
    }));
    
    if (JSON.stringify(updatedMoods) !== JSON.stringify(initialMoodsRef.current)) {
      setMoods(updatedMoods);
    }
  }, []); // Empty dependency array is fine now

  const handleAddMood = () => {
    if (newMood.name && newMood.prompt) {
      const mood: Mood = {
        id: `custom-${Date.now()}`,
        name: newMood.name,
        prompt: newMood.prompt
      };
      
      const updatedMoods = [...moods, mood];
      setMoods(updatedMoods);
      
      // Save custom moods to localStorage
      const customMoods = updatedMoods.filter(m => m.id.startsWith('custom-'));
      localStorage.setItem('customMoods', JSON.stringify(customMoods));
      
      setNewMood({ name: '', prompt: '' });
      setIsAdding(false);
    }
  };

  const handleDeleteMood = (id: string) => {
    if (id.startsWith('custom-')) {
      const updatedMoods = moods.filter(m => m.id !== id);
      setMoods(updatedMoods);
      const customMoods = updatedMoods.filter(m => m.id.startsWith('custom-'));
      localStorage.setItem('customMoods', JSON.stringify(customMoods));
    }
  };

  const getMoodEmoji = (id: string): string => {
    switch (id) {
      case 'programmer': return '👨‍💻';
      case 'doctor': return '👨‍⚕️';
      case 'business': return '💼';
      default: return '';
    }
  };

  const moodsList = useMemo(() => 
    moods.map(mood => ({
      ...mood,
      name: getMoodEmoji(mood.id) + ' ' + mood.name
    })),
    [moods]
  );

  return (
    <div className="mb-4">
      <div className="flex flex-wrap gap-2 mb-2">
        {moodsList.map((mood) => (
          <div key={mood.id} className="relative group">
            <div className="flex flex-col gap-2">
              <button
                onClick={() => onSelectMood(mood)}
                className={`px-4 py-2 rounded-lg text-white transition-colors duration-200 flex items-center gap-2
                  ${mood.id === currentMood.id 
                    ? 'bg-blue-600 hover:bg-blue-700 ring-2 ring-blue-400' 
                    : 'bg-gray-700 hover:bg-gray-600'
                  }`}
              >
                {mood.name}
                {mood.id === currentMood.id && (
                  <span className="w-2 h-2 bg-white rounded-full"></span>
                )}
              </button>
              
              {mood.id === currentMood.id && (
                <MoodCodeExporter mood={mood} />
              )}
            </div>
            
            {mood.id.startsWith('custom-') && (
              <button
                onClick={() => handleDeleteMood(mood.id)}
                className="absolute -top-2 -right-2 hidden group-hover:flex bg-red-500 hover:bg-red-600 rounded-full p-1"
              >
                <IoClose className="w-4 h-4 text-white" />
              </button>
            )}
          </div>
        ))}
        <button
          onClick={() => setIsAdding(true)}
          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white transition-colors duration-200 flex items-center gap-2"
        >
          <IoAdd /> Add Custom
        </button>
      </div>

      {isAdding && (
        <div className="bg-gray-800 p-4 rounded-lg space-y-4">
          <input
            type="text"
            placeholder="Name (e.g., Friend, Teacher)"
            value={newMood.name}
            onChange={(e) => setNewMood(prev => ({ ...prev, name: e.target.value }))}
            className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <textarea
            placeholder="Describe the personality/role..."
            value={newMood.prompt}
            onChange={(e) => setNewMood(prev => ({ ...prev, prompt: e.target.value }))}
            className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 h-24"
          />
          <div className="flex gap-2">
            <button
              onClick={handleAddMood}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-white transition-colors duration-200"
            >
              Save
            </button>
            <button
              onClick={() => setIsAdding(false)}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded-lg text-white transition-colors duration-200"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 