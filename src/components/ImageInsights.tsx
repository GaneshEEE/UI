import React, { useState } from 'react';
import { X, Image, Upload, Eye, Zap, BarChart3 } from 'lucide-react';

interface ImageInsightsProps {
  onClose: () => void;
}

export default function ImageInsights({ onClose }: ImageInsightsProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [insights, setInsights] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

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
    <div className="fixed top-4 right-4 w-[500px] h-[700px] bg-white border border-gray-200 shadow-lg overflow-hidden flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center gap-2">
          <Eye className="w-4 h-4 text-blue-600" />
          <h2 className="text-sm font-semibold text-gray-900">Image Insights</h2>
        </div>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-200 rounded transition-colors"
        >
          <X className="w-4 h-4 text-gray-500" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 overflow-y-auto">
        {/* Upload Section */}
        <div className="mb-4">
          <label className="block text-xs font-medium text-gray-700 mb-2">
            Upload Image
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
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
            <label className="block text-xs font-medium text-gray-700 mb-2">
              Preview
            </label>
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <img
                src={selectedImage}
                alt="Preview"
                className="w-full h-32 object-cover"
              />
            </div>
            <button
              onClick={analyzeImage}
              disabled={isAnalyzing}
              className="w-full mt-2 px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {isAnalyzing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  Analyze Image
                </>
              )}
            </button>
          </div>
        )}

        {/* Insights Results */}
        {insights && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-3">
              <BarChart3 className="w-4 h-4 text-green-600" />
              <h3 className="text-sm font-semibold text-gray-900">Analysis Results</h3>
            </div>

            <div className="grid grid-cols-1 gap-3">
              <div className="bg-gray-50 p-3 rounded-lg">
                <h4 className="text-xs font-medium text-gray-700 mb-2">Detected Objects</h4>
                <div className="flex flex-wrap gap-1">
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

              <div className="bg-gray-50 p-3 rounded-lg">
                <h4 className="text-xs font-medium text-gray-700 mb-2">Dominant Colors</h4>
                <div className="flex flex-wrap gap-1">
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
                <div className="bg-gray-50 p-3 rounded-lg">
                  <h4 className="text-xs font-medium text-gray-700 mb-1">Mood</h4>
                  <p className="text-sm text-gray-900">{insights.mood}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <h4 className="text-xs font-medium text-gray-700 mb-1">Quality</h4>
                  <p className="text-sm text-gray-900">{insights.quality}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <h4 className="text-xs font-medium text-gray-700 mb-1">Resolution</h4>
                  <p className="text-sm text-gray-900">{insights.resolution}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <h4 className="text-xs font-medium text-gray-700 mb-1">File Size</h4>
                  <p className="text-sm text-gray-900">{insights.fileSize}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}