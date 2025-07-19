import React, { useState } from 'react';
import { X, Image, Upload, Eye, Zap, BarChart3, Search, Video, Code, TrendingUp, TestTube } from 'lucide-react';

interface ImageInsightsProps {
  onClose: () => void;
  onFeatureSelect: (feature: any) => void;
}

const ImageInsights: React.FC<ImageInsightsProps> = ({ onClose, onFeatureSelect }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [insights, setInsights] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const features = [
    { id: 'search' as const, label: 'AI Powered Search', icon: Search },
    { id: 'video' as const, label: 'Video Summarizer', icon: Video },
    { id: 'code' as const, label: 'Code Assistant', icon: Code },
    { id: 'impact' as const, label: 'Impact Analyzer', icon: TrendingUp },
    { id: 'test' as const, label: 'Test Support Tool', icon: TestTube },
    { id: 'image' as const, label: 'Image Insights & Chart Builder', icon: Image },
  ];

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeImage = () => {
    if (!selectedImage) return;
    
    setIsAnalyzing(true);
    // Simulate analysis
    setTimeout(() => {
      setInsights({
        objects: ['Person', 'Car', 'Building', 'Tree'],
        colors: ['Blue', 'Green', 'Gray', 'Brown'],
        mood: 'Professional',
        quality: 'High',
        resolution: '1920x1080',
        fileSize: '2.4 MB'
      });
      setIsAnalyzing(false);
    }, 2000);
  };

  return (
    <div className="fixed top-4 right-4 z-40">
      <div className="bg-white border border-gray-200 shadow-lg w-[500px] h-[700px] overflow-hidden">
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

        {/* Content */}
        <div className="p-4 overflow-y-auto h-[calc(700px-120px)]">
          {/* Upload Section */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload Image
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded p-6 text-center hover:border-blue-400 transition-colors">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
              />
              <label htmlFor="image-upload" className="cursor-pointer">
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Click to upload an image</p>
                <p className="text-xs text-gray-400 mt-1">PNG, JPG, GIF up to 10MB</p>
              </label>
            </div>
          </div>

          {/* Image Preview */}
          {selectedImage && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preview
              </label>
              <div className="border border-gray-200 rounded overflow-hidden">
                <img
                  src={selectedImage}
                  alt="Preview"
                  className="w-full h-48 object-cover"
                />
              </div>
              <button
                onClick={analyzeImage}
                disabled={isAnalyzing}
                className="w-full mt-3 px-4 py-2 bg-confluence-blue text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
              >
                {isAnalyzing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4" />
                    <span>Analyze Image</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* Insights Results */}
          {insights && (
            <div className="space-y-4">
              <div className="flex items-center space-x-2 mb-3">
                <BarChart3 className="w-4 h-4 text-green-600" />
                <h3 className="text-base font-semibold text-gray-900">Analysis Results</h3>
              </div>

              <div className="grid grid-cols-1 gap-3">
                <div className="bg-gray-50 p-3 rounded">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Detected Objects</h4>
                  <div className="flex flex-wrap gap-2">
                    {insights.objects.map((object: string, index: number) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                      >
                        {object}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="bg-gray-50 p-3 rounded">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Dominant Colors</h4>
                  <div className="flex flex-wrap gap-2">
                    {insights.colors.map((color: string, index: number) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full"
                      >
                        {color}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-50 p-3 rounded">
                    <h4 className="text-sm font-medium text-gray-700 mb-1">Mood</h4>
                    <p className="text-sm text-gray-900">{insights.mood}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded">
                    <h4 className="text-sm font-medium text-gray-700 mb-1">Quality</h4>
                    <p className="text-sm text-gray-900">{insights.quality}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-50 p-3 rounded">
                    <h4 className="text-sm font-medium text-gray-700 mb-1">Resolution</h4>
                    <p className="text-sm text-gray-900">{insights.resolution}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded">
                    <h4 className="text-sm font-medium text-gray-700 mb-1">File Size</h4>
                    <p className="text-sm text-gray-900">{insights.fileSize}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageInsights;