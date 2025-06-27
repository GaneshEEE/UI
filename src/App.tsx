import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import AIPoweredSearch from './components/AIPoweredSearch';
import VideoSummarizer from './components/VideoSummarizer';
import CodeAssistant from './components/CodeAssistant';
import ImpactAnalyzer from './components/ImpactAnalyzer';
import TestSupportTool from './components/TestSupportTool';
import { DragProvider } from './contexts/DragContext';

export type FeatureType = 'search' | 'video' | 'code' | 'impact' | 'test' | null;

function App() {
  const [activeFeature, setActiveFeature] = useState<FeatureType>(null);

  const renderActiveFeature = () => {
    switch (activeFeature) {
      case 'search':
        return <AIPoweredSearch onClose={() => setActiveFeature(null)} />;
      case 'video':
        return <VideoSummarizer onClose={() => setActiveFeature(null)} />;
      case 'code':
        return <CodeAssistant onClose={() => setActiveFeature(null)} />;
      case 'impact':
        return <ImpactAnalyzer onClose={() => setActiveFeature(null)} />;
      case 'test':
        return <TestSupportTool onClose={() => setActiveFeature(null)} />;
      default:
        return null;
    }
  };

  return (
    <DragProvider>
      <div className="min-h-screen bg-gray-50 p-4">
        <Sidebar
          activeFeature={activeFeature}
          onFeatureSelect={setActiveFeature}
        />
        {renderActiveFeature()}
      </div>
    </DragProvider>
  );
}

export default App;