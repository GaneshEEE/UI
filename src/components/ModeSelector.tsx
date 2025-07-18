import React, { useState } from 'react';
import { Zap, Wrench, X } from 'lucide-react';
import { AppMode } from '../App';

interface ModeSelectorProps {
  onModeSelect: (mode: AppMode) => void;
  onClose: () => void;
}

const ModeSelector: React.FC<ModeSelectorProps> = ({ onModeSelect, onClose }) => {
  const [selectedMode, setSelectedMode] = useState<'agent' | 'tool'>('agent');

  const handleModeChange = (mode: 'agent' | 'tool') => {
    setSelectedMode(mode);
  };

  const handleConfirm = () => {
    onModeSelect(selectedMode);
  };

  return (
    <div className="fixed top-4 right-4 z-40 animate-fadeIn">
      <div className={`rounded-lg shadow-lg w-80 h-auto overflow-hidden animate-slideInUp ${
        selectedMode === 'agent' 
          ? 'bg-white border border-orange-200' 
          : 'bg-white border border-gray-200'
      }`}>
        {/* Header */}
        <div className={`p-4 text-white ${
          selectedMode === 'agent'
            ? 'bg-orange-500 border-b border-orange-200'
            : 'bg-confluence-blue border-b border-gray-200'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h2 className="text-base font-semibold">Choose Mode</h2>
              <p className={`text-sm ${
                selectedMode === 'agent' ? 'text-orange-100/90' : 'text-blue-100/90'
              }`}>Select interaction type</p>
            </div>
            <button onClick={onClose} className="text-white hover:bg-white/10 rounded p-1 transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mode Selection */}
        <div className="p-4 space-y-4">
          {/* Segmented Toggle */}
          <div className={`relative rounded-lg p-1 mb-3 ${
            selectedMode === 'agent'
              ? 'bg-orange-50 border border-orange-200'
              : 'bg-gray-100 border border-gray-200'
          }`}>
            <div 
              className={`absolute top-1 bottom-1 w-1/2 bg-white rounded shadow-sm transition-all duration-300 ease-out ${
                selectedMode === 'agent' ? 'left-1' : 'left-1/2'
              }`}
              style={{
                background: '#ffffff',
                borderColor: selectedMode === 'agent' ? 'rgba(249, 115, 22, 0.3)' : 'rgba(38, 132, 255, 0.3)',
                borderWidth: '1px'
              }}
            />
            
            <div className="relative flex">
              <button
                onClick={() => handleModeChange('agent')}
                className={`flex-1 py-2 px-3 text-center text-sm font-medium transition-all duration-300 rounded ${
                  selectedMode === 'agent'
                    ? 'text-orange-600 z-10'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Agent Mode
              </button>
              <button
                onClick={() => handleModeChange('tool')}
                className={`flex-1 py-2 px-3 text-center text-sm font-medium transition-all duration-300 rounded ${
                  selectedMode === 'tool'
                    ? 'text-confluence-blue z-10'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Tool Mode
              </button>
            </div>
          </div>

          {/* Mode Description */}
          <div className="mb-4 min-h-[80px]">
            {selectedMode === 'agent' ? (
              <div className="bg-white rounded-lg p-3 border border-orange-200">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-6 h-6 bg-orange-100 rounded flex items-center justify-center">
                    <Zap className="w-3 h-3 text-yellow-500" />
                  </div>
                  <h3 className="text-sm font-semibold text-orange-800">Agent Mode</h3>
                </div>
                <p className="text-orange-700 text-sm leading-relaxed">
                  Goal-based assistance with AI planning and execution. Creates plans and executes them step by step.
                </p>
              </div>
            ) : (
              <div className="bg-white rounded-lg p-3 border border-blue-200">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-6 h-6 bg-blue-100 rounded flex items-center justify-center">
                    <Wrench className="w-3 h-3 text-confluence-blue" />
                  </div>
                  <h3 className="text-sm font-semibold text-confluence-blue">Tool Mode</h3>
                </div>
                <p className="text-blue-700 text-sm leading-relaxed">
                  Access individual tools like Search, Code Assistant, Video Summarizer for specific tasks.
                </p>
              </div>
            )}
          </div>

          {/* Confirm Button */}
          <button
            onClick={handleConfirm}
            className={`w-full py-3 px-4 rounded-lg text-sm font-medium text-white transition-all duration-200 ${
              selectedMode === 'agent'
                ? 'bg-orange-500 hover:bg-orange-600'
                : 'bg-confluence-blue hover:bg-blue-600'
            }`}
          >
            Continue with {selectedMode === 'agent' ? 'Agent' : 'Tool'} Mode
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModeSelector;