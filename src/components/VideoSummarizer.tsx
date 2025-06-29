import React, { useState } from 'react';
import { Video, Download, Save, X, ChevronDown, ChevronRight, Loader2, Search, Code, TrendingUp, TestTube, MessageSquare } from 'lucide-react';
import { FeatureType } from '../App';

interface VideoSummarizerProps {
  onClose: () => void;
  onFeatureSelect: (feature: FeatureType) => void;
}

interface VideoContent {
  id: string;
  name: string;
  summary?: string;
  quotes?: string[];
  qa?: { question: string; answer: string }[];
}

const VideoSummarizer: React.FC<VideoSummarizerProps> = ({ onClose, onFeatureSelect }) => {
  const [selectedSpace, setSelectedSpace] = useState('');
  const [selectedPage, setSelectedPage] = useState('');
  const [videos, setVideos] = useState<VideoContent[]>([]);
  const [expandedVideo, setExpandedVideo] = useState<string | null>(null);
  const [newQuestion, setNewQuestion] = useState('');
  const [selectedVideo, setSelectedVideo] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [exportFormat, setExportFormat] = useState('markdown');

  const spaces = ['Engineering', 'Product', 'Design', 'Marketing', 'Documentation'];
  const pages = ['Team Meeting Recording', 'Product Demo Video', 'Training Session', 'Client Presentation', 'Technical Review'];

  const features = [
    { id: 'search' as const, label: 'AI Powered Search', icon: Search },
    { id: 'video' as const, label: 'Video Summarizer', icon: Video },
    { id: 'code' as const, label: 'Code Assistant', icon: Code },
    { id: 'impact' as const, label: 'Impact Analyzer', icon: TrendingUp },
    { id: 'test' as const, label: 'Test Support Tool', icon: TestTube },
  ];

  const processVideo = async () => {
    if (!selectedSpace || !selectedPage) return;
    
    setIsProcessing(true);
    
    // Simulate processing
    setTimeout(() => {
      const newVideo: VideoContent = {
        id: Date.now().toString(),
        name: selectedPage,
        summary: `This video from ${selectedSpace} space covers key topics and discussions. The AI has analyzed the content and extracted important insights, decisions, and action items from the recording.`,
        quotes: [
          'We need to prioritize the user authentication feature for the next sprint.',
          'The technical debt in the payment system is becoming a blocker for new features.',
          'Let\'s schedule a deep-dive session on the architecture changes next week.'
        ],
        qa: []
      };
      setVideos(prev => [...prev, newVideo]);
      setIsProcessing(false);
    }, 3000);
  };

  const addQuestion = () => {
    if (!newQuestion.trim() || !selectedVideo) return;
    
    setVideos(prev => prev.map(v => 
      v.id === selectedVideo 
        ? { 
            ...v, 
            qa: [...(v.qa || []), { question: newQuestion, answer: 'AI-generated answer based on the video content analysis...' }]
          } 
        : v
    ));
    setNewQuestion('');
  };

  const exportSummary = (video: VideoContent, format: string) => {
    const content = `# Video Summary: ${video.name}

## Summary
${video.summary}

## Key Quotes
${video.quotes?.map(quote => `- "${quote}"`).join('\n')}

## Q&A
${video.qa?.map(qa => `**Q:** ${qa.question}\n**A:** ${qa.answer}`).join('\n\n')}`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${video.name.replace(/\s+/g, '_')}_summary.${format}`;
    a.click();
  };

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-40 p-4">
      <div className="glass-container rounded-3xl w-full max-w-6xl max-h-[90vh] overflow-hidden liquid-animation">
        {/* Header */}
        <div className="glass-header p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-2xl glass-card flex items-center justify-center liquid-animation-delayed">
                <Video className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold glass-text">Confluence AI Assistant</h2>
                <p className="glass-text-muted">AI-powered tools for your Confluence workspace</p>
              </div>
            </div>
            <button onClick={onClose} className="glass-button rounded-full p-2 hover:rotate-90 transition-transform duration-300">
              <X className="w-6 h-6" />
            </button>
          </div>
          
          {/* Feature Navigation */}
          <div className="mt-6 flex gap-2">
            {features.map((feature) => {
              const Icon = feature.icon;
              const isActive = feature.id === 'video';
              
              return (
                <button
                  key={feature.id}
                  onClick={() => onFeatureSelect(feature.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-300 whitespace-nowrap ${
                    isActive
                      ? 'glass-nav-button-active'
                      : 'glass-nav-button'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{feature.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {/* Video Selection Section */}
          <div className="mb-6 glass-card rounded-2xl p-6">
            <h3 className="font-semibold glass-text mb-4">Select Video Content</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Space Selection */}
              <div>
                <label className="block text-sm font-medium glass-text mb-2">
                  Select Confluence Space
                </label>
                <div className="relative">
                  <select
                    value={selectedSpace}
                    onChange={(e) => setSelectedSpace(e.target.value)}
                    className="w-full p-3 glass-select rounded-xl focus:ring-2 focus:ring-white/30 appearance-none"
                  >
                    <option value="">Choose a space...</option>
                    {spaces.map(space => (
                      <option key={space} value={space}>{space}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 glass-text-muted pointer-events-none" />
                </div>
              </div>

              {/* Page Selection */}
              <div>
                <label className="block text-sm font-medium glass-text mb-2">
                  Select Video Page
                </label>
                <div className="relative">
                  <select
                    value={selectedPage}
                    onChange={(e) => setSelectedPage(e.target.value)}
                    className="w-full p-3 glass-select rounded-xl focus:ring-2 focus:ring-white/30 appearance-none"
                  >
                    <option value="">Choose a page...</option>
                    {pages.map(page => (
                      <option key={page} value={page}>{page}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 glass-text-muted pointer-events-none" />
                </div>
              </div>
            </div>

            <button
              onClick={processVideo}
              disabled={!selectedSpace || !selectedPage || isProcessing}
              className="mt-4 w-full glass-button-primary py-3 px-4 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 transition-all duration-300"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Processing Video...</span>
                </>
              ) : (
                <>
                  <Video className="w-5 h-5" />
                  <span>Process Video</span>
                </>
              )}
            </button>
          </div>

          {/* Videos List */}
          <div className="space-y-4">
            {videos.map(video => (
              <div key={video.id} className="glass-card rounded-2xl overflow-hidden">
                <div 
                  className="p-4 cursor-pointer hover:bg-white/5 transition-colors"
                  onClick={() => setExpandedVideo(expandedVideo === video.id ? null : video.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 glass-card rounded-xl flex items-center justify-center">
                        <Video className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold glass-text">{video.name}</h4>
                        <div className="flex items-center space-x-4 text-sm glass-text-muted">
                          <span>Processed</span>
                          <span className="px-2 py-1 rounded-full text-xs glass-button-primary">
                            Completed
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="flex space-x-1">
                        <button
                          onClick={(e) => { e.stopPropagation(); exportSummary(video, exportFormat); }}
                          className="px-3 py-1 glass-button rounded-lg text-sm transition-all duration-300"
                        >
                          Export
                        </button>
                      </div>
                      {expandedVideo === video.id ? <ChevronDown className="w-5 h-5 glass-text" /> : <ChevronRight className="w-5 h-5 glass-text" />}
                    </div>
                  </div>
                </div>

                {expandedVideo === video.id && (
                  <div className="border-t border-white/10 glass-content">
                    <div className="p-6 space-y-6">
                      {/* Summary */}
                      <div>
                        <h5 className="font-semibold glass-text mb-3">AI Summary</h5>
                        <div className="glass-card rounded-xl p-4">
                          <p className="glass-text">{video.summary}</p>
                        </div>
                      </div>

                      {/* Key Quotes */}
                      {video.quotes && video.quotes.length > 0 && (
                        <div>
                          <h5 className="font-semibold glass-text mb-3">Key Quotes</h5>
                          <div className="space-y-2">
                            {video.quotes.map((quote, index) => (
                              <div key={index} className="glass-card rounded-xl p-4 border-l-4 border-white/30">
                                <p className="glass-text italic">"{quote}"</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Q&A Section */}
                      <div>
                        <h5 className="font-semibold glass-text mb-3">Questions & Answers</h5>
                        <div className="space-y-4">
                          {video.qa && video.qa.length > 0 && (
                            <div className="space-y-3">
                              {video.qa.map((qa, index) => (
                                <div key={index} className="glass-card rounded-xl p-4">
                                  <p className="font-medium glass-text mb-2">Q: {qa.question}</p>
                                  <p className="glass-text-muted">A: {qa.answer}</p>
                                </div>
                              ))}
                            </div>
                          )}
                          
                          {/* Add New Question */}
                          <div className="glass-card rounded-xl p-4">
                            <div className="flex space-x-2">
                              <input
                                type="text"
                                value={newQuestion}
                                onChange={(e) => setNewQuestion(e.target.value)}
                                placeholder="Ask a question about this video..."
                                className="flex-1 p-2 glass-input rounded-lg focus:ring-2 focus:ring-white/30"
                                onKeyPress={(e) => e.key === 'Enter' && addQuestion()}
                              />
                              <button
                                onClick={() => {
                                  setSelectedVideo(video.id);
                                  addQuestion();
                                }}
                                className="px-4 py-2 glass-button-primary rounded-lg transition-all duration-300 flex items-center"
                              >
                                <MessageSquare className="w-4 h-4 mr-1" />
                                Ask
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Export Options */}
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <label className="text-sm font-medium glass-text">Export Format:</label>
                          <select
                            value={exportFormat}
                            onChange={(e) => setExportFormat(e.target.value)}
                            className="px-3 py-1 glass-select rounded-lg text-sm focus:ring-2 focus:ring-white/30"
                          >
                            <option value="markdown">Markdown</option>
                            <option value="pdf">PDF</option>
                            <option value="docx">Word Document</option>
                            <option value="txt">Plain Text</option>
                          </select>
                        </div>
                        
                        <div className="flex space-x-2 pt-4 border-t border-white/10">
                          <button
                            onClick={() => exportSummary(video, exportFormat)}
                            className="flex items-center space-x-2 px-4 py-2 glass-button-primary rounded-xl transition-all duration-300"
                          >
                            <Download className="w-4 h-4" />
                            <span>Export</span>
                          </button>
                          <button
                            onClick={() => alert('Saved to Confluence!')}
                            className="flex items-center space-x-2 px-4 py-2 glass-button rounded-xl transition-all duration-300"
                          >
                            <Save className="w-4 h-4" />
                            <span>Save to Confluence</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {videos.length === 0 && !isProcessing && (
            <div className="text-center py-12">
              <div className="w-16 h-16 glass-card rounded-2xl flex items-center justify-center mx-auto mb-4 liquid-animation">
                <Video className="w-8 h-8 glass-text-muted" />
              </div>
              <h3 className="text-lg font-semibold glass-text mb-2">No Videos Processed</h3>
              <p className="glass-text-muted">Select a space and page with video content to start generating AI summaries.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoSummarizer;