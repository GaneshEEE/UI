import React, { useState, useRef } from 'react';
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
  qa?: { question: string; answer: string }[];
}

interface ChartData {
  type: 'bar' | 'line' | 'pie' | 'scatter';
  data: any;
  title: string;
}

const ImageInsights: React.FC<ImageInsightsProps> = ({ onClose, onFeatureSelect }) => {
  const [spaceKey, setSpaceKey] = useState('');
  const [selectedPages, setSelectedPages] = useState<string[]>([]);
  const [images, setImages] = useState<ImageData[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState<string>('');
  const [newQuestion, setNewQuestion] = useState('');
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [fileName, setFileName] = useState('');
  const [exportFormat, setExportFormat] = useState('png');
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [selectedChartType, setSelectedChartType] = useState<'bar' | 'line' | 'pie' | 'scatter'>('bar');
  const [chartFileName, setChartFileName] = useState('');
  const [chartExportFormat, setChartExportFormat] = useState('png');
  
  const chartPreviewRef = useRef<HTMLDivElement>(null);

  const spaces = ['ENG', 'PROD', 'DESIGN', 'MKT', 'DOC'];
  const pages = ['Dashboard Analytics', 'User Flow Diagrams', 'Performance Charts', 'Architecture Diagrams', 'Process Flowcharts'];
  const chartTypes = [
    { value: 'bar' as const, label: 'Bar Chart' },
    { value: 'line' as const, label: 'Line Chart' },
    { value: 'pie' as const, label: 'Pie Chart' },
    { value: 'scatter' as const, label: 'Scatter Plot' }
  ];

  const features = [
    { id: 'search' as const, label: 'AI Powered Search', icon: Search },
    { id: 'video' as const, label: 'Video Summarizer', icon: Video },
    { id: 'code' as const, label: 'Code Assistant', icon: Code },
    { id: 'impact' as const, label: 'Impact Analyzer', icon: TrendingUp },
    { id: 'test' as const, label: 'Test Support Tool', icon: TestTube },
    { id: 'image' as const, label: 'Image Insights & Chart Builder', icon: Image },
  ];

  const sampleImages = [
    { id: '1', name: 'Sales Dashboard Q4', url: 'https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg?auto=compress&cs=tinysrgb&w=400' },
    { id: '2', name: 'User Journey Map', url: 'https://images.pexels.com/photos/669610/pexels-photo-669610.jpeg?auto=compress&cs=tinysrgb&w=400' },
    { id: '3', name: 'Performance Metrics', url: 'https://images.pexels.com/photos/265087/pexels-photo-265087.jpeg?auto=compress&cs=tinysrgb&w=400' }
  ];

  const loadImages = () => {
    if (!spaceKey || selectedPages.length === 0) return;
    setImages(sampleImages.map(img => ({ ...img, qa: [] })));
  };

  const analyzeImage = async (imageId: string) => {
    setIsAnalyzing(imageId);
    
    setTimeout(() => {
      setImages(prev => prev.map(img => 
        img.id === imageId 
          ? { 
              ...img, 
              summary: `AI Analysis of ${img.name}: This image contains data visualization elements including charts, graphs, and key performance indicators. The visual elements suggest business metrics tracking with trend analysis and comparative data points. Key insights include performance trends, data correlations, and actionable business intelligence derived from the visual representation.`
            }
          : img
      ));
      setIsAnalyzing('');
    }, 2000);
  };

  const addQuestion = () => {
    if (!newQuestion.trim() || !selectedImage) return;
    
    const answer = `Based on the AI analysis of this image, here's the response to your question: "${newQuestion}"

The image analysis reveals specific data patterns and visual elements that directly relate to your inquiry. The AI has processed the visual content and extracted relevant insights to provide this contextual response.`;

    setImages(prev => prev.map(img => 
      img.id === selectedImage 
        ? { 
            ...img, 
            qa: [...(img.qa || []), { question: newQuestion, answer }]
          } 
        : img
    ));
    setNewQuestion('');
  };

  const createChart = (imageId: string) => {
    const sampleData = {
      bar: {
        labels: ['Q1', 'Q2', 'Q3', 'Q4'],
        datasets: [{
          label: 'Revenue',
          data: [65, 78, 90, 81],
          backgroundColor: 'rgba(38, 132, 255, 0.8)'
        }]
      },
      line: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
        datasets: [{
          label: 'Growth',
          data: [12, 19, 15, 25, 22],
          borderColor: 'rgba(38, 132, 255, 1)',
          fill: false
        }]
      },
      pie: {
        labels: ['Desktop', 'Mobile', 'Tablet'],
        datasets: [{
          data: [55, 35, 10],
          backgroundColor: ['#0052CC', '#2684FF', '#B3D4FF']
        }]
      },
      scatter: {
        datasets: [{
          label: 'Performance',
          data: [{x: 10, y: 20}, {x: 15, y: 25}, {x: 20, y: 30}],
          backgroundColor: 'rgba(38, 132, 255, 0.8)'
        }]
      }
    };

    setChartData({
      type: selectedChartType,
      data: sampleData[selectedChartType],
      title: `Generated ${selectedChartType.charAt(0).toUpperCase() + selectedChartType.slice(1)} Chart`
    });

    // Scroll to chart preview after creation
    setTimeout(() => {
      chartPreviewRef.current?.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
      });
    }, 100);
  };

  const exportImage = (image: ImageData) => {
    const content = `# Image Analysis Report: ${image.name}

## AI Summary
${image.summary || 'No summary available'}

## Questions & Answers
${image.qa?.map(qa => `**Q:** ${qa.question}\n**A:** ${qa.answer}`).join('\n\n') || 'No questions asked'}

## Image Details
- **Name**: ${image.name}
- **Analysis Date**: ${new Date().toLocaleString()}
- **Export Format**: ${exportFormat}

---
*Generated by Confluence AI Assistant - Image Insights*`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${fileName || image.name.replace(/\s+/g, '_')}_analysis.${exportFormat}`;
    a.click();
  };

  const exportChart = () => {
    if (!chartData) return;
    
    const content = `# Chart Export: ${chartData.title}

## Chart Type
${chartData.type.charAt(0).toUpperCase() + chartData.type.slice(1)} Chart

## Data
${JSON.stringify(chartData.data, null, 2)}

## Export Details
- **File Name**: ${chartFileName}
- **Format**: ${chartExportFormat}
- **Generated**: ${new Date().toLocaleString()}

---
*Generated by Confluence AI Assistant - Chart Builder*`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${chartFileName || 'chart'}.${chartExportFormat}`;
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
                <p className="text-blue-100 text-sm">Analyze images and create charts</p>
              </div>
            </div>
            <button onClick={onClose} className="text-white hover:bg-white/10 rounded p-1.5">
              <X className="w-4 h-4" />
            </button>
          </div>
          
          {/* Feature Navigation with Custom Scrollbar */}
          <div className="mt-3 overflow-x-auto">
            <div className="flex gap-1 min-w-max">
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
        </div>

        <div className="p-4 overflow-y-auto h-[calc(700px-120px)]">
          <div className="space-y-4">
            {/* Left Column - Image Selection */}
            <div>
              <div className="bg-white rounded-lg p-4 space-y-3 border border-gray-200">
                <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
                  <Eye className="w-4 h-4 mr-2" />
                  Image Selection
                </h3>
                
                {/* Space Key Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confluence Space Key
                  </label>
                  <div className="relative">
                    <select
                      value={spaceKey}
                      onChange={(e) => setSpaceKey(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-confluence-blue focus:border-confluence-blue appearance-none bg-white"
                    >
                      <option value="">Select space...</option>
                      {spaces.map(space => (
                        <option key={space} value={space}>{space}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                {/* Page Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Pages
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

                {/* Load Images Button */}
                <button
                  onClick={loadImages}
                  disabled={!spaceKey || selectedPages.length === 0}
                  className="w-full bg-confluence-blue text-white py-2 px-4 rounded hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center space-x-2 transition-colors"
                >
                  <Image className="w-5 h-5" />
                  <span>Load Images</span>
                </button>
              </div>
            </div>

            {/* Middle Column - Images Grid */}
              {images.length > 0 ? (
                <div className="grid grid-cols-1 gap-3">
                  {images.map(image => (
                    <div key={image.id} className="bg-white rounded-lg p-3 border border-gray-200">
                      <div className="aspect-video bg-gray-200 rounded mb-3 overflow-hidden">
                        <img 
                          src={image.url} 
                          alt={image.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      <h4 className="font-medium text-gray-800 mb-2 text-sm">{image.name}</h4>
                      
                      <div className="space-y-2">
                        <button
                          onClick={() => analyzeImage(image.id)}
                          disabled={isAnalyzing === image.id}
                          className="w-full bg-confluence-blue text-white py-2 px-3 rounded hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center space-x-2 transition-colors text-sm"
                        >
                          {isAnalyzing === image.id ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              <span>Analyzing...</span>
                            </>
                          ) : (
                            <>
                              <Eye className="w-4 h-4" />
                              <span>Summarize</span>
                            </>
                          )}
                        </button>

                        {image.summary && (
                          <button
                            onClick={() => createChart(image.id)}
                            className="w-full bg-green-600 text-white py-2 px-3 rounded hover:bg-green-700 transition-colors flex items-center justify-center space-x-2 text-sm"
                          >
                            <BarChart3 className="w-4 h-4" />
                            <span>Create Graph</span>
                          </button>
                        )}
                      </div>

                      {image.summary && (
                        <div className="mt-3 p-2 bg-gray-50 rounded">
                          <p className="text-xs text-gray-700">{image.summary.substring(0, 150)}...</p>
                        </div>
                      )}

                      {image.qa && image.qa.length > 0 && (
                        <div className="mt-3 space-y-1">
                          {image.qa.map((qa, index) => (
                            <div key={index} className="p-2 bg-gray-50 rounded">
                              <p className="font-medium text-gray-800 text-xs mb-1">Q: {qa.question}</p>
                              <p className="text-gray-700 text-xs">{qa.answer.substring(0, 80)}...</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Image className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <h3 className="text-base font-semibold text-gray-600 mb-2">No Images Loaded</h3>
                  <p className="text-sm text-gray-500">Select a space and pages to load embedded images for analysis.</p>
                </div>
              )}

              {/* Chart Preview Section */}
              {chartData && (
                <div ref={chartPreviewRef} className="bg-white rounded-lg p-4 border border-gray-200">
                  <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Chart Builder
                  </h3>
                  
                  <div className="space-y-4">
                    {/* Chart Controls - Left Side */}
                    <div>
                      <div className="bg-gray-50 rounded p-3">
                        <h4 className="font-semibold text-gray-800 mb-3">Chart Settings</h4>
                        
                        <div className="space-y-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Chart Type
                            </label>
                            <div className="relative">
                              <select
                                value={selectedChartType}
                                onChange={(e) => {
                                  setSelectedChartType(e.target.value as any);
                                  // Update chart data when type changes
                                  const sampleData = {
                                    bar: {
                                      labels: ['Q1', 'Q2', 'Q3', 'Q4'],
                                      datasets: [{
                                        label: 'Revenue',
                                        data: [65, 78, 90, 81],
                                        backgroundColor: 'rgba(38, 132, 255, 0.8)'
                                      }]
                                    },
                                    line: {
                                      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
                                      datasets: [{
                                        label: 'Growth',
                                        data: [12, 19, 15, 25, 22],
                                        borderColor: 'rgba(38, 132, 255, 1)',
                                        fill: false
                                      }]
                                    },
                                    pie: {
                                      labels: ['Desktop', 'Mobile', 'Tablet'],
                                      datasets: [{
                                        data: [55, 35, 10],
                                        backgroundColor: ['#0052CC', '#2684FF', '#B3D4FF']
                                      }]
                                    },
                                    scatter: {
                                      datasets: [{
                                        label: 'Performance',
                                        data: [{x: 10, y: 20}, {x: 15, y: 25}, {x: 20, y: 30}],
                                        backgroundColor: 'rgba(38, 132, 255, 0.8)'
                                      }]
                                    }
                                  };
                                  setChartData({
                                    type: e.target.value as any,
                                    data: sampleData[e.target.value as keyof typeof sampleData],
                                    title: `Generated ${e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1)} Chart`
                                  });
                                }}
                                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-confluence-blue focus:border-confluence-blue appearance-none bg-white"
                              >
                                {chartTypes.map(type => (
                                  <option key={type.value} value={type.value}>{type.label}</option>
                                ))}
                              </select>
                              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Chart File Name
                            </label>
                            <input
                              type="text"
                              value={chartFileName}
                              onChange={(e) => setChartFileName(e.target.value)}
                              placeholder="my-chart"
                              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-confluence-blue focus:border-confluence-blue bg-white"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Export Format
                            </label>
                            <div className="relative">
                              <select
                                value={chartExportFormat}
                                onChange={(e) => setChartExportFormat(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-confluence-blue focus:border-confluence-blue appearance-none bg-white"
                              >
                                <option value="png">PNG</option>
                                <option value="pdf">PDF</option>
                                <option value="docx">Word Document</option>
                                <option value="pptx">PowerPoint</option>
                              </select>
                              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                            </div>
                          </div>

                          <div className="space-y-2 pt-2">
                            <button
                              onClick={exportChart}
                              className="w-full flex items-center justify-center space-x-2 px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                            >
                              <Download className="w-4 h-4" />
                              <span>Export Chart</span>
                            </button>
                            <button
                              onClick={() => alert('Chart saved to Confluence!')}
                              className="w-full flex items-center justify-center space-x-2 px-3 py-2 bg-confluence-blue text-white rounded hover:bg-blue-600 transition-colors"
                            >
                              <Save className="w-4 h-4" />
                              <span>Save to Confluence</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Chart Preview - Right Side */}
                    <div>
                      <div className="bg-gray-50 rounded p-4">
                        <h4 className="font-semibold text-gray-800 mb-4">{chartData.title}</h4>
                        <div className="w-full h-60 bg-blue-50 rounded flex items-center justify-center">
                          <div className="text-center">
                            <BarChart3 className="w-16 h-16 text-confluence-blue mx-auto mb-3" />
                            <p className="text-gray-600 font-medium text-lg">{chartData.title}</p>
                            <p className="text-gray-500 text-sm mt-2">Live {chartData.type} chart preview</p>
                            <div className="mt-4 text-xs text-gray-400 max-w-md mx-auto">
                              Chart updates automatically when you change the type in the controls panel
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

            {/* Right Column - Q&A and Export */}
              <div className="bg-white rounded-lg p-4 space-y-3 border border-gray-200">
                <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Image Q&A
                </h3>
                
                {/* Image Selection for Q&A */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Image for Questions
                  </label>
                  <div className="relative">
                    <select
                      value={selectedImage}
                      onChange={(e) => setSelectedImage(e.target.value)}
                      className="w-full p-3 border border-white/30 rounded-lg focus:ring-2 focus:ring-confluence-blue focus:border-confluence-blue appearance-none bg-white/70 backdrop-blur-sm"
                    >
                      <option value="">Choose image...</option>
                      {images.filter(img => img.summary).map(image => (
                        <option key={image.id} value={image.id}>{image.name}</option>
                      ))}
                    </select>
                          className="w-full flex items-center justify-center space-x-2 px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                  </div>
                </div>

                {/* Add Question */}
                <div className="space-y-2">
                  <textarea
                    value={newQuestion}
                    onChange={(e) => setNewQuestion(e.target.value)}
                    placeholder="Ask about the selected image..."
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-confluence-blue focus:border-confluence-blue resize-none bg-white"
                    rows={3}
                  />
                  <button
                    onClick={addQuestion}
                    disabled={!newQuestion.trim() || !selectedImage}
                    className="w-full px-3 py-2 bg-confluence-blue text-white rounded hover:bg-blue-600 disabled:bg-gray-300 transition-colors flex items-center justify-center space-x-2"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Ask Question</span>
                  </button>
                </div>

                {/* Export Options */}
                <div className="pt-3 border-t border-gray-200 space-y-2">
                  <h4 className="font-semibold text-gray-800">Export Image Analysis</h4>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      File Name
                    </label>
                    <input
                      type="text"
                      value={fileName}
                      onChange={(e) => setFileName(e.target.value)}
                      placeholder="image-analysis"
                      className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-confluence-blue focus:border-confluence-blue bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Export Format
                    </label>
                    <div className="relative">
                      <select
                        value={exportFormat}
                        onChange={(e) => setExportFormat(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-confluence-blue focus:border-confluence-blue appearance-none bg-white"
                      >
                        <option value="png">PNG</option>
                        <option value="pdf">PDF</option>
                        <option value="docx">Word Document</option>
                        <option value="txt">Plain Text</option>
                      </select>
                      <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-confluence-blue focus:border-confluence-blue appearance-none bg-white"

                  <div className="space-y-2">
                    {images.filter(img => img.summary).map(image => (
                      <button
                        key={image.id}
                        onClick={() => exportImage(image)}
                        className="w-full flex items-center justify-center space-x-2 px-3 py-2 bg-green-600/90 backdrop-blur-sm text-white rounded-lg hover:bg-green-700 transition-colors border border-white/10"
                      >
                        <Download className="w-4 h-4" />
                        <span>Export {image.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageInsights;