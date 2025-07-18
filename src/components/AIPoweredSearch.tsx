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
    <div className="fixed top-4 right-4 z-40">
      <div className="bg-white border border-gray-200 rounded-lg shadow-lg w-[500px] h-[700px] overflow-hidden">
        {/* Header */}
        <div className="bg-confluence-blue p-4 text-white border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Search className="w-5 h-5" />
              <div>
                <h2 className="text-base font-bold">AI Powered Search</h2>
                <p className="text-blue-100 text-sm">Search and analyze Confluence content</p>
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
              const isActive = feature.id === 'search';
              
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
          <div className="space-y-4">
            {/* Left Column - Search Configuration */}
            <div>
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
                  <Settings className="w-4 h-4 mr-2" />
                  Search Configuration
                </h3>
                
                {/* Space Selection */}
                <div className="mb-4">
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
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Pages to Analyze
                  </label>
                  <div className="space-y-1 max-h-32 overflow-y-auto border border-gray-300 rounded p-2 bg-white">
                    {pages.map(page => (
                      <label key={page} className="flex items-center space-x-2 p-1 hover:bg-gray-50 rounded cursor-pointer">
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
                          className="rounded border-gray-300 text-confluence-blue focus:ring-confluence-blue"
                        />
                        <span className="text-xs text-gray-700">{page}</span>
                      </label>
                    ))}
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    {selectedPages.length} page(s) selected
                  </p>
                </div>

                {/* Query Input */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Question
                  </label>
                  <textarea
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="What would you like to know about the selected content?"
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-confluence-blue focus:border-confluence-blue resize-none bg-white"
                    rows={4}
                  />
                </div>

                {/* Search Button */}
                <button
                  onClick={handleSearch}
                  disabled={!selectedSpace || selectedPages.length === 0 || !query.trim() || isLoading}
                  className="w-full bg-confluence-blue text-white py-2 px-4 rounded hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center space-x-2 transition-colors"
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
              {response && (
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-800">AI Response</h3>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setShowRawContent(!showRawContent)}
                        className="text-sm text-confluence-blue hover:underline"
                      >
                        {showRawContent ? 'Show Formatted' : 'Show Raw Content'}
                      </button>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded p-3 max-h-60 overflow-y-auto">
                    {showRawContent ? (
                      <pre className="text-sm text-gray-700 whitespace-pre-wrap">{response}</pre>
                    ) : (
                      <div className="prose prose-sm max-w-none">
                        {response.split('\n').map((line, index) => {
                          if (line.startsWith('## ')) {
                            return <h2 key={index} className="text-lg font-bold text-gray-800 mt-4 mb-2">{line.substring(3)}</h2>;
                          } else if (line.startsWith('- **')) {
                            const match = line.match(/- \*\*(.*?)\*\*: (.*)/);
                            if (match) {
                              return <p key={index} className="mb-2"><strong>{match[1]}:</strong> {match[2]}</p>;
                            }
                          } else if (line.startsWith('- ')) {
                            return <p key={index} className="mb-1 ml-4">• {line.substring(2)}</p>;
                          } else if (line.trim()) {
                            return <p key={index} className="mb-2 text-gray-700">{line}</p>;
                          }
                          return <br key={index} />;
                        })}
                      </div>
                    )}
                  </div>

                  {/* Export Options */}
                  <div className="mt-4 space-y-3">
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
                    
                    <div className="flex space-x-2">
                      <button
                        onClick={() => exportResponse(exportFormat)}
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
              )}

              {!response && !isLoading && (
                <div className="bg-white rounded-lg p-6 text-center border border-gray-200">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <h3 className="text-base font-semibold text-gray-600 mb-2">Ready to Search</h3>
                  <p className="text-gray-500">Configure your search parameters and click "Generate AI Response" to get started.</p>
                </div>
              )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIPoweredSearch;