import React from 'react';
import { Zap, Wrench, X } from 'lucide-react';
import { AppMode } from '../App';

interface ModeSelectorProps {
  onModeSelect: (mode: AppMode) => void;
  onClose: () => void;
}

const ModeSelector: React.FC<ModeSelectorProps> = ({ onModeSelect, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-40 p-4">
      <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-slideInUp">
        {/* Header */}
        <div className="bg-gradient-to-r from-confluence-blue/90 to-confluence-light-blue/90 backdrop-blur-xl p-6 text-white border-b border-white/10">
          <div className="flex items-center justify-between">
            <div className="text-center flex-1">
              <h2 className="text-2xl font-bold">Choose Your Mode</h2>
              <p className="text-blue-100/90 mt-1">How would you like to interact with the AI?</p>
            </div>
            <button onClick={onClose} className="text-white hover:bg-white/10 rounded-full p-2 backdrop-blur-sm">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Mode Options */}
        <div className="p-8 space-y-4">
          {/* Agent Mode */}
          <button
            onClick={() => onModeSelect('agent')}
            className="w-full p-6 bg-gradient-to-br from-orange-500/90 to-orange-600/90 backdrop-blur-sm text-white rounded-xl border border-orange-300/30 hover:from-orange-600/90 hover:to-orange-700/90 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-orange-500/30"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                <Zap className="w-6 h-6" />
              </div>
              <div className="text-left flex-1">
                <h3 className="text-xl font-bold">⚡ Agent Mode</h3>
                <p className="text-orange-100 text-sm mt-1">
                  Goal-based assistance with AI planning and execution
                </p>
              </div>
            </div>
          </button>

          {/* Tool Mode */}
          <button
            onClick={() => onModeSelect('tool')}
            className="w-full p-6 bg-gradient-to-br from-confluence-blue/90 to-confluence-light-blue/90 backdrop-blur-sm text-white rounded-xl border border-blue-300/30 hover:from-confluence-blue hover:to-confluence-light-blue hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-blue-500/30"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                <Wrench className="w-6 h-6" />
              </div>
              <div className="text-left flex-1">
                <h3 className="text-xl font-bold">🧰 Tool Mode</h3>
                <p className="text-blue-100 text-sm mt-1">
                  Access individual tools like Search, Code Assistant, etc.
                </p>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModeSelector;