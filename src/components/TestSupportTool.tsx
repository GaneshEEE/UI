import React, { useState } from 'react';
import { TestTube, Code, FileCheck, Download, Save, X, ChevronDown, Loader2, MessageSquare, Play, Search, Video, TrendingUp, Image } from 'lucide-react';
import { FeatureType } from '../App';

interface TestSupportToolProps {
  onClose: () => void;
  onFeatureSelect: (feature: FeatureType) => void;
}

interface TestReport {
  strategy: string;
  crossPlatform: string;
  sensitivity: string;
}

const TestSupportTool: React.FC<TestSupportToolProps> = ({ onClose, onFeatureSelect }) => {
  const [codePageId, setCodePageId] = useState('');
  const [testInputPage, setTestInputPage] = useState('');
  const [isGenerating, setIsGenerating] = useState<string>('');
  const [testReport, setTestReport] = useState<TestReport | null>(null);
  const [question, setQuestion] = useState('');
  const [qaResults, setQaResults] = useState<Array<{question: string, answer: string}>>([]);
  const [exportFormat, setExportFormat] = useState('markdown');

  const codePages = [
    'UserService.js',
    'PaymentController.py',
    'AuthModule.ts',
    'DatabaseHelper.java',
    'ApiClient.cs'
  ];

  const testPages = [
    'User Tests Suite',
    'Payment Tests',
    'Auth Test Cases',
    'Database Tests',
    'API Integration Tests'
  ];

  const features = [
    { id: 'search' as const, label: 'AI Powered Search', icon: Search },
    { id: 'video' as const, label: 'Video Summarizer', icon: Video },
    { id: 'code' as const, label: 'Code Assistant', icon: Code },
    { id: 'impact' as const, label: 'Impact Analyzer', icon: TrendingUp },
    { id: 'test' as const, label: 'Test Support Tool', icon: TestTube },
    { id: 'image' as const, label: 'Image Insights & Chart Builder', icon: Image },
  ];

  const generateTestStrategy = async () => {
    setIsGenerating('strategy');
    setTimeout(() => {
      setTestReport(prev => ({
        ...prev,
        strategy: `# Test Strategy Generation

## Test Pyramid Approach
Based on the selected code components, here's a comprehensive testing strategy:

### Unit Tests (70%)
- **Component Tests**: Individual function and method validation
- **Mock Dependencies**: External service and database mocking
- **Edge Cases**: Boundary value testing and error scenarios
- **Coverage Target**: 90%+ line coverage

### Integration Tests (20%)
- **API Endpoint Testing**: Full request/response cycle validation
- **Database Integration**: Real database interaction testing
- **Service Layer Testing**: Cross-service communication validation
- **Configuration Testing**: Environment-specific behavior validation

### E2E Tests (10%)
- **User Journey Testing**: Complete workflow validation
- **Browser Compatibility**: Cross-browser functionality testing
- **Performance Testing**: Load and stress testing scenarios
- **Security Testing**: Authentication and authorization validation

## Test Data Management
- **Test Fixtures**: Standardized test data sets
- **Data Cleanup**: Automated cleanup between test runs
- **Seed Data**: Consistent baseline data for testing

## Automation Strategy
- **CI/CD Integration**: Automated test execution on commits
- **Parallel Execution**: Concurrent test running for faster feedback
- **Reporting**: Comprehensive test result reporting and metrics

## Risk Areas Identified
- Authentication flows require extensive security testing
- Payment processing needs thorough validation
- Database operations need transaction integrity testing`
      }));
      setIsGenerating('');
    }, 2000);
  };

  const generateCrossPlatform = async () => {
    setIsGenerating('crossplatform');
    setTimeout(() => {
      setTestReport(prev => ({
        ...prev,
        crossPlatform: `# Cross-Platform Analysis

## Platform Coverage Assessment

### Web Browsers
- **Chrome**: Full compatibility expected
- **Firefox**: Minor CSS adjustments needed
- **Safari**: Webkit-specific considerations
- **Edge**: Modern Edge compatibility confirmed
- **Mobile Browsers**: Responsive design validation required

### Operating Systems
- **Windows**: Primary development environment
- **macOS**: Additional font rendering considerations
- **Linux**: Container deployment testing needed
- **Mobile iOS**: Native app integration points
- **Android**: Performance optimization requirements

### Device Categories
- **Desktop**: Full feature set available
- **Tablet**: Touch interface optimizations
- **Mobile**: Simplified UI patterns needed
- **Accessibility**: Screen reader compatibility

## Testing Approach
### Automated Cross-Platform Testing
- **Browser Stack Integration**: Automated cross-browser testing
- **Device Farm Testing**: Real device validation
- **Performance Benchmarking**: Platform-specific performance metrics

### Manual Testing Strategy
- **User Acceptance Testing**: Platform-specific user workflows
- **Accessibility Testing**: Assistive technology validation
- **Localization Testing**: Multi-language support verification

## Platform-Specific Considerations
### Performance Optimization
- **Mobile**: Bundle size optimization and lazy loading
- **Desktop**: Full feature utilization and advanced interactions
- **Tablets**: Hybrid interaction patterns (touch + keyboard)

### Security Implications
- **iOS**: App Store security requirements
- **Android**: Play Store compliance
- **Web**: CSP and HTTPS enforcement`
      }));
      setIsGenerating('');
    }, 2000);
  };

  const generateSensitivity = async () => {
    setIsGenerating('sensitivity');
    setTimeout(() => {
      setTestReport(prev => ({
        ...prev,
        sensitivity: `# Sensitivity Analysis

## Critical Path Identification

### High-Risk Components
- **Authentication System**: Single point of failure analysis
- **Payment Processing**: Financial transaction integrity
- **User Data Management**: Privacy and security implications
- **API Gateway**: Service availability and rate limiting

### Dependency Analysis
- **External Services**: Third-party API reliability
- **Database Systems**: Data consistency and backup strategies
- **Infrastructure**: Cloud provider dependencies
- **CDN Services**: Content delivery reliability

## Failure Mode Analysis

### Single Points of Failure
1. **Database Connection**: Potential application-wide impact
2. **Authentication Service**: User access blocking
3. **Payment Gateway**: Transaction processing halt
4. **Session Management**: User experience degradation

### Cascading Failure Scenarios
- **Service Mesh Failures**: Microservice communication breakdown
- **Network Partitions**: Cross-region connectivity issues
- **Resource Exhaustion**: Memory and CPU bottlenecks
- **Rate Limiting**: API throttling impact

## Resilience Testing Strategy

### Chaos Engineering
- **Service Disruption**: Random service termination testing
- **Network Latency**: Artificial network delay injection
- **Resource Constraints**: CPU and memory limitation testing
- **Data Corruption**: Database integrity testing

### Recovery Testing
- **Backup Restoration**: Data recovery validation
- **Failover Procedures**: Service continuity testing
- **Circuit Breaker**: Failure isolation mechanism testing
- **Health Check Systems**: Service monitoring validation

## Monitoring and Alerting
### Key Metrics
- **Response Time**: Service performance monitoring
- **Error Rates**: Failure frequency tracking
- **Resource Utilization**: System capacity monitoring
- **User Experience**: Frontend performance metrics

### Alert Configuration
- **Threshold Settings**: Proactive issue detection
- **Escalation Procedures**: Incident response workflows
- **Business Impact**: Revenue and user impact assessment`
      }));
      setIsGenerating('');
    }, 2500);
  };

  const addQuestion = () => {
    if (!question.trim()) return;
    
    const answer = `Based on the testing analysis for the selected code and test components, here's the response to your question: "${question}"

${question.toLowerCase().includes('performance') ? 
  'Performance testing should focus on load testing, stress testing, and monitoring response times across different user loads. Key metrics include response time, throughput, and resource utilization.' :
  question.toLowerCase().includes('security') ?
  'Security testing should encompass authentication testing, authorization validation, input validation, and vulnerability scanning. Focus on OWASP Top 10 security risks.' :
  question.toLowerCase().includes('automation') ?
  'Test automation should follow the test pyramid approach with extensive unit tests, moderate integration tests, and minimal but critical E2E tests. CI/CD integration is essential.' :
  'This aspect requires careful consideration of the specific testing requirements and should be tailored to your application\'s unique needs and risk profile.'
}

The analysis is based on the selected code and test components, providing context-specific recommendations.`;

    setQaResults([...qaResults, { question, answer }]);
    setQuestion('');
  };

  const exportReport = () => {
    const content = `# Test Support Tool - Comprehensive Report

## Selected Components
- **Code Page**: ${codePageId}
- **Test Input Page**: ${testInputPage}
- **Generated**: ${new Date().toLocaleString()}

${testReport?.strategy || ''}

${testReport?.crossPlatform || ''}

${testReport?.sensitivity || ''}

## Questions & Answers
${qaResults.map(qa => `**Q:** ${qa.question}\n**A:** ${qa.answer}`).join('\n\n')}

---
*Generated by Confluence AI Assistant - Test Support Tool*`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `test-support-report.${exportFormat}`;
    a.click();
  };

  return (
    <div className="fixed top-4 right-4 z-40">
      <div className="bg-white border border-gray-200 rounded-lg shadow-lg w-[600px] h-[700px] overflow-hidden">
        {/* Header */}
        <div className="bg-confluence-blue p-4 text-white border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <TestTube className="w-5 h-5" />
              <div>
                <h2 className="text-base font-bold">Test Support Tool</h2>
                <p className="text-blue-100 text-sm">Generate testing strategies and analysis</p>
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
              const isActive = feature.id === 'test';
              
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
                  <FileCheck className="w-4 h-4 mr-2" />
                  Component Selection
                </h3>
                
                {/* Code Page Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Code Page
                  </label>
                  <div className="relative">
                    <select
                      value={codePageId}
                      onChange={(e) => setCodePageId(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-confluence-blue focus:border-confluence-blue appearance-none bg-white"
                    >
                      <option value="">Select code page...</option>
                      {codePages.map(page => (
                        <option key={page} value={page}>{page}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                {/* Test Input Page Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Test Input Page
                  </label>
                  <div className="relative">
                    <select
                      value={testInputPage}
                      onChange={(e) => setTestInputPage(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-confluence-blue focus:border-confluence-blue appearance-none bg-white"
                    >
                      <option value="">Select test page...</option>
                      {testPages.map(page => (
                        <option key={page} value={page}>{page}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                {/* Generation Buttons */}
                <div className="space-y-3">
                  <button
                    onClick={generateTestStrategy}
                    disabled={!codePageId || !testInputPage || isGenerating === 'strategy'}
                    className="w-full bg-confluence-blue text-white py-2 px-4 rounded hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center space-x-2 transition-colors"
                  >
                    {isGenerating === 'strategy' ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Generating...</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4" />
                        <span>Generate Strategy</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={generateCrossPlatform}
                    disabled={!codePageId || !testInputPage || isGenerating === 'crossplatform'}
                    className="w-full bg-confluence-blue text-white py-2 px-4 rounded hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center space-x-2 transition-colors"
                  >
                    {isGenerating === 'crossplatform' ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Analyzing...</span>
                      </>
                    ) : (
                      <>
                        <Code className="w-4 h-4" />
                        <span>Cross-Platform</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={generateSensitivity}
                    disabled={!codePageId || !testInputPage || isGenerating === 'sensitivity'}
                    className="w-full bg-confluence-blue text-white py-2 px-4 rounded hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center space-x-2 transition-colors"
                  >
                    {isGenerating === 'sensitivity' ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Analyzing...</span>
                      </>
                    ) : (
                      <>
                        <TestTube className="w-4 h-4" />
                        <span>Sensitivity Check</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Export Button */}
                {testReport && (testReport.strategy || testReport.crossPlatform || testReport.sensitivity) && (
                  <div className="pt-3 border-t border-gray-200 space-y-2">
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
                        onClick={exportReport}
                        className="w-full flex items-center justify-center space-x-2 px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                      >
                        <Download className="w-4 h-4" />
                        <span>Export</span>
                      </button>
                      <button
                        onClick={() => alert('Test report saved to Confluence!')}
                        className="w-full flex items-center justify-center space-x-2 px-3 py-2 bg-confluence-blue text-white rounded hover:bg-blue-600 transition-colors"
                      >
                        <Save className="w-4 h-4" />
                        <span>Save to Confluence</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Middle Columns - Generated Content */}
              {/* Test Strategy */}
              {testReport?.strategy && (
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
                    <Play className="w-4 h-4 mr-2 text-confluence-blue" />
                    Test Strategy
                  </h3>
                  <div className="bg-gray-50 rounded p-3 prose prose-sm max-w-none max-h-60 overflow-y-auto">
                    {testReport.strategy.split('\n').map((line, index) => {
                      if (line.startsWith('### ')) {
                        return <h3 key={index} className="text-lg font-bold text-gray-800 mt-4 mb-2">{line.substring(4)}</h3>;
                      } else if (line.startsWith('## ')) {
                        return <h2 key={index} className="text-xl font-bold text-gray-800 mt-6 mb-3">{line.substring(3)}</h2>;
                      } else if (line.startsWith('# ')) {
                        return <h1 key={index} className="text-2xl font-bold text-gray-800 mt-8 mb-4">{line.substring(2)}</h1>;
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
                </div>
              )}

              {/* Cross-Platform Analysis */}
              {testReport?.crossPlatform && (
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
                    <Code className="w-4 h-4 mr-2 text-confluence-blue" />
                    Cross-Platform Analysis
                  </h3>
                  <div className="bg-gray-50 rounded p-3 prose prose-sm max-w-none max-h-60 overflow-y-auto">
                    {testReport.crossPlatform.split('\n').map((line, index) => {
                      if (line.startsWith('### ')) {
                        return <h3 key={index} className="text-lg font-bold text-gray-800 mt-4 mb-2">{line.substring(4)}</h3>;
                      } else if (line.startsWith('## ')) {
                        return <h2 key={index} className="text-xl font-bold text-gray-800 mt-6 mb-3">{line.substring(3)}</h2>;
                      } else if (line.startsWith('# ')) {
                        return <h1 key={index} className="text-2xl font-bold text-gray-800 mt-8 mb-4">{line.substring(2)}</h1>;
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
                </div>
              )}

              {/* Sensitivity Analysis */}
              {testReport?.sensitivity && (
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
                    <TestTube className="w-4 h-4 mr-2 text-confluence-blue" />
                    Sensitivity Analysis
                  </h3>
                  <div className="bg-gray-50 rounded p-3 prose prose-sm max-w-none max-h-60 overflow-y-auto">
                    {testReport.sensitivity.split('\n').map((line, index) => {
                      if (line.startsWith('### ')) {
                        return <h3 key={index} className="text-lg font-bold text-gray-800 mt-4 mb-2">{line.substring(4)}</h3>;
                      } else if (line.startsWith('## ')) {
                        return <h2 key={index} className="text-xl font-bold text-gray-800 mt-6 mb-3">{line.substring(3)}</h2>;
                      } else if (line.startsWith('# ')) {
                        return <h1 key={index} className="text-2xl font-bold text-gray-800 mt-8 mb-4">{line.substring(2)}</h1>;
                      } else if (line.match(/^\d+\./)) {
                        return <p key={index} className="mb-2 font-medium">{line}</p>;
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
                </div>
              )}

            {/* Right Column - Q&A */}
              <div className="bg-white rounded-lg p-4 space-y-3 border border-gray-200">
                <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Questions & Analysis
                </h3>
                
                {/* Existing Q&A */}
                {qaResults.length > 0 && (
                  <div className="space-y-2 mb-3 max-h-40 overflow-y-auto">
                    {qaResults.map((qa, index) => (
                      <div key={index} className="bg-gray-50 rounded p-2">
                        <p className="font-medium text-gray-800 mb-1 text-sm">Q: {qa.question}</p>
                        <p className="text-gray-700 text-xs">{qa.answer.substring(0, 100)}...</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add Question */}
                <div className="space-y-2">
                  <textarea
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="Ask about testing strategies, coverage, or specific scenarios..."
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-confluence-blue focus:border-confluence-blue resize-none bg-white"
                    rows={3}
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
          </div>

          {/* Empty State */}
          {!testReport?.strategy && !testReport?.crossPlatform && !testReport?.sensitivity && (
            <div className="text-center py-12">
              <TestTube className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <h3 className="text-base font-semibold text-gray-600 mb-2">Ready to Generate Test Analysis</h3>
              <p className="text-sm text-gray-500">Select your code and test components, then choose which analysis to generate.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TestSupportTool;