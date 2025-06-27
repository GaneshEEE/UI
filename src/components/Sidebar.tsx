import React, { useState, useRef } from 'react';
import { Search, Video, Code, TrendingUp, TestTube, Move, X } from 'lucide-react';
import { FeatureType } from '../App';
import { useDrag } from '../contexts/DragContext';

interface SidebarProps {
  activeFeature: FeatureType;
  onFeatureSelect: (feature: FeatureType) => void;
}

const features = [
  { id: 'search' as const, label: 'AI Powered Search', icon: Search },
  { id: 'video' as const, label: 'Video Summarizer', icon: Video },
  { id: 'code' as const, label: 'Code Assistant', icon: Code },
  { id: 'impact' as const, label: 'Impact Analyzer', icon: TrendingUp},
  { id: 'test' as const, label: 'Test Support Tool', icon: TestTube},
];

const Sidebar: React.FC<SidebarProps> = ({ activeFeature, onFeatureSelect }) => {
  const [position, setPosition] = useState({ x: 20, y: 20 });
  const [isMinimized, setIsMinimized] = useState(false);
  const { isDragging, setIsDragging } = useDrag();
  const dragRef = useRef<{ startX: number; startY: number; initialX: number; initialY: number }>({
    startX: 0,
    startY: 0,
    initialX: 0,
    initialY: 0,
  });

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget || (e.target as HTMLElement).classList.contains('drag-handle')) {
      setIsDragging(true);
      dragRef.current = {
        startX: e.clientX,
        startY: e.clientY,
        initialX: position.x,
        initialY: position.y,
      };

      const handleMouseMove = (e: MouseEvent) => {
        const deltaX = e.clientX - dragRef.current.startX;
        const deltaY = e.clientY - dragRef.current.startY;
        setPosition({
          x: Math.max(0, Math.min(window.innerWidth - 320, dragRef.current.initialX + deltaX)),
          y: Math.max(0, Math.min(window.innerHeight - 100, dragRef.current.initialY + deltaY)),
        });
      };

      const handleMouseUp = () => {
        setIsDragging(false);
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
  };

  if (isMinimized) {
    return (
      <div
        className="fixed z-50 w-12 h-12 bg-white rounded-full shadow-lg border border-gray-200 flex items-center justify-center cursor-pointer hover:shadow-xl transition-all duration-200"
        style={{ left: position.x, top: position.y }}
        onClick={() => setIsMinimized(false)}
      >
        <Code className="w-6 h-6 text-confluence-blue" />
      </div>
    );
  }

  return (
    <div
      className={`fixed z-50 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden transition-all duration-200 ${
        isDragging ? 'cursor-grabbing' : 'cursor-grab'
      }`}
      style={{ left: position.x, top: position.y }}
      onMouseDown={handleMouseDown}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-confluence-blue to-confluence-light-blue p-4 drag-handle">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Move className="w-5 h-5 text-white drag-handle" />
            <h1 className="text-white font-semibold text-lg">Confluence AI Assistant</h1>
          </div>
          <button
            onClick={() => setIsMinimized(true)}
            className="text-white hover:bg-white/20 rounded-full p-1 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Feature Buttons */}
      <div className="p-4 space-y-3">
        {features.map((feature) => {
          const Icon = feature.icon;
          const isActive = activeFeature === feature.id;
          
          return (
            <button
              key={feature.id}
              onClick={() => onFeatureSelect(isActive ? null : feature.id)}
              className={`w-full p-4 rounded-lg border-2 transition-all duration-200 flex items-center space-x-4 hover:shadow-md ${
                isActive
                  ? 'border-confluence-blue bg-confluence-light-blue/10 shadow-md'
                  : 'border-gray-200 hover:border-confluence-blue/50 hover:bg-gray-50'
              }`}
            >
              <div className="flex-shrink-0">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                  isActive ? 'bg-confluence-blue text-white' : 'bg-gray-100 text-gray-600'
                }`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
              <div className="flex-1 text-left">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">{feature.emoji}</span>
                  <h3 className={`font-semibold ${isActive ? 'text-confluence-blue' : 'text-gray-800'}`}>
                    {feature.label}
                  </h3>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Footer */}
      <div className="px-4 pb-4">
        <div className="text-center text-xs text-gray-500 bg-gray-50 rounded-lg py-2">
          Space: {new URLSearchParams(window.location.search).get('spaceKey') || 'Not detected'}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
