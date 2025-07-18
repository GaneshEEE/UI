import React, { useState } from 'react';
import { Code, FileText, Download, Save, X, ChevronDown, Loader2, Zap, Search, Video, TrendingUp, TestTube, Image } from 'lucide-react';
import { FeatureType } from '../App';

interface CodeAssistantProps {
  onClose: () => void;
  onFeatureSelect: (feature: FeatureType) => void;
}

const CodeAssistant: React.FC<CodeAssistantProps> = ({ onClose, onFeatureSelect }) => {
  const [selectedPage, setSelectedPage] = useState('');
  const [detectedCode, setDetectedCode] = useState('');
  const [aiAction, setAiAction] = useState('');
  const [outputFormat, setOutputFormat] = useState('javascript');
  const [fileName, setFileName] = useState('');
  const [processedCode, setProcessedCode] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [exportFormat, setExportFormat] = useState('markdown');

  const codePages = [
    'API Documentation',
    'Frontend Components',
    'Backend Services',
    'Database Schema',
    'Configuration Files'
  ];

  const aiActions = [
    { value: 'summarize', label: 'Summarize Code' },
    { value: 'optimize', label: 'Optimize Performance' },
    { value: 'convert', label: 'Convert Language' },
    { value: 'document', label: 'Generate Documentation' },
    { value: 'refactor', label: 'Refactor Structure' },
    { value: 'security', label: 'Security Analysis' }
  ];

  const outputFormats = [
    'javascript', 'typescript', 'python', 'java', 'csharp', 'go', 'rust', 'php'
  ];

  const features = [
    { id: 'search' as const, label: 'AI Powered Search', icon: Search },
    { id: 'video' as const, label: 'Video Summarizer', icon: Video },
    { id: 'code' as const, label: 'Code Assistant', icon: Code },
    { id: 'impact' as const, label: 'Impact Analyzer', icon: TrendingUp },
    { id: 'test' as const, label: 'Test Support Tool', icon: TestTube },
    { id: 'image' as const, label: 'Image Insights & Chart Builder', icon: Image },
  ];

  const sampleCode = `// React Component Example
import React, { useState, useEffect } from 'react';

const UserProfile = ({ userId }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUser(userId);
  }, [userId]);

  const fetchUser = async (id) => {
    try {
      const response = await fetch(\`/api/users/\${id}\`);
      const userData = await response.json();
      setUser(userData);
    } catch (error) {
      console.error('Error fetching user:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  
  return (
    <div className="user-profile">
      <h2>{user?.name}</h2>
      <p>{user?.email}</p>
    </div>
  );
};

export default UserProfile;`;

  const handlePageSelect = (page: string) => {
    setSelectedPage(page);
    setDetectedCode(sampleCode);
  };

  const processCode = async () => {
    setIsProcessing(true);
    
    // Simulate AI processing
    setTimeout(() => {
      let result = '';
      
      switch (aiAction) {
        case 'summarize':
          result = `# Code Summary

This React component creates a user profile display with the following features:

## Key Components:
- **UserProfile**: Main functional component
- **State Management**: Uses React hooks (useState, useEffect)
- **API Integration**: Fetches user data from REST API
- **Error Handling**: Includes try-catch for API calls
- **Loading States**: Shows loading indicator during data fetch

## Dependencies:
- React (hooks)
- Fetch API for HTTP requests

## Functionality:
1. Accepts userId as prop
2. Fetches user data on component mount
3. Displays user name and email
4. Handles loading and error states

The component follows React best practices with proper state management and side effect handling.`;
          break;
          
        case 'optimize':
          result = `// Optimized React Component
import React, { useState, useEffect, useCallback, memo } from 'react';

const UserProfile = memo(({ userId }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUser = useCallback(async (id) => {
    if (!id) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(\`/api/users/\${id}\`, {
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (!response.ok) {
        throw new Error(\`Failed to fetch user: \${response.status}\`);
      }
      
      const userData = await response.json();
      setUser(userData);
    } catch (error) {
      console.error('Error fetching user:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser(userId);
  }, [userId, fetchUser]);

  if (loading) return <div className="loading-spinner" aria-label="Loading user data">Loading...</div>;
  if (error) return <div className="error-message" role="alert">Error: {error}</div>;
  if (!user) return <div className="no-data">No user data available</div>;
  
  return (
    <div className="user-profile" role="main">
      <h2>{user.name}</h2>
      <p>{user.email}</p>
    </div>
  );
});

UserProfile.displayName = 'UserProfile';
export default UserProfile;`;
          break;
          
        case 'convert':
          if (outputFormat === 'python') {
            result = `# Python Flask equivalent
from flask import Flask, jsonify, render_template_string
import requests
from typing import Optional, Dict, Any

app = Flask(__name__)

class UserProfile:
    def __init__(self):
        self.user: Optional[Dict[str, Any]] = None
        self.loading: bool = True
        self.error: Optional[str] = None
    
    async def fetch_user(self, user_id: str) -> None:
        """Fetch user data from API"""
        if not user_id:
            return
            
        self.loading = True
        self.error = None
        
        try:
            response = requests.get(f"/api/users/{user_id}")
            response.raise_for_status()
            self.user = response.json()
        except requests.RequestException as e:
            self.error = f"Error fetching user: {str(e)}"
        finally:
            self.loading = False

@app.route('/user/<user_id>')
def user_profile(user_id: str):
    profile = UserProfile()
    profile.fetch_user(user_id)
    
    if profile.loading:
        return jsonify({"status": "loading"})
    
    if profile.error:
        return jsonify({"error": profile.error}), 400
        
    if not profile.user:
        return jsonify({"error": "No user data available"}), 404
    
    return jsonify({
        "name": profile.user.get("name"),
        "email": profile.user.get("email")
    })

if __name__ == '__main__':
    app.run(debug=True)`;
          } else {
            result = detectedCode; // Default to original if not Python
          }
          break;
          
        default:
          result = `AI processing completed for action: ${aiAction}`;
      }
      
      setProcessedCode(result);
      setIsProcessing(false);
    }, 2000);
  };

  const exportCode = (format: string) => {
    const content = processedCode || detectedCode;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${fileName || 'code'}.${format}`;
    a.click();
  };

  return (
    <div className="fixed top-4 right-4 z-40">
      <div className="bg-white border border-gray-200 rounded-lg shadow-lg w-[600px] h-[700px] overflow-hidden">
        {/* Header */}
        <div className="bg-confluence-blue p-4 text-white border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Code className="w-5 h-5" />
              <div>
                <h2 className="text-base font-bold">Code Assistant</h2>
                <p className="text-blue-100 text-sm">Analyze and process code content</p>
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
              const isActive = feature.id === 'code';
              
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
            {/* Left Column - Configuration */}
            <div>
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
                  <FileText className="w-4 h-4 mr-2" />
                  Code Selection
                </h3>
                
                {/* Page Selection */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Code Page
                  </label>
                  <div className="relative">
                    <select
                      value={selectedPage}
                      onChange={(e) => handlePageSelect(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-confluence-blue focus:border-confluence-blue appearance-none bg-white"
                    >
                      <option value="">Choose a page...</option>
                      {codePages.map(page => (
                        <option key={page} value={page}>{page}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                {/* AI Action Selection */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    AI Action
                  </label>
                  <div className="relative">
                    <select
                      value={aiAction}
                      onChange={(e) => setAiAction(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-confluence-blue focus:border-confluence-blue appearance-none bg-white"
                    >
                      <option value="">Select action...</option>
                      {aiActions.map(action => (
                        <option key={action.value} value={action.value}>{action.label}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                {/* Output Format */}
                {aiAction === 'convert' && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Target Language
                    </label>
                    <div className="relative">
                      <select
                        value={outputFormat}
                        onChange={(e) => setOutputFormat(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-confluence-blue focus:border-confluence-blue appearance-none bg-white"
                      >
                        {outputFormats.map(format => (
                          <option key={format} value={format}>
                            {format.charAt(0).toUpperCase() + format.slice(1)}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                )}

                {/* File Name */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Output File Name
                  </label>
                  <input
                    type="text"
                    value={fileName}
                    onChange={(e) => setFileName(e.target.value)}
                    placeholder="my-component"
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-confluence-blue focus:border-confluence-blue bg-white"
                  />
                </div>

                {/* Process Button */}
                <button
                  onClick={processCode}
                  disabled={!selectedPage || !aiAction || isProcessing}
                  className="w-full bg-confluence-blue text-white py-2 px-4 rounded hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center space-x-2 transition-colors"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-5 h-5" />
                      <span>Process Code</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Middle Column - Original Code */}
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <h3 className="font-semibold text-gray-800 mb-4">Detected Code</h3>
                {detectedCode ? (
                  <div className="bg-gray-900 rounded p-3 overflow-auto max-h-60">
                    <pre className="text-xs text-gray-300">
                      <code>{detectedCode}</code>
                    </pre>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Code className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                    <p>Select a code page to view content</p>
                  </div>
                )}
              </div>

            {/* Right Column - Processed Code */}
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-800">AI Result</h3>
                  {processedCode && (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => exportCode('js')}
                        className="px-2 py-1 bg-confluence-blue text-white rounded text-xs hover:bg-blue-600 transition-colors"
                      >
                        Export
                      </button>
                      <button
                        onClick={() => alert('Saved to Confluence!')}
                        className="px-2 py-1 bg-confluence-blue text-white rounded text-xs hover:bg-blue-600 transition-colors"
                      >
                        Save
                      </button>
                    </div>
                  )}
                </div>
                
                {processedCode ? (
                  <div className="bg-gray-900 rounded p-3 overflow-auto max-h-60">
                    <pre className="text-xs text-gray-300">
                      <code>{processedCode}</code>
                    </pre>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Zap className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                    <p>Process code to see AI results</p>
                  </div>
                )}
              </div>

              {/* Export Options */}
              {processedCode && (
                <div className="bg-white rounded-lg p-4 border border-gray-200 mt-4">
                  <h4 className="font-semibold text-gray-800 mb-3">Export Options</h4>
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
                    
                    <div className="flex space-x-2">
                      <button
                        onClick={() => exportCode(exportFormat)}
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeAssistant;