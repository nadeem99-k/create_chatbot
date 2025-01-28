import { useState } from 'react';
import { IoCheckmark, IoCode } from 'react-icons/io5';
import { Mood } from './MoodSelector';

interface MoodCodeExporterProps {
  mood: Mood;
}

export default function MoodCodeExporter({ mood }: MoodCodeExporterProps) {
  const [copied, setCopied] = useState(false);

  const generateMoodCode = (mood: Mood) => {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${mood.name} Chatbot</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f9;
            margin: 0;
            padding: 20px;
            display: flex;
            justify-content: center;
            min-height: 100vh;
        }

        #chatbox {
            width: 100%;
            max-width: 800px;
            background: white;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
            overflow: hidden;
            display: flex;
            flex-direction: column;
            height: 90vh;
        }

        #messages {
            flex: 1;
            overflow-y: auto;
            padding: 20px;
        }

        .message {
            margin: 10px 0;
            padding: 12px 16px;
            border-radius: 10px;
            max-width: 80%;
            word-wrap: break-word;
            animation: fadeIn 0.3s ease-out;
        }

        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }

        .user {
            background: #2563eb;
            color: white;
            margin-left: auto;
        }

        .bot {
            background: #f3f4f6;
            color: #1f2937;
        }

        #inputArea {
            display: flex;
            padding: 20px;
            background: #f9fafb;
            border-top: 1px solid #e5e7eb;
            gap: 10px;
        }

        #userInput {
            flex: 1;
            padding: 12px 16px;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            font-size: 16px;
            outline: none;
            transition: border-color 0.2s;
        }

        #userInput:focus {
            border-color: #2563eb;
        }

        button {
            padding: 12px 24px;
            background: #2563eb;
            color: white;
            border: none;
            border-radius: 8px;
            font-size: 16px;
            cursor: pointer;
            transition: background 0.2s;
        }

        button:hover {
            background: #1d4ed8;
        }

        .typing {
            padding: 12px 16px;
            color: #6b7280;
            display: none;
        }

        .typing.visible {
            display: block;
            animation: pulse 1s infinite;
        }

        @keyframes pulse {
            0% { opacity: 0.4; }
            50% { opacity: 0.7; }
            100% { opacity: 0.4; }
        }
    </style>
</head>
<body>
    <div id="chatbox">
        <div id="messages"></div>
        <div class="typing">AI is typing...</div>
        <div id="inputArea">
            <input type="text" id="userInput" placeholder="Type your message...">
            <button onclick="sendMessage()">Send</button>
        </div>
    </div>

    <script>
        // Replace this with your OpenAI API key
        const OPENAI_API_KEY = 'YOUR_API_KEY_HERE';
        
        // The mood's personality/prompt
        const MOOD_PROMPT = \`${mood.prompt}\`;

        const messagesDiv = document.getElementById('messages');
        const userInput = document.getElementById('userInput');
        const typingIndicator = document.querySelector('.typing');
        
        let conversationHistory = [
            { role: 'system', content: MOOD_PROMPT }
        ];

        async function sendMessage() {
            const userMessage = userInput.value.trim();
            if (!userMessage) return;

            // Add user message to chat and history
            addMessage(userMessage, 'user');
            conversationHistory.push({ role: 'user', content: userMessage });
            userInput.value = '';
            
            // Show typing indicator
            typingIndicator.classList.add('visible');

            try {
                const response = await fetch('https://api.openai.com/v1/chat/completions', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': \`Bearer \${OPENAI_API_KEY}\`
                    },
                    body: JSON.stringify({
                        model: 'gpt-3.5-turbo',
                        messages: conversationHistory,
                        temperature: 0.7,
                        max_tokens: 1000
                    })
                });

                const data = await response.json();
                
                if (!response.ok) {
                    throw new Error(data.error?.message || 'Failed to get response');
                }

                const botMessage = data.choices[0].message.content;
                conversationHistory.push({ role: 'assistant', content: botMessage });
                addMessage(botMessage, 'bot');
            } catch (error) {
                console.error('Error:', error);
                addMessage('Sorry, something went wrong. Please check your API key and try again.', 'bot');
            } finally {
                typingIndicator.classList.remove('visible');
            }
        }

        function addMessage(text, sender) {
            const messageDiv = document.createElement('div');
            messageDiv.classList.add('message', sender);
            messageDiv.textContent = text;
            messagesDiv.appendChild(messageDiv);
            messagesDiv.scrollTop = messagesDiv.scrollHeight;
        }

        // Handle Enter key
        userInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        });

        // Initial greeting
        addMessage('Hello! How can I help you today?', 'bot');
    </script>
</body>
</html>`.trim();
  };

  const handleCopyCode = async () => {
    const code = generateMoodCode(mood);
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mt-2">
      <button
        onClick={handleCopyCode}
        className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors duration-200"
      >
        {copied ? (
          <>
            <IoCheckmark className="w-4 h-4" />
            Copied!
          </>
        ) : (
          <>
            <IoCode className="w-4 h-4" />
            Copy Complete Chatbot Code
          </>
        )}
      </button>
    </div>
  );
} 