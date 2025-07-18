import React, { useState } from 'react';
import { TrendingUp, GitCompare, AlertTriangle, CheckCircle, X, ChevronDown, Loader2, Download, Save, MessageSquare, Search, Video, Code, TestTube, Image } from 'lucide-react';
import { FeatureType } from '../App';

interface ImpactAnalyzerProps {
  onClose: () => void;
  onFeatureSelect: (feature: FeatureType) => void;
}

interface DiffMetrics {
  linesAdded: number;
  linesRemoved: number;
  filesChanged: number;
  percentageChanged: number;
}

interface RiskLevel {
  level: 'low' | 'medium' | 'high';
  score: number;
  factors: string[];
}

const ImpactAnalyzer: React.FC<ImpactAnalyzerProps> = ({ onClose, onFeatureSelect }) => {
  const [oldPage, setOldPage] = useState('');
  const [newPage, setNewPage] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [diffResults, setDiffResults] = useState<string>('');
  const [metrics, setMetrics] = useState<DiffMetrics | null>(null);
  const [impactSummary, setImpactSummary] = useState('');
  const [riskLevel, setRiskLevel] = useState<RiskLevel | null>(null);
  const [question, setQuestion] = useState('');
  const [qaResults, setQaResults] = useState<Array<{question: string, answer: string}>>([]);
  const [exportFormat, setExportFormat] = useState('markdown');

  const codePages = [
    'UserController.js v1.0',
    'UserController.js v1.1',
    'PaymentService.py v2.0',
    'PaymentService.py v2.1',
    'AuthenticationModule.ts v3.0',
    'AuthenticationModule.ts v3.1'
  ];

  const features = [
    { id: 'search' as const, label: 'AI Powered Search', icon: Search },
    { id: 'video' as const, label: 'Video Summarizer', icon: Video },
    { id: 'code' as const, label: 'Code Assistant', icon: Code },
    { id: 'impact' as const, label: 'Impact Analyzer', icon: TrendingUp },
    { id: 'test' as const, label: 'Test Support Tool', icon: TestTube },
    { id: 'image' as const, label: 'Image Insights & Chart Builder', icon: Image },
  ];

  const sampleDiff = `--- Old Version
+++ New Version
@@ -15,7 +15,12 @@
 
 const UserController = {
   async getUser(req, res) {
-    const user = await User.findById(req.params.id);
+    const userId = req.params.id;
+    
+    // Add input validation
+    if (!userId || !isValidObjectId(userId)) {
+      return res.status(400).json({ error: 'Invalid user ID' });
+    }
+    
+    const user = await User.findById(userId);
     if (!user) {
       return res.status(404).json({ error: 'User not found' });
     }
@@ -25,6 +30,11 @@
   },
   
   async updateUser(req, res) {
+    // Add authorization check
+    if (req.user.id !== req.params.id && !req.user.isAdmin) {
+      return res.status(403).json({ error: 'Unauthorized' });
+    }
+    
     const user = await User.findByIdAndUpdate(
       req.params.id,
       req.body,`;

  const analyzeDiff = async () => {
    if (!oldPage || !newPage) return;
    
    setIsAnalyzing(true);
    
    // Simulate analysis
    setTimeout(() => {
      setDiffResults(sampleDiff);
      setMetrics({
        linesAdded: 12,
        linesRemoved: 1,
        filesChanged: 1,
        percentageChanged: 35.8
      });
      
      setImpactSummary(`## Impact Analysis Summary

### Changes Overview
The updated version introduces significant security improvements and input validation enhancements to the UserController module.

### Key Modifications
1. **Input Validation**: Added validation for user ID parameters to prevent invalid requests
2. **Authorization Logic**: Implemented user authorization checks for update operations
3. **Error Handling**: Enhanced error responses with proper HTTP status codes
4. **Security Hardening**: Added protection against unauthorized user modifications

### Business Impact
- **Positive**: Improved security posture and data integrity
- **Risk Mitigation**: Prevents unauthorized access and invalid data processing
- **User Experience**: Better error messaging for invalid requests

### Technical Debt
- Low: Changes follow established patterns and best practices
- Maintenance overhead is minimal
- Code readability has improved`);

      setRiskLevel({
        level: 'low',
        score: 2.3,
        factors: [
          'Added input validation reduces security risks',
          'Authorization checks prevent unauthorized access',
          'Changes follow established coding patterns',
          'No breaking changes to existing API contracts'
        ]
      });
      
      setIsAnalyzing(false);
    }, 2500);
  };

  const addQuestion = () => {
    if (!question.trim()) return;
    
    const answer = `Based on the code changes analyzed, here's the response to your question: "${question}"

The modifications primarily focus on security enhancements and input validation. The impact on ${question.toLowerCase().includes('performance') ? 'performance is minimal as the added validation checks are lightweight operations' : question.toLowerCase().includes('security') ? 'security is highly positive, significantly reducing attack surface' : 'the system is generally positive with improved robustness'}.

This analysis is based on the diff comparison between the selected versions.`;

    setQaResults([...qaResults, { question, answer }]);
    setQuestion('');
  };

  const exportAnalysis = () => {
    const content = `# Impact Analysis Report

## Version Comparison
- **Old Version**: ${oldPage}
- **New Version**: ${newPage}
- **Analysis Date**: ${new Date().toLocaleString()}

## Metrics
- Lines Added: ${metrics?.linesAdded}
- Lines Removed: ${metrics?.linesRemoved}
- Files Changed: ${metrics?.filesChanged}
- Percentage Changed: ${metrics?.percentageChanged}%

## Risk Assessment
- **Risk Level**: ${riskLevel?.level.toUpperCase()}
- **Risk Score**: ${riskLevel?.score}/10
- **Risk Factors**:
${riskLevel?.factors.map(factor => `  - ${factor}`).join('\n')}

${impactSummary}

## Code Diff
\`\`\`diff
${diffResults}
\`\`\`

## Q&A
${qaResults.map(qa => `**Q:** ${qa.question}\n**A:** ${qa.answer}`).join('\n\n')}`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `impact-analysis-report.${exportFormat}`;
    a.click();
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low': return 'text-green-700 bg-green-100/80 backdrop-blur-sm border-green-200/50';
      case 'medium': return 'text-yellow-700 bg-yellow-100/80 backdrop-blur-sm border-yellow-200/50';
      case 'high': return 'text-red-700 bg-red-100/80 backdrop-blur-sm border-red-200/50';
      default: return 'text-gray-700 bg-gray-100/80 backdrop-blur-sm border-gray-200/50';
    }
  };

  const getRiskIcon = (level: string) => {
    switch (level) {
      case 'low': return <CheckCircle className="w-5 h-5" />;
      case 'medium': return <AlertTriangle className="w-5 h-5" />;
      case 'high': return <AlertTriangle className="w-5 h-5" />;
      default: return <AlertTriangle className="w-5 h-5" />;
    }
  };

  return (
    <div className="fixed top-4 right-4 z-40">
      <div className="bg-white border border-gray-200 rounded-lg shadow-lg w-[600px] h-[700px] overflow-hidden">
        {/* Header */}
        <div className="bg-confluence-blue p-4 text-white border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <TrendingUp className="w-5 h-5" />
              <div>
                <h2 className="text-base font-bold">Impact Analyzer</h2>
                <p className="text-blue-100 text-sm">Analyze code changes and impact</p>
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
              const isActive = feature.id === 'impact';
              
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
              <div className="bg-white rounded-lg p-4 space-y-3 border border-gray-200">
                <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
                  <GitCompare className="w-4 h-4 mr-2" />
                  Version Comparison
                </h3>
                
                {/* Old Version Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Old Version
                  </label>
                  <div className="relative">
                    <select
                      value={oldPage}
                      onChange={(e) => setOldPage(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-confluence-blue focus:border-confluence-blue appearance-none bg-white"
                    >
                      <option value="">Select old version...</option>
                      {codePages.map(page => (
                        <option key={page} value={page}>{page}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                {/* New Version Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    New Version
                  </label>
                  <div className="relative">
                    <select
                      value={newPage}
                      onChange={(e) => setNewPage(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-confluence-blue focus:border-confluence-blue appearance-none bg-white"
                    >
                      <option value="">Select new version...</option>
                      {codePages.map(page => (
                        <option key={page} value={page}>{page}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                {/* Analyze Button */}
                <button
                  onClick={analyzeDiff}
                  disabled={!oldPage || !newPage || isAnalyzing}
                  className="w-full bg-confluence-blue text-white py-2 px-4 rounded hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center space-x-2 transition-colors"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Analyzing...</span>
                    </>
                  ) : (
                    <>
                      <TrendingUp className="w-5 h-5" />
                      <span>Analyze Impact</span>
                    </>
                  )}
                </button>

                {/* Metrics Display */}
                {metrics && (
                  <div className="mt-4 space-y-2">
                    <h4 className="font-semibold text-gray-800">Change Metrics</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="bg-green-100 p-2 rounded text-center">
                        <div className="font-semibold text-green-800">+{metrics.linesAdded}</div>
                        <div className="text-green-600 text-xs">Added</div>
                      </div>
                      <div className="bg-red-100 p-2 rounded text-center">
                        <div className="font-semibold text-red-800">-{metrics.linesRemoved}</div>
                        <div className="text-red-600 text-xs">Removed</div>
                      </div>
                      <div className="bg-blue-100 p-2 rounded text-center">
                        <div className="font-semibold text-blue-800">{metrics.filesChanged}</div>
                        <div className="text-blue-600 text-xs">Files</div>
                      </div>
                      <div className="bg-purple-100 p-2 rounded text-center">
                        <div className="font-semibold text-purple-800">{metrics.percentageChanged}%</div>
                        <div className="text-purple-600 text-xs">Changed</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Risk Level */}
                {riskLevel && (
                  <div className="mt-4">
                    <h4 className="font-semibold text-gray-800 mb-2">Risk Assessment</h4>
                    <div className={`p-2 rounded flex items-center space-x-2 ${getRiskColor(riskLevel.level)}`}>
                      {getRiskIcon(riskLevel.level)}
                      <div>
                        <div className="font-semibold capitalize">{riskLevel.level} Risk</div>
                        <div className="text-sm">Score: {riskLevel.score}/10</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Middle Columns - Diff and Analysis */}
              {/* Code Diff */}
              {diffResults && (
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <h3 className="font-semibold text-gray-800 mb-4">Code Diff</h3>
                  <div className="bg-gray-900 rounded p-3 overflow-auto max-h-60">
                    <pre className="text-xs">
                      <code>
                        {diffResults.split('\n').map((line, index) => (
                          <div
                            key={index}
                            className={
                              line.startsWith('+') ? 'text-green-400' :
                              line.startsWith('-') ? 'text-red-400' :
                              line.startsWith('@@') ? 'text-blue-400' :
                              'text-gray-300'
                            }
                          >
                            {line}
                          </div>
                        ))}
                      </code>
                    </pre>
                  </div>
                </div>
              )}

              {/* Impact Summary */}
              {impactSummary && (
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <h3 className="font-semibold text-gray-800 mb-4">AI Impact Summary</h3>
                  <div className="bg-gray-50 rounded p-3 prose prose-sm max-w-none max-h-60 overflow-y-auto">
                    {impactSummary.split('\n').map((line, index) => {
                      if (line.startsWith('### ')) {
                        return <h3 key={index} className="text-lg font-bold text-gray-800 mt-4 mb-2">{line.substring(4)}</h3>;
                      } else if (line.startsWith('## ')) {
                        return <h2 key={index} className="text-xl font-bold text-gray-800 mt-6 mb-3">{line.substring(3)}</h2>;
                      } else if (line.startsWith('- **')) {
                        const match = line.match(/- \*\*(.*?)\*\*: (.*)/);
                        if (match) {
                          return <p key={index} className="mb-2"><strong>{match[1]}:</strong> {match[2]}</p>;
                        }
                      } else if (line.match(/^\d+\./)) {
                        return <p key={index} className="mb-2 font-medium">{line}</p>;
                      } else if (line.trim()) {
                        return <p key={index} className="mb-2 text-gray-700">{line}</p>;
                      }
                      return <br key={index} />;
                    })}
                  </div>
                </div>
              )}

            {/* Right Column - Q&A and Export */}
              {/* Risk Factors */}
              {riskLevel && (
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <h3 className="font-semibold text-gray-800 mb-4">Risk Factors</h3>
                  <div className="space-y-2">
                    {riskLevel.factors.map((factor, index) => (
                      <div key={index} className="flex items-start space-x-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{factor}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Q&A Section */}
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <h3 className="font-semibold text-gray-800 mb-4">Questions & Analysis</h3>
                
                {/* Existing Q&A */}
                {qaResults.length > 0 && (
                  <div className="space-y-2 mb-3 max-h-40 overflow-y-auto">
                    {qaResults.map((qa, index) => (
                      <div key={index} className="bg-gray-50 rounded p-2">
                        <p className="font-medium text-gray-800 mb-1 text-sm">Q: {qa.question}</p>
                        <p className="text-gray-700 text-xs">A: {qa.answer.substring(0, 100)}...</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add Question */}
                <div className="space-y-2">
                  <input
                    type="text"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="Ask about the impact analysis..."
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-confluence-blue focus:border-confluence-blue bg-white"
                    onKeyPress={(e) => e.key === 'Enter' && addQuestion()}
                  />
                  <button
                    onClick={addQuestion}
                    disabled={!question.trim()}
                    className="w-full px-3 py-2 bg-confluence-blue text-white rounded hover:bg-blue-600 disabled:bg-gray-300 transition-colors flex items-center justify-center space-x-2"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Ask Question</span>
                  </button>
                </div>
              </div>

              {/* Export Options */}
              {diffResults && (
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <h3 className="font-semibold text-gray-800 mb-4">Export Options</h3>
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
                    
                    <div className="space-y-2">
                      <button
                        onClick={exportAnalysis}
                        className="w-full flex items-center justify-center space-x-2 px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                      >
                        <Download className="w-4 h-4" />
                        <span>Export</span>
                      </button>
                      <button
                        onClick={() => alert('Saved to Confluence!')}
                        className="w-full flex items-center justify-center space-x-2 px-3 py-2 bg-confluence-blue text-white rounded hover:bg-blue-600 transition-colors"
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

export default ImpactAnalyzer;