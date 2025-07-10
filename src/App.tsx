import React, { useState } from 'react';
import ModeSelector from './components/ModeSelector';
import AgentMode from './components/AgentMode';
import AIPoweredSearch from './components/AIPoweredSearch';
import VideoSummarizer from './components/VideoSummarizer';
import CodeAssistant from './components/CodeAssistant';
import ImpactAnalyzer from './components/ImpactAnalyzer';
import TestSupportTool from './components/TestSupportTool';
import ImageInsights from './components/ImageInsights';
import CircularLauncher from './components/CircularLauncher';

export type FeatureType = 'search' | 'video' | 'code' | 'impact' | 'test' | 'image' | null;
export type AppMode = 'agent' | 'tool' | null;

function App() {
  const [activeFeature, setActiveFeature] = useState<FeatureType>(null);
  const [isAppOpen, setIsAppOpen] = useState(false);
  const [appMode, setAppMode] = useState<AppMode>('tool'); // Default to tool mode

  const renderActiveFeature = () => {
    switch (activeFeature) {
      case 'search':
        return <AIPoweredSearch onClose={() => setActiveFeature(null)} onFeatureSelect={setActiveFeature} />;
      case 'video':
        return <VideoSummarizer onClose={() => setActiveFeature(null)} onFeatureSelect={setActiveFeature} />;
      case 'code':
        return <CodeAssistant onClose={() => setActiveFeature(null)} onFeatureSelect={setActiveFeature} />;
      case 'impact':
        return <ImpactAnalyzer onClose={() => setActiveFeature(null)} onFeatureSelect={setActiveFeature} />;
      case 'test':
        return <TestSupportTool onClose={() => setActiveFeature(null)} onFeatureSelect={setActiveFeature} />;
      case 'image':
        return <ImageInsights onClose={() => setActiveFeature(null)} onFeatureSelect={setActiveFeature} />;
      default:
        return <AIPoweredSearch onClose={() => setActiveFeature(null)} onFeatureSelect={setActiveFeature} />;
    }
  };

  const handleLauncherClick = () => {
    setIsAppOpen(true);
    setActiveFeature('search'); // Default to search for tool mode
  };

  const handleAppClose = () => {
    setIsAppOpen(false);
    setActiveFeature(null);
    setAppMode('tool'); // Reset to tool mode
  };

  const handleModeSelect = (mode: AppMode) => {
    setAppMode(mode);
    if (mode === 'tool') {
      setActiveFeature('search'); // Default to search for tool mode
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {!isAppOpen && (
        <CircularLauncher onClick={handleLauncherClick} isAgentMode={appMode === 'agent'} />
      )}
      
      {isAppOpen && (
        <div>
          {appMode === 'agent' ? (
            <AgentMode onClose={handleAppClose} onModeSelect={setAppMode} />
          ) : activeFeature ? (
            renderActiveFeature()
          ) : (
            <AIPoweredSearch onClose={handleAppClose} onFeatureSelect={setActiveFeature} />
          )}
          
          {/* Mode Selector - Show as overlay when switching modes */}
          {isAppOpen && (
            <div className="fixed bottom-6 right-6 z-50">
              <ModeSelector 
                onModeSelect={handleModeSelect} 
                onClose={() => {}} 
                currentMode={appMode}
                isOverlay={true}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;