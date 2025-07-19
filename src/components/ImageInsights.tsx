import React, { useState } from 'react';
import { Image, Download, Save, X, ChevronDown, Loader2, MessageSquare, BarChart3, Search, Video, Code, TrendingUp, TestTube, Eye, Zap } from 'lucide-react';
import { FeatureType } from '../App';

interface ImageInsightsProps {
  onClose: () => void;
  onFeatureSelect: (feature: FeatureType) => void;
}

interface ImageData {
  id: string;
  name: string;
  url: string;
  summary?: string;
  chart?: string;
  qa?: Array<{ question: string; answer: string }>;
}

const ImageInsights: React.FC<ImageInsightsProps> = ({ onClose, onFeatureSelect }) => {
  const [selectedSpace, setSelectedSpace] = useState('');
  const [selectedPages, setSelectedPages] = useState<string[]>([]);
  const [images, setImages] = useState<ImageData[]>([]);
  const [isLoadingImages, setIsLoadingImages] = useState(false);
  const [analyzingImage, setAnalyzingImage] = useState<string>('');
  const [generatingChart, setGeneratingChart] = useState<string>('');
  const [chartType, setChartType] = useState('bar');
  const [chartFilename, setChartFilename] = useState('');
  const [exportFormat, setExportFormat] = useState('png');
  const [newQuestion, setNewQuestion] = useState('');
  const [selectedImageForQA, setSelectedImageForQA] = useState('');

  const spaces = ['Engineering', 'Product', 'Design', 'Marketing', 'Documentation'];
  const pages = ['Dashboard Screenshots', 'UI Mockups', 'Architecture Diagrams', 'Performance Charts', 'User Analytics'];
  const chartTypes = ['bar', 'line', 'pie', 'scatter', 'area'];
  const exportFormats = ['png', 'pdf', 'docx', 'svg'];

  const features = [
    { id: 'search' as const, label: 'AI Powered Search', icon: Search },
    { id: 'video' as const, label: 'Video Summarizer', icon: Video },
    { id: 'code' as const, label: 'Code Assistant', icon: Code },
    { id: 'impact' as const, label: 'Impact Analyzer', icon: TrendingUp },
    { id: 'test' as const, label: 'Test Support Tool', icon: TestTube },
    { id: 'image' as const, label: 'Image Insights & Chart Builder', icon: Image },
  ];

  const sampleImages: ImageData[] = [
    {
      id: '1',
      name: 'User Dashboard Analytics',
      url: 'https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: '2', 
      name: 'Performance Metrics Chart',
      url: 'https://images.pexels.com/photos/669610/pexels-photo-669610.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: '3',
      name: 'System Architecture Diagram', 
      url: 'https://images.pexels.com/photos/577585/pexels-photo-577585.jpeg?auto=compress&cs=tinysrgb&w=400'
    }
  ];

  const loadImages = async () => {
    if (!selectedSpace || selectedPages.length === 0) return;
    
    setIsLoadingImages(true);
    // Simulate loading images from Confluence
    setTimeout(() => {
      setImages(sampleImages);
      setIsLoadingImages(false);
    }, 2000);
  };

  const analyzeImage = async (imageId: string) => {
    setAnalyzingImage(imageId);
    // Simulate AI analysis
    setTimeout(() => {
      setImages(prev => prev.map(img => 
        img.id === imageId 
          ? { 
              ...img, 
              summary: `AI Analysis: This image shows key performance metrics and data visualizations. The chart displays trends over time with multiple data series. Key insights include growth patterns, seasonal variations, and performance indicators that can inform business decisions.`
            }
          : img
      ));
      setAnalyzingImage('');
    }, 3000);
  };

  const generateChart = async (imageId: string) => {
    setGeneratingChart(imageId);
    // Simulate chart generation
    setTimeout(() => {
      setImages(prev => prev.map(img => 
        img.id === imageId 
          ? { 
              ...img, 
              chart: 'https://images.pexels.com/photos/590020/pexels-photo-590020.jpeg?auto=compress&cs=tinysrgb&w=400'
            }
          : img
      ));
      setGeneratingChart('');
    }, 2500);
  };

  const addQuestion = () => {
    if (!newQuestion.trim() || !selectedImageForQA) return;
    
    const answer = `Based on the AI analysis of this image, here's the response: The image contains data visualization elements that show ${newQuestion.toLowerCase().includes('trend') ? 'upward trends in key metrics with seasonal patterns' : newQuestion.toLowerCase().includes('performance') ? 'strong performance indicators across multiple dimensions' : 'relevant insights that can inform decision-making processes'}.`;

    setImages(prev => prev.map(img => 
      img.id === selectedImageForQA 
        ? { 
            ...img, 
            qa: [...(img.qa || []), { question: newQuestion, answer }]
          }
        : img
    ));
    setNewQuestion('');
    setSelectedImageForQA('');
  };

  const exportChart = (image: ImageData) => {
    const content = `# Image Analysis Report: ${image.name}

## AI Summary
${image.summary || 'No summary available'}

## Generated Chart
Chart exported in ${exportFormat} format

## Q&A
${image.qa?.map(qa => `**Q:** ${qa.question}\n**A:** ${qa.answer}`).join('\n\n') || 'No questions asked'}

---
*Generated by Confluence AI Assistant - Image Insights*`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${chartFilename || image.name.replace(/\s+/g, '_')}.${exportFormat}`;
    a.click();
  };

  return (
    <div className="fixed top-4 right-4 z-40">
      <div className="bg-white border border-gray-200 rounded-lg shadow-lg w-[600px] h-[700px] overflow-hidden">
        {/* Header */}
        <div className="bg-confluence-blue p-4 text-white border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Image className="w-5 h-5" />
              <div>
                <h2 className="text-base font-bold">Image Insights & Chart Builder</h2>
                <p className="text-blue-100 text-sm">Analyze images and create charts from Confluence</p>
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
              const isActive = feature.id === 'image';
              
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
            {/* Left Panel - Controls */}
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <h3 className="font-semibold text-gray-800 mb-4">Select Content</h3>
              
              {/* Space Selection */}
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confluence Space
                </label>
                <div className="relative">
                  <select
                    value={selectedSpace}
                    onChange={(e) => setSelectedSpace(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-confluence-blue focus:border-confluence-blue appearance-none bg-white text-sm"
                  >
                    <option value="">Choose a space...</option>
                    {spaces.map(space => (
                      <option key={space} value={space}>{space}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>
              </div>

              {/* Page Selection */}
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pages with Images
                </label>
                <div className="space-y-1 max-h-24 overflow-y-auto border border-gray-300 rounded p-2 bg-white">
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
                <p className="text-xs text-gray-500 mt-1">
                  {selectedPages.length} page(s) selected
                </p>
              </div>

              {/* Load Images Button */}
              <button
                onClick={loadImages}
                disabled={!selectedSpace || selectedPages.length === 0 || isLoadingImages}
                className="w-full bg-confluence-blue text-white py-2 px-4 rounded hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center space-x-2 transition-colors text-sm"
              >
                {isLoadingImages ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Loading Images...</span>
                  </>
                ) : (
                  <>
                    <Image className="w-4 h-4" />
                    <span>Load Images</span>
                  </>
                )}
              </button>
            </div>

            {/* Center Panel - Image Grid */}
            {images.length > 0 && (
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <h3 className="font-semibold text-gray-800 mb-4">Discovered Images</h3>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {images.map(image => (
                    <div key={image.id} className="border border-gray-200 rounded-lg overflow-hidden">
                      {/* Image Card */}
                      <div className="p-3">
                        <div className="flex space-x-3">
                          <img
                            src={image.url}
                            alt={image.name}
                            className="w-20 h-16 object-cover rounded"
                          />
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-800 text-sm">{image.name}</h4>
                            <div className="flex space-x-2 mt-2">
                              <button
                                onClick={() => analyzeImage(image.id)}
                                disabled={analyzingImage === image.id}
                                className="px-2 py-1 bg-confluence-blue text-white rounded text-xs hover:bg-blue-600 disabled:bg-gray-300 transition-colors flex items-center space-x-1"
                              >
                                {analyzingImage === image.id ? (
                                  <>
                                    <Loader2 className="w-3 h-3 animate-spin" />
                                    <span>Analyzing...</span>
                                  </>
                                ) : (
                                  <>
                                    <Eye className="w-3 h-3" />
                                    <span>Analyze</span>
                                  </>
                                )}
                              </button>
                              {image.summary && (
                                <button
                                  onClick={() => generateChart(image.id)}
                                  disabled={generatingChart === image.id}
                                  className="px-2 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700 disabled:bg-gray-300 transition-colors flex items-center space-x-1"
                                >
                                  {generatingChart === image.id ? (
                                    <>
                                      <Loader2 className="w-3 h-3 animate-spin" />
                                      <span>Generating...</span>
                                    </>
                                  ) : (
                                    <>
                                      <BarChart3 className="w-3 h-3" />
                                      <span>Chart</span>
                                    </>
                                  )}
                                </button>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* AI Summary */}
                        {image.summary && (
                          <div className="mt-3 bg-gray-50 rounded p-2">
                            <h5 className="text-xs font-semibold text-gray-800 mb-1">AI Summary</h5>
                            <p className="text-xs text-gray-700">{image.summary}</p>
                          </div>
                        )}

                        {/* Generated Chart */}
                        {image.chart && (
                          <div className="mt-3 bg-gray-50 rounded p-2">
                            <h5 className="text-xs font-semibold text-gray-800 mb-2">Generated Chart</h5>
                            <img
                              src={image.chart}
                              alt="Generated Chart"
                              className="w-full h-24 object-cover rounded mb-2"
                            />
                            <div className="space-y-2">
                              <div className="grid grid-cols-2 gap-2">
                                <select
                                  value={chartType}
                                  onChange={(e) => setChartType(e.target.value)}
                                  className="px-2 py-1 border border-gray-300 rounded text-xs focus:ring-2 focus:ring-confluence-blue bg-white"
                                >
                                  {chartTypes.map(type => (
                                    <option key={type} value={type}>
                                      {type.charAt(0).toUpperCase() + type.slice(1)}
                                    </option>
                                  ))}
                                </select>
                                <select
                                  value={exportFormat}
                                  onChange={(e) => setExportFormat(e.target.value)}
                                  className="px-2 py-1 border border-gray-300 rounded text-xs focus:ring-2 focus:ring-confluence-blue bg-white"
                                >
                                  {exportFormats.map(format => (
                                    <option key={format} value={format}>
                                      {format.toUpperCase()}
                                    </option>
                                  ))}
                                </select>
                              </div>
                              <input
                                type="text"
                                value={chartFilename}
                                onChange={(e) => setChartFilename(e.target.value)}
                                placeholder="Chart filename..."
                                className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:ring-2 focus:ring-confluence-blue bg-white"
                              />
                              <button
                                onClick={() => exportChart(image)}
                                className="w-full px-2 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700 transition-colors flex items-center justify-center space-x-1"
                              >
                                <Download className="w-3 h-3" />
                                <span>Export Chart</span>
                              </button>
                            </div>
                          </div>
                        )}

                        {/* Q&A Section */}
                        {image.summary && (
                          <div className="mt-3 bg-gray-50 rounded p-2">
                            <h5 className="text-xs font-semibold text-gray-800 mb-2">Questions & Answers</h5>
                            
                            {/* Existing Q&A */}
                            {image.qa && image.qa.length > 0 && (
                              <div className="space-y-1 mb-2 max-h-20 overflow-y-auto">
                                {image.qa.map((qa, index) => (
                                  <div key={index} className="bg-white rounded p-1">
                                    <p className="font-medium text-gray-800 text-xs">Q: {qa.question}</p>
                                    <p className="text-gray-700 text-xs">A: {qa.answer.substring(0, 80)}...</p>
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* Add Question */}
                            <div className="space-y-1">
                              <input
                                type="text"
                                value={newQuestion}
                                onChange={(e) => setNewQuestion(e.target.value)}
                                placeholder="Ask about this image..."
                                className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:ring-2 focus:ring-confluence-blue bg-white"
                                onKeyPress={(e) => e.key === 'Enter' && addQuestion()}
                              />
                              <button
                                onClick={() => {
                                  setSelectedImageForQA(image.id);
                                  addQuestion();
                                }}
                                disabled={!newQuestion.trim()}
                                className="w-full px-2 py-1 bg-confluence-blue text-white rounded text-xs hover:bg-blue-600 disabled:bg-gray-300 transition-colors flex items-center justify-center space-x-1"
                              >
                                <MessageSquare className="w-3 h-3" />
                                <span>Ask Question</span>
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Empty State */}
            {images.length === 0 && !isLoadingImages && (
              <div className="text-center py-12">
                <Image className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <h3 className="text-base font-semibold text-gray-600 mb-2">No Images Loaded</h3>
                <p className="text-sm text-gray-500">Select a space and pages to discover images for AI analysis.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageInsights;