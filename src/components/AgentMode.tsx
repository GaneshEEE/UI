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
      'Searching Confluence...',
      'Analyzing content...',
      'Generating recommendations...'
    ];
    return details[stepIndex];
  };

  const getCompletedDetails = (stepIndex: number) => {
    const details = [
      'Found 3 relevant pages',
      'Content summarized',
      'Recommendations generated'
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

### AI Powered Search
- **Purpose**: Retrieved relevant content from Confluence spaces
- **Scope**: Searched across 3 spaces, analyzed 5 pages
- **Results**: Found key documentation and process information

### Content Analyzer
- **Purpose**: Processed and summarized retrieved content
- **Method**: Natural language processing and pattern recognition
- **Output**: Structured insights and key themes

### Recommendation Engine
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
    <div className="fixed inset-0 flex z-40">
      <div className="bg-[#1e1e1e] border-r border-[#3c3c3c] w-full max-w-6xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-[#2d2d30] border-b border-[#3c3c3c] p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Zap className="w-6 h-6 text-yellow-400" />
              <div>
                <h2 className="text-[#cccccc] text-lg font-medium">Agent Mode</h2>
                <p className="text-[#9d9d9d] text-sm">Goal-based AI assistance with planning and execution</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => onModeSelect('tool')}
                className="text-[#9d9d9d] hover:text-[#cccccc] hover:bg-[#3c3c3c] rounded px-3 py-1 text-sm transition-colors"
              >
                Switch to Tool Mode
              </button>
              <button onClick={onClose} className="text-[#cccccc] hover:text-white hover:bg-[#3c3c3c] rounded p-1">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {/* Goal Input Section */}
          {!planSteps.length && !isPlanning && (
            <div className="max-w-4xl mx-auto">
              <div className="bg-[#252526] border border-[#3c3c3c] rounded-lg p-6">
                <h3 className="text-[#cccccc] text-lg font-medium mb-4">What do you want the assistant to help you achieve?</h3>
                <div className="relative">
                  <textarea
                    value={goal}
                    onChange={(e) => setGoal(e.target.value)}
                    placeholder="Describe your goal in detail... (e.g., 'Help me analyze our documentation structure and recommend improvements for better user experience')"
                    className="w-full p-3 bg-[#1e1e1e] border border-[#3c3c3c] rounded text-[#cccccc] placeholder-[#9d9d9d] focus:border-[#007acc] focus:outline-none resize-none"
                    rows={4}
                  />
                  <button
                    onClick={handleGoalSubmit}
                    disabled={!goal.trim()}
                    className="absolute bottom-3 right-3 bg-[#0e639c] hover:bg-[#1177bb] disabled:bg-[#3c3c3c] disabled:text-[#9d9d9d] text-white p-2 rounded transition-colors"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Planning Phase */}
          {isPlanning && (
            <div className="max-w-4xl mx-auto">
              <div className="bg-[#252526] border border-[#3c3c3c] rounded-lg p-6 text-center">
                <div className="flex items-center justify-center space-x-3 mb-4">
                  <Brain className="w-6 h-6 text-[#007acc] animate-pulse" />
                  <h3 className="text-[#cccccc] text-lg font-medium">Planning steps...</h3>
                </div>
                <div className="flex items-center justify-center space-x-4 text-[#9d9d9d] text-sm">
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
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Left Column - Progress Timeline */}
              <div className="lg:col-span-1">
                <div className="bg-[#252526] border border-[#3c3c3c] rounded-lg p-4">
                  <h3 className="text-[#cccccc] font-medium mb-4">Live Progress Log</h3>
                  <div className="space-y-3">
                    {planSteps.map((step, index) => (
                      <div key={step.id} className="flex items-start space-x-3">
                        <div className="flex-shrink-0 mt-1">
                          {step.status === 'completed' ? (
                            <CheckCircle className="w-4 h-4 text-green-400" />
                          ) : step.status === 'running' ? (
                            <Loader2 className="w-4 h-4 text-[#007acc] animate-spin" />
                          ) : (
                            <div className="w-4 h-4 border-2 border-[#3c3c3c] rounded-full" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="text-[#cccccc] text-sm font-medium">{step.title}</div>
                          {step.details && (
                            <div className="text-[#9d9d9d] text-xs mt-1">{step.details}</div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="mt-4">
                    <div className="flex items-center justify-between text-xs text-[#9d9d9d] mb-2">
                      <span>Progress</span>
                      <span>{Math.round(((currentStep + 1) / planSteps.length) * 100)}%</span>
                    </div>
                    <div className="w-full bg-[#3c3c3c] rounded-full h-1">
                      <div 
                        className="bg-[#007acc] h-1 rounded-full transition-all duration-500"
                        style={{ width: `${((currentStep + 1) / planSteps.length) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Columns - Output Tabs */}
              <div className="lg:col-span-2">
                {outputTabs.length > 0 && (
                  <div className="bg-[#252526] border border-[#3c3c3c] rounded-lg overflow-hidden">
                    {/* Tab Headers */}
                    <div className="border-b border-[#3c3c3c] bg-[#2d2d30]">
                      <div className="flex overflow-x-auto">
                        {outputTabs.map(tab => {
                          const Icon = tab.icon;
                          return (
                            <button
                              key={tab.id}
                              onClick={() => setActiveTab(tab.id)}
                              className={`flex items-center space-x-2 px-4 py-3 border-b-2 transition-colors whitespace-nowrap text-sm ${
                                activeTab === tab.id
                                  ? 'border-[#007acc] text-[#007acc] bg-[#1e1e1e]'
                                  : 'border-transparent text-[#9d9d9d] hover:text-[#cccccc] hover:bg-[#3c3c3c]'
                              }`}
                            >
                              <Icon className="w-4 h-4" />
                              <span>{tab.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Tab Content */}
                    <div className="p-4">
                      {outputTabs.find(tab => tab.id === activeTab) && (
                        <div className="prose prose-sm max-w-none">
                          {activeTab === 'qa' ? (
                            <div>
                              <div className="whitespace-pre-wrap text-[#cccccc] mb-4 text-sm">
                                {outputTabs.find(tab => tab.id === activeTab)?.content}
                              </div>
                              {showFollowUp && (
                                <div className="border-t border-[#3c3c3c] pt-4">
                                  <div className="flex space-x-2">
                                    <input
                                      type="text"
                                      value={followUpQuestion}
                                      onChange={(e) => setFollowUpQuestion(e.target.value)}
                                      placeholder="Ask a follow-up question..."
                                      className="flex-1 p-2 bg-[#1e1e1e] border border-[#3c3c3c] rounded text-[#cccccc] placeholder-[#9d9d9d] focus:border-[#007acc] focus:outline-none text-sm"
                                      onKeyPress={(e) => e.key === 'Enter' && handleFollowUp()}
                                    />
                                    <button
                                      onClick={handleFollowUp}
                                      disabled={!followUpQuestion.trim()}
                                      className="px-3 py-2 bg-[#0e639c] hover:bg-[#1177bb] disabled:bg-[#3c3c3c] text-white rounded transition-colors"
                                    >
                                      <Plus className="w-4 h-4" />
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="whitespace-pre-wrap text-[#cccccc] text-sm">
                              {outputTabs.find(tab => tab.id === activeTab)?.content.split('\n').map((line, index) => {
                                if (line.startsWith('### ')) {
                                  return <h3 key={index} className="text-base font-medium text-[#cccccc] mt-4 mb-2">{line.substring(4)}</h3>;
                                } else if (line.startsWith('## ')) {
                                  return <h2 key={index} className="text-lg font-medium text-[#cccccc] mt-6 mb-3">{line.substring(3)}</h2>;
                                } else if (line.startsWith('# ')) {
                                  return <h1 key={index} className="text-xl font-medium text-[#cccccc] mt-8 mb-4">{line.substring(2)}</h1>;
                                } else if (line.startsWith('- **')) {
                                  const match = line.match(/- \*\*(.*?)\*\*: (.*)/);
                                  if (match) {
                                    return <p key={index} className="mb-2 text-[#cccccc]"><span className="text-[#007acc] font-medium">{match[1]}:</span> {match[2]}</p>;
                                  }
                                } else if (line.startsWith('- ')) {
                                  return <p key={index} className="mb-1 ml-4 text-[#cccccc]">• {line.substring(2)}</p>;
                                } else if (line.trim()) {
                                  return <p key={index} className="mb-2 text-[#cccccc]">{line}</p>;
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
                  <div className="mt-4 flex space-x-2">
                    <button
                      onClick={replaySteps}
                      className="flex items-center space-x-2 px-3 py-2 bg-[#0e639c] hover:bg-[#1177bb] text-white rounded text-sm transition-colors"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>Replay Steps</span>
                    </button>
                    <button
                      onClick={exportPlan}
                      className="flex items-center space-x-2 px-3 py-2 bg-[#0e639c] hover:bg-[#1177bb] text-white rounded text-sm transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      <span>Export Plan</span>
                    </button>
                    <button
                      onClick={() => alert('Added to Confluence!')}
                      className="flex items-center space-x-2 px-3 py-2 bg-[#0e639c] hover:bg-[#1177bb] text-white rounded text-sm transition-colors"
                    >
                      <FileText className="w-4 h-4" />
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