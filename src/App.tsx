import React, { useState } from 'react';
import AIPoweredSearch from './components/AIPoweredSearch';
import VideoSummarizer from './components/VideoSummarizer';
import CodeAssistant from './components/CodeAssistant';
import ImpactAnalyzer from './components/ImpactAnalyzer';
import TestSupportTool from './components/TestSupportTool';

export type FeatureType = 'search' | 'video' | 'code' | 'impact' | 'test' | null;

function App() {
  const [activeFeature, setActiveFeature] = useState<FeatureType>('search');

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
      default:
        return <AIPoweredSearch onClose={() => setActiveFeature(null)} onFeatureSelect={setActiveFeature} />;
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Floating Orbs Background */}
      <div className="floating-orb w-32 h-32 top-10 left-10" style={{ animationDelay: '0s' }}></div>
      <div className="floating-orb w-24 h-24 top-1/3 right-20" style={{ animationDelay: '2s' }}></div>
      <div className="floating-orb w-40 h-40 bottom-20 left-1/4" style={{ animationDelay: '4s' }}></div>
      <div className="floating-orb w-20 h-20 bottom-1/3 right-1/3" style={{ animationDelay: '6s' }}></div>
      
      <div className="relative z-10 p-4">
        {renderActiveFeature()}
      </div>
    </div>
  );
}

export default App;