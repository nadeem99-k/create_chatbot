'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  IoRocketOutline,
  IoExtensionPuzzleOutline,
  IoSparklesOutline,
  IoCloudOutline,
  IoChatbubblesOutline,
  IoArrowForward 
} from 'react-icons/io5';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">
            AI Chat Assistant
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8">
            Your intelligent companion for every conversation
          </p>
          <Link 
            href="/chat"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 hover:scale-105"
          >
            Start Chatting <IoArrowForward />
          </Link>
        </motion.div>

        {/* Features Grid */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20"
        >
          <FeatureCard 
            icon={<IoExtensionPuzzleOutline className="text-4xl text-blue-400" />}
            title="Smart AI"
            description="Powered by advanced AI to understand and respond naturally"
          />
          <FeatureCard 
            icon={<IoSparklesOutline className="text-4xl text-purple-400" />}
            title="Multiple Personalities"
            description="Switch between different chat personalities for various needs"
          />
          <FeatureCard 
            icon={<IoCloudOutline className="text-4xl text-pink-400" />}
            title="Always Available"
            description="24/7 availability for whenever you need assistance"
          />
        </motion.div>

        {/* Demo Section */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="mt-32 text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-white">
            See it in Action
          </h2>
          <div className="relative rounded-xl overflow-hidden shadow-2xl">
            <div className="aspect-video bg-gray-800 animate-pulse">
              {/* Add demo video or screenshot here */}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <motion.footer 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.6 }}
        className="border-t border-gray-800 mt-20"
      >
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold text-white mb-4">AI Chat Assistant</h3>
              <p className="text-gray-400">Your intelligent companion for meaningful conversations</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Features</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Smart Conversations</li>
                <li>Multiple Personalities</li>
                <li>24/7 Availability</li>
                <li>Custom Responses</li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Resources</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Documentation</li>
                <li>API Reference</li>
                <li>Support</li>
                <li>Blog</li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Connect</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Twitter</li>
                <li>GitHub</li>
                <li>Discord</li>
                <li>Contact</li>
              </ul>
            </div>
          </div>
          <div className="text-center text-gray-500 mt-8 pt-8 border-t border-gray-800">
            © 2024 AI Chat Assistant. All rights reserved.
          </div>
        </div>
      </motion.footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <motion.div 
      whileHover={{ scale: 1.05 }}
      className="p-6 rounded-xl bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300"
    >
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </motion.div>
  );
}
