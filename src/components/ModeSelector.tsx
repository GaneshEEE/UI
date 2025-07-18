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
    <div className="fixed inset-0 flex items-center justify-center z-40 p-4">
      <div className="bg-[#1e1e1e] border border-[#3c3c3c] rounded-lg shadow-2xl w-full max-w-sm overflow-hidden">
        {/* Header */}
        <div className="bg-[#2d2d30] border-b border-[#3c3c3c] p-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-[#cccccc] text-lg font-medium">Choose Mode</h2>
              <p className="text-[#9d9d9d] text-sm mt-1">Select how you want to interact</p>
            </div>
            <button 
              onClick={onClose} 
              className="text-[#cccccc] hover:text-white hover:bg-[#3c3c3c] rounded p-1 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mode Selection */}
        <div className="p-4">
          {/* Mode Options */}
          <div className="space-y-3 mb-6">
            <button
              onClick={() => handleModeChange('agent')}
              className={`w-full text-left p-3 rounded border transition-all ${
                selectedMode === 'agent'
                  ? 'bg-[#0e639c] border-[#007acc] text-white'
                  : 'bg-[#252526] border-[#3c3c3c] text-[#cccccc] hover:bg-[#2a2d2e]'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Zap className={`w-5 h-5 ${selectedMode === 'agent' ? 'text-yellow-400' : 'text-[#9d9d9d]'}`} />
                <div>
                  <div className="font-medium">Agent Mode</div>
                  <div className={`text-sm mt-1 ${selectedMode === 'agent' ? 'text-blue-100' : 'text-[#9d9d9d]'}`}>
                    Goal-based AI assistance with planning
                  </div>
                </div>
              </div>
            </button>

            <button
              onClick={() => handleModeChange('tool')}
              className={`w-full text-left p-3 rounded border transition-all ${
                selectedMode === 'tool'
                  ? 'bg-[#0e639c] border-[#007acc] text-white'
                  : 'bg-[#252526] border-[#3c3c3c] text-[#cccccc] hover:bg-[#2a2d2e]'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Wrench className={`w-5 h-5 ${selectedMode === 'tool' ? 'text-white' : 'text-[#9d9d9d]'}`} />
                <div>
                  <div className="font-medium">Tool Mode</div>
                  <div className={`text-sm mt-1 ${selectedMode === 'tool' ? 'text-blue-100' : 'text-[#9d9d9d]'}`}>
                    Access individual AI-powered tools
                  </div>
                </div>
              </div>
            </button>
          </div>

          {/* Confirm Button */}
          <button
            onClick={handleConfirm}
            className="w-full py-2.5 px-4 bg-[#0e639c] hover:bg-[#1177bb] text-white rounded font-medium transition-colors"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModeSelector;