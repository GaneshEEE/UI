import React, { useState } from 'react';
import { Zap, X, Send, Download, RotateCcw, FileText, Brain, CheckCircle, Loader2, MessageSquare, Plus } from 'lucide-react';
import { AppMode } from '../App';

interface AgentModeProps {
  onClose: () => void;
  onModeSelect: (mode: AppMode) => void;
}

interface PlanStep {
  id: number;
  title: string;
  status: 'pending' | 'running' | 'completed';
  details?: string;
}

interface OutputTab {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  content: string;
}

const AgentMode: React.FC<AgentModeProps> = ({ onClose, onModeSelect }) => {
  const [goal, setGoal] = useState('');
  const [isPlanning, setIsPlanning] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [planSteps, setPlanSteps] = useState<PlanStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [activeTab, setActiveTab] = useState('answer');
  const [followUpQuestion, setFollowUpQuestion] = useState('');
  const [showFollowUp, setShowFollowUp] = useState(false);
  const [outputTabs, setOutputTabs] = useState<OutputTab[]>([]);

  const handleGoalSubmit = async () => {
    if (!goal.trim()) return;
    
    setIsPlanning(true);
    
    // Simulate planning phase
    setTimeout(() => {
      const steps: PlanStep[] = [
        { id: 1, title: 'Retrieve context', status: 'pending' },
        { id: 2, title: 'Summarize', status: 'pending' },
        { id: 3, title: 'Recommend changes', status: 'pending' }
      ];
      setPlanSteps(steps);
      setIsPlanning(false);
      
      // Start execution
      executeSteps(steps);
    }, 2000);
  };

  const executeSteps = async (steps: PlanStep[]) => {
    setIsExecuting(true);
    
    for (let i = 0; i < steps.length; i++) {
      setCurrentStep(i);
      
      // Update step to running
      setPlanSteps(prev => prev.map(step => 
        step.id === i + 1 
          ? { ...step, status: 'running', details: getStepDetails(i) }
          : step
      ));
      
      // Simulate step execution
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update step to completed
      setPlanSteps(prev => prev.map(step => 
        step.id === i + 1 
          ? { ...step, status: 'completed', details: getCompletedDetails(i) }
          : step
      ));
    }
    
    // Generate output tabs
    const tabs: OutputTab[] = [
      {
        id: 'answer',
        label: 'Final Answer',
        icon: FileText,
        content: generateFinalAnswer()
      },
      {
        id: 'reasoning',
        label: 'Reasoning Steps',
        icon: Brain,
        content: generateReasoningSteps()
      },
      {
        id: 'tools',
        label: 'Used Tools',
        icon: Zap,
        content: generateUsedTools()
      },
      {
        id: 'qa',
        label: 'Follow-Up Q&A',
        icon: MessageSquare,
        content: 'Ask follow-up questions to refine or expand on this analysis.'
      }
    ];
    
    setOutputTabs(tabs);
    setIsExecuting(false);
    setShowFollowUp(true);
  };

  const getStepDetails = (stepIndex: number) => {
    const details = [
      '🔍 Searching Confluence...',
      '📊 Analyzing content...',
      '💡 Generating recommendations...'
    ];
    return details[stepIndex];
  };

  const getCompletedDetails = (stepIndex: number) => {
    const details = [
      '✅ Found 3 relevant pages',
      '✅ Content summarized',
      '✅ Recommendations generated'
    ];
    return details[stepIndex];
  };

  const generateFinalAnswer = () => {
    return `Based on your goal: "${goal}"

## Analysis Summary
I've analyzed the relevant Confluence content and identified key areas for improvement. The system has processed multiple pages and extracted actionable insights.

## Key Recommendations
1. **Immediate Actions**: Update documentation structure for better navigation
2. **Process Improvements**: Implement automated content review workflows  
3. **Long-term Strategy**: Establish content governance guidelines

## Next Steps
- Review the detailed reasoning in the "Reasoning Steps" tab
- Check which tools were used in the "Used Tools" tab
- Ask follow-up questions for clarification or refinement

*Analysis completed at ${new Date().toLocaleString()}*`;
  };

  const generateReasoningSteps = () => {
    return `## Step-by-Step Reasoning

### 1. Context Retrieval
- Searched across Engineering, Product, and Documentation spaces
- Identified 3 relevant pages containing goal-related information
- Extracted key themes and patterns from content

### 2. Content Analysis
- Summarized main points from each source
- Identified gaps and inconsistencies
- Analyzed current state vs desired outcomes

### 3. Recommendation Generation
- Applied best practices from similar scenarios
- Considered organizational constraints and capabilities
- Prioritized recommendations by impact and feasibility

### Decision Factors
- **Relevance**: How closely content matched the stated goal
- **Completeness**: Coverage of all aspects mentioned in the goal
- **Actionability**: Practical steps that can be implemented`;
  };

  const generateUsedTools = () => {
    return `## Tools Utilized in This Analysis

### 🔍 AI Powered Search
- **Purpose**: Retrieved relevant content from Confluence spaces
- **Scope**: Searched across 3 spaces, analyzed 5 pages
- **Results**: Found key documentation and process information

### 📊 Content Analyzer
- **Purpose**: Processed and summarized retrieved content
- **Method**: Natural language processing and pattern recognition
- **Output**: Structured insights and key themes

### 💡 Recommendation Engine
- **Purpose**: Generated actionable recommendations
- **Approach**: Best practice matching and gap analysis
- **Deliverable**: Prioritized action items with implementation guidance

### Integration Points
All tools worked together seamlessly to provide a comprehensive analysis of your goal.`;
  };

  const handleFollowUp = () => {
    if (!followUpQuestion.trim()) return;
    
    // Add follow-up to Q&A tab
    const qaContent = outputTabs.find(tab => tab.id === 'qa')?.content || '';
    const updatedQA = `${qaContent}\n\n**Q: ${followUpQuestion}**\n\nA: Based on the previous analysis, here's additional insight: ${followUpQuestion.toLowerCase().includes('risk') ? 'The main risks include implementation complexity and user adoption. Mitigation strategies should focus on phased rollout and comprehensive training.' : 'This aspect requires careful consideration of your specific context and organizational needs. I recommend reviewing the detailed steps in the Reasoning tab for more context.'}`;
    
    setOutputTabs(prev => prev.map(tab => 
      tab.id === 'qa' ? { ...tab, content: updatedQA } : tab
    ));
    
    setFollowUpQuestion('');
  };

  const exportPlan = () => {
    const content = `# AI Agent Analysis Report

## Goal
${goal}

## Execution Plan
${planSteps.map(step => `${step.id}. ${step.title} - ${step.status}`).join('\n')}

## Final Answer
${outputTabs.find(tab => tab.id === 'answer')?.content || ''}

## Reasoning Steps
${outputTabs.find(tab => tab.id === 'reasoning')?.content || ''}

## Tools Used
${outputTabs.find(tab => tab.id === 'tools')?.content || ''}

---
*Generated by Confluence AI Assistant - Agent Mode*
*Date: ${new Date().toLocaleString()}*`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ai-agent-analysis.md';
    a.click();
  };

  const replaySteps = () => {
    setPlanSteps([]);
    setCurrentStep(0);
    setOutputTabs([]);
    setShowFollowUp(false);
    setActiveTab('answer');
    handleGoalSubmit();
  };

  return (
    <div className="fixed top-16 right-4 z-40">
      <div className="bg-white border border-orange-200 rounded-lg shadow-lg w-96 h-[700px] overflow-hidden">
        {/* Header */}
        <div className="bg-orange-500 p-3 text-white border-b border-orange-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Zap className="w-5 h-5 text-yellow-300" />
              <div>
                <h2 className="text-lg font-semibold">Agent Mode</h2>
                <p className="text-orange-100 text-xs">Goal-based AI assistance</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => onModeSelect('tool')}
                className="text-orange-100 hover:text-white hover:bg-white/10 rounded px-2 py-1 text-xs transition-colors"
              >
                Tool Mode
              </button>
              <button onClick={onClose} className="text-white hover:bg-white/10 rounded p-1">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="p-4 overflow-y-auto h-[calc(600px-60px)]">
          {/* Goal Input Section */}
          {!planSteps.length && !isPlanning && (
            <div>
              <div className="bg-white rounded-lg p-4 border border-gray-200 text-center">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">What do you want to achieve?</h3>
                <div className="relative">
                  <textarea
                    value={goal}
                    onChange={(e) => setGoal(e.target.value)}
                    placeholder="Describe your goal..."
                    className="w-full p-3 border border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none text-sm"
                    rows={3}
                  />
                  <button
                    onClick={handleGoalSubmit}
                    disabled={!goal.trim()}
                    className="absolute bottom-2 right-2 bg-orange-500 text-white p-2 rounded hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Planning Phase */}
          {isPlanning && (
            <div>
              <div className="bg-white rounded-lg p-4 border border-gray-200 text-center">
                <div className="flex items-center justify-center space-x-3 mb-4">
                  <Brain className="w-6 h-6 text-orange-500 animate-pulse" />
                  <h3 className="text-lg font-semibold text-gray-800">Planning steps...</h3>
                </div>
                <div className="flex items-center justify-center space-x-4 text-gray-600">
                  <span>1. Retrieve context</span>
                  <span>→</span>
                  <span>2. Summarize</span>
                  <span>→</span>
                  <span>3. Recommend changes</span>
                </div>
              </div>
            </div>
          )}

          {/* Execution Phase */}
          {planSteps.length > 0 && (
            <div className="space-y-4">
              {/* Left Column - Progress Timeline */}
              <div>
                <div className="bg-white rounded-lg p-3 border border-gray-200">
                  <h3 className="font-medium text-gray-800 mb-3 text-sm">Progress</h3>
                  <div className="space-y-4">
                    {planSteps.map((step, index) => (
                      <div key={step.id} className="flex items-start space-x-3">
                        <div className="flex-shrink-0 mt-1">
                          {step.status === 'completed' ? (
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          ) : step.status === 'running' ? (
                            <Loader2 className="w-4 h-4 text-orange-500 animate-spin" />
                          ) : (
                            <div className="w-4 h-4 border-2 border-gray-300 rounded-full" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-medium text-gray-800">{step.title}</div>
                          {step.details && (
                            <div className="text-xs text-gray-600 mt-1">{step.details}</div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="mt-6">
                    <div className="flex items-center justify-between text-xs text-gray-600 mb-2">
                      <span>Progress</span>
                      <span>{Math.round(((currentStep + 1) / planSteps.length) * 100)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-orange-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${((currentStep + 1) / planSteps.length) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Output Tabs */}
              <div>
                {outputTabs.length > 0 && (
                  <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                    {/* Tab Headers */}
                    <div className="border-b border-gray-200 bg-gray-50">
                      <div className="flex overflow-x-auto scrollbar-thin">
                        {outputTabs.map(tab => {
                          const Icon = tab.icon;
                          return (
                            <button
                              key={tab.id}
                              onClick={() => setActiveTab(tab.id)}
                              className={`flex items-center space-x-1 px-3 py-2 border-b-2 transition-colors whitespace-nowrap text-xs ${
                                activeTab === tab.id
                                  ? 'border-orange-500 text-orange-600 bg-white'
                                  : 'border-transparent text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                              }`}
                            >
                              <Icon className="w-3 h-3" />
                              <span className="font-medium">{tab.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Tab Content */}
                    <div className="p-3">
                      {outputTabs.find(tab => tab.id === activeTab) && (
                        <div className="prose prose-xs max-w-none">
                          {activeTab === 'qa' ? (
                            <div>
                              <div className="whitespace-pre-wrap text-gray-700 mb-3 text-xs">
                                {outputTabs.find(tab => tab.id === activeTab)?.content}
                              </div>
                              {showFollowUp && (
                                <div className="border-t border-gray-200 pt-3">
                                  <div className="flex space-x-2">
                                    <input
                                      type="text"
                                      value={followUpQuestion}
                                      onChange={(e) => setFollowUpQuestion(e.target.value)}
                                      placeholder="Ask a follow-up question..."
                                      className="flex-1 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-xs"
                                      onKeyPress={(e) => e.key === 'Enter' && handleFollowUp()}
                                    />
                                    <button
                                      onClick={handleFollowUp}
                                      disabled={!followUpQuestion.trim()}
                                      className="px-3 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 disabled:bg-gray-300 transition-colors flex items-center"
                                    >
                                      <Plus className="w-3 h-3" />
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="whitespace-pre-wrap text-gray-700">
                              {outputTabs.find(tab => tab.id === activeTab)?.content.split('\n').slice(0, 20).map((line, index) => {
                                if (line.startsWith('### ')) {
                                  return <h3 key={index} className="text-sm font-bold text-gray-800 mt-3 mb-1">{line.substring(4)}</h3>;
                                } else if (line.startsWith('## ')) {
                                  return <h2 key={index} className="text-base font-bold text-gray-800 mt-4 mb-2">{line.substring(3)}</h2>;
                                } else if (line.startsWith('# ')) {
                                  return <h1 key={index} className="text-lg font-bold text-gray-800 mt-4 mb-3">{line.substring(2)}</h1>;
                                } else if (line.startsWith('- **')) {
                                  const match = line.match(/- \*\*(.*?)\*\*: (.*)/);
                                  if (match) {
                                    return <p key={index} className="mb-1 text-xs"><strong>{match[1]}:</strong> {match[2]}</p>;
                                  }
                                } else if (line.startsWith('- ')) {
                                  return <p key={index} className="mb-1 ml-3 text-xs">• {line.substring(2)}</p>;
                                } else if (line.trim()) {
                                  return <p key={index} className="mb-1 text-gray-700 text-xs">{line}</p>;
                                }
                                return <br key={index} />;
                              })}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                {outputTabs.length > 0 && !isExecuting && (
                  <div className="mt-3 flex space-x-2">
                    <button
                      onClick={replaySteps}
                      className="flex items-center space-x-1 px-3 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors text-xs"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Replay Steps</span>
                    </button>
                    <button
                      onClick={exportPlan}
                      className="flex items-center space-x-1 px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors text-xs"
                    >
                      <Download className="w-3 h-3" />
                      <span>Export Plan</span>
                    </button>
                    <button
                      onClick={() => alert('Added to Confluence!')}
                      className="flex items-center space-x-1 px-3 py-2 bg-confluence-blue text-white rounded hover:bg-blue-600 transition-colors text-xs"
                    >
                      <FileText className="w-3 h-3" />
                      <span>Add to Confluence</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AgentMode;