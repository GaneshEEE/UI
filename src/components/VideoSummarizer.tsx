import React, { useState } from 'react';
import { Video, Download, Save, X, ChevronDown, ChevronRight, Loader2, Search, Code, TrendingUp, TestTube, MessageSquare, Image } from 'lucide-react';
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
    { id: 'image' as const, label: 'Image Insights & Chart Builder', icon: Image },
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
    <div className="fixed top-4 right-4 z-40">
      <div className="bg-white border border-gray-200 rounded-lg shadow-lg w-[500px] h-[700px] overflow-hidden">
        {/* Header */}
        <div className="bg-confluence-blue p-4 text-white border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Video className="w-5 h-5" />
              <div>
                <h2 className="text-base font-bold">Video Summarizer</h2>
                <p className="text-blue-100 text-sm">Analyze and summarize video content</p>
              </div>
            </div>
            <button onClick={onClose} className="text-white hover:bg-white/10 rounded p-1.5">
              <X className="w-4 h-4" />
            </button>
          </div>
          
          {/* Feature Navigation */}
          <div className="mt-3 flex gap-1 overflow-x-auto">
            {features.map((feature) => {
              const Icon = feature.icon;
              const isActive = feature.id === 'video';
              
              return (
                <button
                  key={feature.id}
                  onClick={() => onFeatureSelect(feature.id)}
                  className={`flex items-center space-x-1 px-2 py-1 rounded text-xs transition-all duration-200 whitespace-nowrap ${
                    isActive
                      ? 'bg-white text-confluence-blue'
                      : 'text-white hover:bg-white/20'
                  }`}
                >
                  <Icon className="w-3 h-3" />
                  <span className="font-medium">{feature.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="p-4 overflow-y-auto h-[calc(700px-120px)]">
          {/* Video Selection Section */}
          <div className="mb-4 bg-white rounded-lg p-4 border border-gray-200">
            <h3 className="font-semibold text-gray-800 mb-4">Select Video Content</h3>
            <div className="space-y-3">
              {/* Space Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Confluence Space
                </label>
                <div className="relative">
                  <select
                    value={selectedSpace}
                    onChange={(e) => setSelectedSpace(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-confluence-blue focus:border-confluence-blue appearance-none bg-white"
                  >
                    <option value="">Choose a space...</option>
                    {spaces.map(space => (
                      <option key={space} value={space}>{space}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
              </div>

              {/* Page Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Video Page
                </label>
                <div className="relative">
                  <select
                    value={selectedPage}
                    onChange={(e) => setSelectedPage(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-confluence-blue focus:border-confluence-blue appearance-none bg-white"
                  >
                    <option value="">Choose a page...</option>
                    {pages.map(page => (
                      <option key={page} value={page}>{page}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
              </div>
            </div>

            <button
              onClick={processVideo}
              disabled={!selectedSpace || !selectedPage || isProcessing}
              className="mt-3 w-full bg-confluence-blue text-white py-2 px-4 rounded hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center space-x-2 transition-colors"
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
              <div key={video.id} className="border border-gray-200 rounded-lg overflow-hidden bg-white">
                <div 
                  className="p-3 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => setExpandedVideo(expandedVideo === video.id ? null : video.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-blue-100 rounded flex items-center justify-center">
                        <Video className="w-5 h-5 text-confluence-blue" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-800">{video.name}</h4>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>Processed</span>
                          <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                            Completed
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="flex space-x-1">
                        <button
                          onClick={(e) => { e.stopPropagation(); exportSummary(video, exportFormat); }}
                          className="px-2 py-1 bg-confluence-blue text-white rounded text-xs hover:bg-blue-600 transition-colors"
                        >
                          Export
                        </button>
                      </div>
                      {expandedVideo === video.id ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                    </div>
                  </div>
                </div>

                {expandedVideo === video.id && (
                  <div className="border-t border-gray-200 bg-white">
                    <div className="p-4 space-y-4">
                      {/* Summary */}
                      <div>
                        <h5 className="font-semibold text-gray-800 mb-3">AI Summary</h5>
                        <div className="bg-gray-50 rounded p-3">
                          <p className="text-gray-700">{video.summary}</p>
                        </div>
                      </div>

                      {/* Key Quotes */}
                      {video.quotes && video.quotes.length > 0 && (
                        <div>
                          <h5 className="font-semibold text-gray-800 mb-3">Key Quotes</h5>
                          <div className="space-y-2">
                            {video.quotes.map((quote, index) => (
                              <div key={index} className="bg-gray-50 rounded p-3 border-l-4 border-confluence-blue">
                                <p className="text-gray-700 italic">"{quote}"</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Q&A Section */}
                      <div>
                        <h5 className="font-semibold text-gray-800 mb-3">Questions & Answers</h5>
                        <div className="space-y-4">
                          {video.qa && video.qa.length > 0 && (
                            <div className="space-y-3">
                              {video.qa.map((qa, index) => (
                                <div key={index} className="bg-gray-50 rounded p-3">
                                  <p className="font-medium text-gray-800 mb-2">Q: {qa.question}</p>
                                  <p className="text-gray-700">A: {qa.answer}</p>
                                </div>
                              ))}
                            </div>
                          )}
                          
                          {/* Add New Question */}
                          <div className="bg-gray-50 rounded p-3">
                            <div className="flex space-x-2">
                              <input
                                type="text"
                                value={newQuestion}
                                onChange={(e) => setNewQuestion(e.target.value)}
                                placeholder="Ask a question about this video..."
                                className="flex-1 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-confluence-blue focus:border-confluence-blue bg-white"
                                onKeyPress={(e) => e.key === 'Enter' && addQuestion()}
                              />
                              <button
                                onClick={() => {
                                  setSelectedVideo(video.id);
                                  addQuestion();
                                }}
                                className="px-3 py-2 bg-confluence-blue text-white rounded hover:bg-blue-600 transition-colors flex items-center"
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
                          <label className="text-sm font-medium text-gray-700">Export Format:</label>
                          <select
                            value={exportFormat}
                            onChange={(e) => setExportFormat(e.target.value)}
                            className="px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-confluence-blue bg-white"
                          >
                            <option value="markdown">Markdown</option>
                            <option value="pdf">PDF</option>
                            <option value="docx">Word Document</option>
                            <option value="txt">Plain Text</option>
                          </select>
                        </div>
                        
                        <div className="flex space-x-2 pt-3 border-t border-gray-200">
                          <button
                            onClick={() => exportSummary(video, exportFormat)}
                            className="flex items-center space-x-2 px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                          >
                            <Download className="w-4 h-4" />
                            <span>Export</span>
                          </button>
                          <button
                            onClick={() => alert('Saved to Confluence!')}
                            className="flex items-center space-x-2 px-3 py-2 bg-confluence-blue text-white rounded hover:bg-blue-600 transition-colors"
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
              <Video className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <h3 className="text-base font-semibold text-gray-600 mb-2">No Videos Processed</h3>
              <p className="text-sm text-gray-500">Select a space and page with video content to start generating AI summaries.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoSummarizer;