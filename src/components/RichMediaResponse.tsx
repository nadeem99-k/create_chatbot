import { motion } from 'framer-motion';
import { IoLink, IoCloud } from 'react-icons/io5';
import Image from 'next/image';

interface RichMediaProps {
  media: {
    type: 'image' | 'gif' | 'video' | 'link' | 'weather';
    url?: string;
    preview?: string;
    data?: {
      temperature: number;
      condition: string;
    };
  };
}

export default function RichMediaResponse({ media }: RichMediaProps) {
  const renderMedia = () => {
    switch (media.type) {
      case 'image':
        return (
          <div className="relative rounded-lg overflow-hidden">
            <Image 
              src={media.url || ''} 
              alt="Response Image" 
              width={500}
              height={300}
              className="w-full h-auto"
            />
          </div>
        );
      case 'gif':
        return (
          <div className="relative rounded-lg overflow-hidden">
            <Image 
              src={media.url || ''} 
              alt="GIF" 
              width={500}
              height={300}
              className="w-full h-auto"
            />
          </div>
        );
      case 'video':
        return (
          <div className="relative rounded-lg overflow-hidden">
            <video src={media.url} controls className="w-full h-auto">
              Your browser does not support the video tag.
            </video>
          </div>
        );
      case 'link':
        return (
          <a 
            href={media.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center space-x-2 text-blue-400 hover:text-blue-300"
          >
            <IoLink />
            <span>{media.preview || media.url}</span>
          </a>
        );
      case 'weather':
        if (!media.data) return null;
        return (
          <div className="bg-gray-700 rounded-lg p-4">
            <div className="flex items-center space-x-4">
              <IoCloud className="text-4xl text-blue-400" />
              <div>
                <div className="text-xl font-bold">{media.data.temperature}°C</div>
                <div className="text-gray-300">{media.data.condition}</div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-2"
    >
      {renderMedia()}
    </motion.div>
  );
} 