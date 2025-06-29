import React, { useState } from 'react';
import { Search, Download, Save, FileText, X, ChevronDown, Loader2, Settings, Video, Code, TrendingUp, TestTube } from 'lucide-react';
import { FeatureType } from '../App';

interface AIPoweredSearchProps {
  onClose: () => void;
  onFeatureSelect: (feature: FeatureType) => void;
}

const AIPoweredSearch: React.FC<AIPoweredSearchProps> = ({ onClose, onFeatureSelect }) => {
  const [selectedSpace, setSelectedSpace] = useState('');
  const [selectedPages, setSelectedPages] = useState<string[]>([]);
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showRawContent, setShowRawContent] = useState(false);
  const [exportFormat, setExportFormat] = useState('markdown');

  const spaces = ['Engineering', 'Product', 'Design', 'Marketing', 'Documentation'];
  const pages = ['API Documentation', 'User Guide', 'Technical Specs', 'Meeting Notes', 'Project Overview'];

  const features = [
    { id: 'search' as const, label: 'AI Powered Search', icon: Search },
    { id: 'video' as const, label: 'Video Summarizer', icon: Video },
    { id: 'code' as const, label: 'Code Assistant', icon: Code },
    { id: 'impact' as const, label: 'Impact Analyzer', icon: TrendingUp },
    { id: 'test' as const, label: 'Test Support Tool', icon: TestTube },
  ];

  const handleSearch = async () => {
    setIsLoading(true);
    // Simulate AI processing
    setTimeout(() => {
      setResponse(`Based on your query "${query}" across ${selectedPages.length} pages in the ${selectedSpace} space:

## Summary
This is an AI-generated response that analyzes the selected pages to provide comprehensive insights. The system has processed the content and extracted relevant information to answer your question.

## Key Points
- **Point 1**: Detailed explanation based on the analyzed content
- **Point 2**: Additional insights from the documentation
- **Point 3**: Recommendations and next steps

## Sources
The response is based on analysis of the following pages:
${selectedPages.map(page => `- ${page}`).join('\n')}

*Generated at ${new Date().toLocaleString()}*`);
      setIsLoading(false);
    }, 2000);
  };

  const exportResponse = (format: string) => {
    const content = format === 'pdf' ? 'PDF export initiated...' : response;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ai-search-response.${format}`;
    a.click();
  };

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-40 p-4">
      <div className="glass-container rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden liquid-animation">
        {/* Header */}
        <div className="glass-header p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-2xl glass-card flex items-center justify-center liquid-animation-delayed">
                <Search className="w-6 h-6 text-white" />
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
              const isActive = feature.id === 'search';
              
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - Search Configuration */}
            <div className="space-y-6">
              <div className="glass-card rounded-2xl p-4">
                <h3 className="font-semibold glass-text mb-4 flex items-center">
                  <Settings className="w-5 h-5 mr-2" />
                  Search Configuration
                </h3>
                
                {/* Space Selection */}
                <div className="mb-4">
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
                <div className="mb-4">
                  <label className="block text-sm font-medium glass-text mb-2">
                    Select Pages to Analyze
                  </label>
                  <div className="space-y-2 max-h-40 overflow-y-auto glass-content rounded-xl p-2">
                    {pages.map(page => (
                      <label key={page} className="flex items-center space-x-2 p-2 hover:bg-white/10 rounded-lg cursor-pointer transition-colors">
                        <input
                          type="checkbox"
                          checked={selectedPages.includes(page)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedPages([...selectedPages, page]);
                            } else {
                              setSelectedPages(selectedPages.filter(p => p !== page));
                            }
                          }}
                          className="rounded border-white/30 text-purple-500 focus:ring-white/30 bg-white/10"
                        />
                        <span className="text-sm glass-text">{page}</span>
                      </label>
                    ))}
                  </div>
                  <p className="text-sm glass-text-muted mt-1">
                    {selectedPages.length} page(s) selected
                  </p>
                </div>

                {/* Query Input */}
                <div className="mb-4">
                  <label className="block text-sm font-medium glass-text mb-2">
                    Your Question
                  </label>
                  <textarea
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="What would you like to know about the selected content?"
                    className="w-full p-3 glass-input rounded-xl focus:ring-2 focus:ring-white/30 resize-none"
                    rows={4}
                  />
                </div>

                {/* Search Button */}
                <button
                  onClick={handleSearch}
                  disabled={!selectedSpace || selectedPages.length === 0 || !query.trim() || isLoading}
                  className="w-full glass-button-primary py-3 px-4 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 transition-all duration-300"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Generating AI Response...</span>
                    </>
                  ) : (
                    <>
                      <Search className="w-5 h-5" />
                      <span>Generate AI Response</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Right Column - Results */}
            <div className="space-y-6">
              {response && (
                <div className="glass-card rounded-2xl p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold glass-text">AI Response</h3>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setShowRawContent(!showRawContent)}
                        className="text-sm glass-button px-3 py-1 rounded-lg"
                      >
                        {showRawContent ? 'Show Formatted' : 'Show Raw Content'}
                      </button>
                    </div>
                  </div>
                  
                  <div className="glass-content rounded-xl p-4 max-h-80 overflow-y-auto">
                    {showRawContent ? (
                      <pre className="text-sm glass-text whitespace-pre-wrap">{response}</pre>
                    ) : (
                      <div className="prose prose-sm max-w-none">
                        {response.split('\n').map((line, index) => {
                          if (line.startsWith('## ')) {
                            return <h2 key={index} className="text-lg font-bold glass-text mt-4 mb-2">{line.substring(3)}</h2>;
                          } else if (line.startsWith('- **')) {
                            const match = line.match(/- \*\*(.*?)\*\*: (.*)/);
                            if (match) {
                              return <p key={index} className="mb-2 glass-text"><strong>{match[1]}:</strong> {match[2]}</p>;
                            }
                          } else if (line.startsWith('- ')) {
                            return <p key={index} className="mb-1 ml-4 glass-text">• {line.substring(2)}</p>;
                          } else if (line.trim()) {
                            return <p key={index} className="mb-2 glass-text">{line}</p>;
                          }
                          return <br key={index} />;
                        })}
                      </div>
                    )}
                  </div>

                  {/* Export Options */}
                  <div className="mt-4 space-y-3">
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
                    
                    <div className="flex space-x-2">
                      <button
                        onClick={() => exportResponse(exportFormat)}
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
              )}

              {!response && !isLoading && (
                <div className="glass-card rounded-2xl p-8 text-center">
                  <div className="w-16 h-16 glass-card rounded-2xl flex items-center justify-center mx-auto mb-4 liquid-animation">
                    <FileText className="w-8 h-8 glass-text-muted" />
                  </div>
                  <h3 className="text-lg font-semibold glass-text mb-2">Ready to Search</h3>
                  <p className="glass-text-muted">Configure your search parameters and click "Generate AI Response" to get started.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIPoweredSearch;