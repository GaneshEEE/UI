import React, { useState } from 'react';
import { Search, Download, Save, FileText, X, ChevronDown, Loader2, Settings, Video, Code, TrendingUp, TestTube, Image } from 'lucide-react';
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
    { id: 'image' as const, label: 'Image Insights & Chart Builder', icon: Image },
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
    <div className="fixed inset-0 flex z-40">
      <div className="bg-[#1e1e1e] border-r border-[#3c3c3c] w-full max-w-4xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-[#2d2d30] border-b border-[#3c3c3c] p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Search className="w-6 h-6 text-[#007acc]" />
              <div>
                <h2 className="text-[#cccccc] text-lg font-medium">AI Powered Search</h2>
                <p className="text-[#9d9d9d] text-sm">Search and analyze Confluence content with AI</p>
              </div>
            </div>
            <button onClick={onClose} className="text-[#cccccc] hover:text-white hover:bg-[#3c3c3c] rounded p-1">
              <X className="w-5 h-5" />
            </button>
          </div>
          
          {/* Feature Navigation */}
          <div className="mt-4 flex gap-1 overflow-x-auto">
            {features.map((feature) => {
              const Icon = feature.icon;
              const isActive = feature.id === 'search';
              
              return (
                <button
                  key={feature.id}
                  onClick={() => onFeatureSelect(feature.id)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded text-sm transition-colors whitespace-nowrap ${
                    isActive
                      ? 'bg-[#0e639c] text-white'
                      : 'text-[#9d9d9d] hover:text-[#cccccc] hover:bg-[#3c3c3c]'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{feature.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Left Column - Search Configuration */}
            <div className="space-y-4">
              <div className="bg-[#252526] border border-[#3c3c3c] rounded-lg p-4">
                <h3 className="text-[#cccccc] font-medium mb-4 flex items-center">
                  <Settings className="w-4 h-4 mr-2" />
                  Search Configuration
                </h3>
                
                {/* Space Selection */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-[#cccccc] mb-2">
                    Select Confluence Space
                  </label>
                  <div className="relative">
                    <select
                      value={selectedSpace}
                      onChange={(e) => setSelectedSpace(e.target.value)}
                      className="w-full p-3 bg-[#1e1e1e] border border-[#3c3c3c] rounded text-[#cccccc] focus:border-[#007acc] focus:outline-none appearance-none"
                    >
                      <option value="">Choose a space...</option>
                      {spaces.map(space => (
                        <option key={space} value={space}>{space}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#9d9d9d] pointer-events-none" />
                  </div>
                </div>

                {/* Page Selection */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-[#cccccc] mb-2">
                    Select Pages to Analyze
                  </label>
                  <div className="space-y-2 max-h-32 overflow-y-auto border border-[#3c3c3c] rounded p-2 bg-[#1e1e1e]">
                    {pages.map(page => (
                      <label key={page} className="flex items-center space-x-2 p-2 hover:bg-[#3c3c3c] rounded cursor-pointer text-sm">
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
                          className="rounded border-[#3c3c3c] text-[#007acc] focus:ring-[#007acc] bg-[#1e1e1e]"
                        />
                        <span className="text-[#cccccc]">{page}</span>
                      </label>
                    ))}
                  </div>
                  <p className="text-sm text-[#9d9d9d] mt-1">
                    {selectedPages.length} page(s) selected
                  </p>
                </div>

                {/* Query Input */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-[#cccccc] mb-2">
                    Your Question
                  </label>
                  <textarea
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="What would you like to know about the selected content?"
                    className="w-full p-3 bg-[#1e1e1e] border border-[#3c3c3c] rounded text-[#cccccc] placeholder-[#9d9d9d] focus:border-[#007acc] focus:outline-none resize-none"
                    rows={4}
                  />
                </div>

                {/* Search Button */}
                <button
                  onClick={handleSearch}
                  disabled={!selectedSpace || selectedPages.length === 0 || !query.trim() || isLoading}
                  className="w-full bg-[#0e639c] hover:bg-[#1177bb] disabled:bg-[#3c3c3c] disabled:text-[#9d9d9d] text-white py-3 px-4 rounded font-medium transition-colors flex items-center justify-center space-x-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Generating AI Response...</span>
                    </>
                  ) : (
                    <>
                      <Search className="w-4 h-4" />
                      <span>Generate AI Response</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Right Column - Results */}
            <div className="space-y-4">
              {response && (
                <div className="bg-[#252526] border border-[#3c3c3c] rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-[#cccccc] font-medium">AI Response</h3>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setShowRawContent(!showRawContent)}
                        className="text-sm text-[#007acc] hover:text-[#1177bb]"
                      >
                        {showRawContent ? 'Show Formatted' : 'Show Raw Content'}
                      </button>
                    </div>
                  </div>
                  
                  <div className="bg-[#1e1e1e] border border-[#3c3c3c] rounded p-4 max-h-80 overflow-y-auto">
                    {showRawContent ? (
                      <pre className="text-sm text-[#cccccc] whitespace-pre-wrap">{response}</pre>
                    ) : (
                      <div className="prose prose-sm max-w-none">
                        {response.split('\n').map((line, index) => {
                          if (line.startsWith('## ')) {
                            return <h2 key={index} className="text-base font-medium text-[#cccccc] mt-4 mb-2">{line.substring(3)}</h2>;
                          } else if (line.startsWith('- **')) {
                            const match = line.match(/- \*\*(.*?)\*\*: (.*)/);
                            if (match) {
                              return <p key={index} className="mb-2 text-[#cccccc]"><span className="text-[#007acc] font-medium">{match[1]}:</span> {match[2]}</p>;
                            }
                          } else if (line.startsWith('- ')) {
                            return <p key={index} className="mb-1 ml-4 text-[#cccccc]">• {line.substring(2)}</p>;
                          } else if (line.trim()) {
                            return <p key={index} className="mb-2 text-[#cccccc] text-sm">{line}</p>;
                          }
                          return <br key={index} />;
                        })}
                      </div>
                    )}
                  </div>

                  {/* Export Options */}
                  <div className="mt-4 space-y-3">
                    <div className="flex items-center space-x-2">
                      <label className="text-sm font-medium text-[#cccccc]">Export Format:</label>
                      <select
                        value={exportFormat}
                        onChange={(e) => setExportFormat(e.target.value)}
                        className="px-3 py-1 bg-[#1e1e1e] border border-[#3c3c3c] rounded text-sm text-[#cccccc] focus:border-[#007acc] focus:outline-none"
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
                        className="flex items-center space-x-2 px-3 py-2 bg-[#0e639c] hover:bg-[#1177bb] text-white rounded text-sm transition-colors"
                      >
                        <Download className="w-4 h-4" />
                        <span>Export</span>
                      </button>
                      <button
                        onClick={() => alert('Saved to Confluence!')}
                        className="flex items-center space-x-2 px-3 py-2 bg-[#0e639c] hover:bg-[#1177bb] text-white rounded text-sm transition-colors"
                      >
                        <Save className="w-4 h-4" />
                        <span>Save to Confluence</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {!response && !isLoading && (
                <div className="bg-[#252526] border border-[#3c3c3c] rounded-lg p-8 text-center">
                  <FileText className="w-12 h-12 text-[#9d9d9d] mx-auto mb-4" />
                  <h3 className="text-base font-medium text-[#cccccc] mb-2">Ready to Search</h3>
                  <p className="text-[#9d9d9d] text-sm">Configure your search parameters and click "Generate AI Response" to get started.</p>
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