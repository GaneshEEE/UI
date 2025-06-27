import React, { useState } from 'react';
import { Video, Upload, Play, Download, MessageSquare, X, ChevronDown, ChevronRight, Loader2 } from 'lucide-react';

interface VideoSummarizerProps {
  onClose: () => void;
}

interface VideoFile {
  id: string;
  name: string;
  size: string;
  duration: string;
  status: 'uploaded' | 'processing' | 'completed';
  summary?: string;
  quotes?: string[];
  qa?: { question: string; answer: string }[];
}

const VideoSummarizer: React.FC<VideoSummarizerProps> = ({ onClose }) => {
  const [videos, setVideos] = useState<VideoFile[]>([
    {
      id: '1',
      name: 'Team_Meeting_2024.mp4',
      size: '45.2 MB',
      duration: '15:30',
      status: 'completed',
      summary: 'This team meeting covered Q1 planning, discussed new feature requirements, and addressed technical debt concerns. Key decisions were made regarding the upcoming sprint planning and resource allocation.',
      quotes: [
        'We need to prioritize the user authentication feature for the next sprint.',
        'The technical debt in the payment system is becoming a blocker for new features.',
        'Let\'s schedule a deep-dive session on the architecture changes next week.'
      ],
      qa: [
        { question: 'What were the main topics discussed?', answer: 'Q1 planning, feature requirements, and technical debt' },
        { question: 'What decisions were made?', answer: 'Sprint planning approach and resource allocation strategies' }
      ]
    }
  ]);
  const [expandedVideo, setExpandedVideo] = useState<string | null>(null);
  const [newQuestion, setNewQuestion] = useState('');
  const [selectedVideo, setSelectedVideo] = useState<string>('');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    files.forEach(file => {
      const newVideo: VideoFile = {
        id: Date.now().toString(),
        name: file.name,
        size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
        duration: '00:00',
        status: 'processing'
      };
      setVideos(prev => [...prev, newVideo]);
      
      // Simulate processing
      setTimeout(() => {
        setVideos(prev => prev.map(v => 
          v.id === newVideo.id 
            ? { 
                ...v, 
                status: 'completed',
                summary: 'AI-generated summary will appear here after processing...',
                quotes: ['Key quote from the video will be extracted here'],
                qa: []
              } 
            : v
        ));
      }, 3000);
    });
  };

  const addQuestion = () => {
    if (!newQuestion.trim() || !selectedVideo) return;
    
    setVideos(prev => prev.map(v => 
      v.id === selectedVideo 
        ? { 
            ...v, 
            qa: [...(v.qa || []), { question: newQuestion, answer: 'AI will generate an answer based on the video content...' }]
          } 
        : v
    ));
    setNewQuestion('');
  };

  const exportSummary = (video: VideoFile, format: string) => {
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
    a.download = `${video.name.replace('.mp4', '')}_summary.${format}`;
    a.click();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-40 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-500 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Video className="w-8 h-8" />
              <div>
                <h2 className="text-2xl font-bold">Video Summarizer</h2>
                <p className="text-purple-100">Upload and analyze video content with AI</p>
              </div>
            </div>
            <button onClick={onClose} className="text-white hover:bg-white/20 rounded-full p-2">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Upload Section */}
          <div className="mb-6 bg-gray-50 rounded-lg p-6">
            <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
              <Upload className="w-5 h-5 mr-2" />
              Upload Videos
            </h3>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-purple-400 transition-colors">
              <input
                type="file"
                accept="video/*"
                multiple
                onChange={handleFileUpload}
                className="hidden"
                id="video-upload"
              />
              <label htmlFor="video-upload" className="cursor-pointer">
                <Video className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-lg font-medium text-gray-600">Drop video files here or click to browse</p>
                <p className="text-sm text-gray-500 mt-1">Supports MP4, AVI, MOV, and other video formats</p>
              </label>
            </div>
          </div>

          {/* Videos List */}
          <div className="space-y-4">
            {videos.map(video => (
              <div key={video.id} className="border border-gray-200 rounded-lg overflow-hidden">
                <div 
                  className="p-4 bg-white cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => setExpandedVideo(expandedVideo === video.id ? null : video.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Play className="w-6 h-6 text-purple-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800">{video.name}</h4>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>{video.size}</span>
                          <span>{video.duration}</span>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            video.status === 'completed' ? 'bg-green-100 text-green-800' :
                            video.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {video.status === 'processing' && <Loader2 className="w-3 h-3 animate-spin inline mr-1" />}
                            {video.status.charAt(0).toUpperCase() + video.status.slice(1)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {video.status === 'completed' && (
                        <div className="flex space-x-1">
                          <button
                            onClick={(e) => { e.stopPropagation(); exportSummary(video, 'md'); }}
                            className="px-3 py-1 bg-purple-600 text-white rounded text-sm hover:bg-purple-700 transition-colors"
                          >
                            Export
                          </button>
                        </div>
                      )}
                      {expandedVideo === video.id ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                    </div>
                  </div>
                </div>

                {expandedVideo === video.id && video.status === 'completed' && (
                  <div className="border-t border-gray-200 bg-gray-50">
                    <div className="p-6 space-y-6">
                      {/* Summary */}
                      <div>
                        <h5 className="font-semibold text-gray-800 mb-3">AI Summary</h5>
                        <div className="bg-white rounded-lg p-4 border">
                          <p className="text-gray-700">{video.summary}</p>
                        </div>
                      </div>

                      {/* Key Quotes */}
                      {video.quotes && video.quotes.length > 0 && (
                        <div>
                          <h5 className="font-semibold text-gray-800 mb-3">Key Quotes</h5>
                          <div className="space-y-2">
                            {video.quotes.map((quote, index) => (
                              <div key={index} className="bg-white rounded-lg p-4 border-l-4 border-purple-500">
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
                                <div key={index} className="bg-white rounded-lg p-4 border">
                                  <p className="font-medium text-gray-800 mb-2">Q: {qa.question}</p>
                                  <p className="text-gray-700">A: {qa.answer}</p>
                                </div>
                              ))}
                            </div>
                          )}
                          
                          {/* Add New Question */}
                          <div className="bg-white rounded-lg p-4 border">
                            <div className="flex space-x-2">
                              <input
                                type="text"
                                value={newQuestion}
                                onChange={(e) => setNewQuestion(e.target.value)}
                                placeholder="Ask a question about this video..."
                                className="flex-1 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                onKeyPress={(e) => e.key === 'Enter' && addQuestion()}
                              />
                              <button
                                onClick={() => {
                                  setSelectedVideo(video.id);
                                  addQuestion();
                                }}
                                className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors flex items-center"
                              >
                                <MessageSquare className="w-4 h-4 mr-1" />
                                Ask
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Export Options */}
                      <div className="flex space-x-2 pt-4 border-t">
                        <button
                          onClick={() => exportSummary(video, 'md')}
                          className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                          <Download className="w-4 h-4" />
                          <span>Export Markdown</span>
                        </button>
                        <button
                          onClick={() => exportSummary(video, 'pdf')}
                          className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                        >
                          <Download className="w-4 h-4" />
                          <span>Export PDF</span>
                        </button>
                        <button
                          onClick={() => alert('Saved to Confluence!')}
                          className="flex items-center space-x-2 px-4 py-2 bg-confluence-blue text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          <Download className="w-4 h-4" />
                          <span>Save to Confluence</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {videos.length === 0 && (
            <div className="text-center py-12">
              <Video className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">No Videos Uploaded</h3>
              <p className="text-gray-500">Upload video files to start generating AI summaries and insights.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoSummarizer;