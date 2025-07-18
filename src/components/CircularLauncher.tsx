import React, { useState, useRef, useEffect } from 'react';
import { Settings, Key, RotateCcw, Check } from 'lucide-react';

interface CircularLauncherProps {
  onClick: () => void;
  isAgentMode?: boolean;
}

interface ApiKeyOption {
  id: string;
  name: string;
  status: 'active' | 'inactive' | 'error';
}
const CircularLauncher: React.FC<CircularLauncherProps> = ({ onClick, isAgentMode = false }) => {
  // Initialize position at top right
  const [position, setPosition] = useState({ x: window.innerWidth - 100, y: 20 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [hasDragged, setHasDragged] = useState(false);
  const [showApiKeySwap, setShowApiKeySwap] = useState(false);
  const [currentApiKey, setCurrentApiKey] = useState('gemini-pro');
  const [isRestarting, setIsRestarting] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const apiKeyOptions: ApiKeyOption[] = [
    { id: 'gemini-pro', name: 'Gemini Pro', status: 'active' },
    { id: 'gemini-flash', name: 'Gemini Flash', status: 'inactive' },
    { id: 'openai-gpt4', name: 'OpenAI GPT-4', status: 'inactive' },
    { id: 'claude-sonnet', name: 'Claude Sonnet', status: 'inactive' },
    { id: 'azure-openai', name: 'Azure OpenAI', status: 'inactive' }
  ];

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setHasDragged(false);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      setHasDragged(true);
      const newX = e.clientX - dragStart.x;
      const newY = e.clientY - dragStart.y;
      
      // Keep button within viewport bounds
      const maxX = window.innerWidth - 80;
      const maxY = window.innerHeight - 80;
      
      setPosition({
        x: Math.max(0, Math.min(newX, maxX)),
        y: Math.max(0, Math.min(newY, maxY))
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleClick = (e: React.MouseEvent) => {
    if (!hasDragged && !showApiKeySwap) {
      onClick();
    }
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragStart]);

  // Update position on window resize to keep it in bounds
  useEffect(() => {
    const handleResize = () => {
      const maxX = window.innerWidth - 80;
      const maxY = window.innerHeight - 80;
      
      setPosition(prev => ({
        x: Math.min(prev.x, maxX),
        y: Math.min(prev.y, maxY)
      }));
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleApiKeySwap = async (newApiKey: string) => {
    setIsRestarting(true);
    setCurrentApiKey(newApiKey);
    
    // Simulate API key swap and restart
    setTimeout(() => {
      setShowApiKeySwap(false);
      setIsRestarting(false);
      // Force a page reload to restart the launcher with new API key
      window.location.reload();
    }, 1500);
  };

  const toggleApiKeySwap = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowApiKeySwap(!showApiKeySwap);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-400 bg-green-400/20';
      case 'inactive': return 'text-gray-400 bg-gray-400/20';
      case 'error': return 'text-red-400 bg-red-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  if (isRestarting) {
    return (
      <div
        className="fixed w-20 h-20 bg-gradient-to-br from-confluence-blue to-confluence-light-blue text-white rounded-full shadow-2xl z-50 flex items-center justify-center font-bold text-sm backdrop-blur-xl border-2 border-white/30 animate-pulse"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          boxShadow: `
            0 0 30px rgba(38, 132, 255, 0.6),
            0 0 60px rgba(38, 132, 255, 0.4),
            0 8px 32px rgba(0, 0, 0, 0.3),
            inset 0 1px 0 rgba(255, 255, 255, 0.3)
          `,
        }}
      >
        <RotateCcw className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="fixed top-4 right-4 z-50">
      <button
        ref={buttonRef}
        onMouseDown={handleMouseDown}
        onClick={handleClick}
        className={`w-10 h-10 text-white rounded-lg shadow-lg cursor-pointer flex items-center justify-center text-xs font-semibold transition-all duration-200 ${
          isAgentMode 
            ? 'bg-orange-500 hover:bg-orange-600' 
            : 'bg-confluence-blue hover:bg-blue-600'
        }`}
      >
        <span className="text-white font-bold">AI</span>
      </button>

      {/* Settings dropdown */}
      {showApiKeySwap && (
        <div className="absolute top-12 right-0 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          <div className="p-3 border-b border-gray-100">
            <div className="flex items-center space-x-2">
              <Settings className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">API Settings</span>
            </div>
          </div>
          <div className="p-2 space-y-1">
            {apiKeyOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => handleApiKeySwap(option.id)}
                disabled={option.id === currentApiKey}
                className={`w-full p-2 rounded text-left text-sm flex items-center justify-between ${
                  option.id === currentApiKey
                    ? 'bg-blue-50 text-blue-700'
                    : 'hover:bg-gray-50 text-gray-700'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${getStatusColor(option.status)}`} />
                  <span>{option.name}</span>
                </div>
                {option.id === currentApiKey && (
                  <Check className="w-4 h-4 text-blue-600" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CircularLauncher;