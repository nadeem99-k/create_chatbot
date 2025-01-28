import { useState } from 'react';
import { IoCopy, IoCheckmark } from 'react-icons/io5';

interface CodeBlockProps {
  code: string;
  language?: string;
}

export default function CodeBlock({ code, language = 'plaintext' }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative my-4 rounded-xl overflow-hidden bg-white dark:bg-[#222222] border border-gray-200 dark:border-gray-600 shadow-lg">
      {language && (
        <div className="absolute top-0 right-0 flex items-center space-x-2 bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-bl-xl border-l border-b border-gray-200 dark:border-gray-600">
          <span className="text-xs font-mono text-gray-600 dark:text-gray-300">{language}</span>
          <button
            onClick={handleCopy}
            className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-all duration-200"
            title={copied ? 'Copied!' : 'Copy code'}
          >
            {copied ? (
              <IoCheckmark className="text-green-500 w-4 h-4" />
            ) : (
              <IoCopy className="text-gray-500 dark:text-gray-400 w-4 h-4" />
            )}
          </button>
        </div>
      )}
      <pre className="p-4 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
        <code className="text-sm text-[#0A7300] dark:text-[#1ABC9C] font-mono leading-relaxed">{code}</code>
      </pre>
    </div>
  );
} 