import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Brain, Zap, MessageSquare, Check, RefreshCw } from 'lucide-react'

interface DemoStep {
  type: 'perception' | 'reasoning' | 'planning' | 'execution'
  title: string
  description: string
  details: string[]
  icon: React.ReactNode
  color: string
}

export function ProactiveAgentDemo() {
  const [demoState, setDemoState] = useState<'idle' | 'running' | 'completed'>('idle')
  const [currentStep, setCurrentStep] = useState(0)

  const demoSequence: DemoStep[] = [
    {
      type: 'perception',
      title: 'Stage 1: Perceive',
      description: 'Agent receives live transcript',
      details: [
        'Patient: "The new blood pressure medication is fine..."',
        'Patient: "...but I\'m still getting those headaches..."',
        '→ Real-time text streaming in',
      ],
      icon: <MessageSquare className="w-6 h-6" />,
      color: 'from-blue-500 to-cyan-500',
    },
    {
      type: 'reasoning',
      title: 'Stage 1: Reason - Extract Context',
      description: 'Analyze clinical keywords',
      details: [
        '🏷️ Symptom: "headache" (confidence: 0.85)',
        '💊 Medication: "blood_pressure" (confidence: 0.85)',
        '⏰ Time: "last time"',
        'Dominant Context: ["headache", "blood_pressure"]',
      ],
      icon: <Brain className="w-6 h-6" />,
      color: 'from-purple-500 to-pink-500',
    },
    {
      type: 'planning',
      title: 'Stage 1: Plan - Pre-fetch Reports',
      description: 'Query EHR database autonomously',
      details: [
        '🔍 Query: searchReports(patient_id, ["headache", "blood_pressure"])',
        '📋 Result 1: Brain MRI Scan (Score: 2/2 tags) ✨ RANKED #1',
        '📋 Result 2: Blood Pressure Log (Score: 1/2 tags)',
        '✅ Ready to display: Both reports pre-fetched in memory',
      ],
      icon: <Zap className="w-6 h-6" />,
      color: 'from-yellow-500 to-orange-500',
    },
    {
      type: 'execution',
      title: 'Doctor Speaks & Stage 2: Execute',
      description: 'Agent instantly displays the right report',
      details: [
        'Doctor: "Hmm, headaches persisting. Let\'s see your reports."',
        '🎯 Intent Detected: "see" + "reports"',
        '🧠 AI Reasoning: Context is "headache" → Show Brain MRI',
        '✨ Brain MRI INSTANTLY appears on screen',
      ],
      icon: <Check className="w-6 h-6" />,
      color: 'from-green-500 to-emerald-500',
    },
  ]

  const runDemo = async () => {
    setDemoState('running')
    setCurrentStep(0)

    for (let i = 0; i < demoSequence.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 2500))
      setCurrentStep(i + 1)
    }

    await new Promise(resolve => setTimeout(resolve, 1500))
    setDemoState('completed')
  }

  const resetDemo = () => {
    setDemoState('idle')
    setCurrentStep(0)
  }

  return (
    <div className="w-full h-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8 rounded-2xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">
          🚀 Proactive Report Fetcher Agent
        </h1>
        <p className="text-lg text-slate-400">
          Watch how the agent thinks, reasons, and acts in real-time
        </p>
      </div>

      {/* Demo Container */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Timeline */}
        <div className="lg:col-span-2">
          <div className="space-y-4">
            <AnimatePresence mode="wait">
              {demoSequence.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`relative ${
                    index < currentStep ? 'opacity-50' : 'opacity-100'
                  }`}
                >
                  <div
                    className={`bg-gradient-to-r ${step.color} p-px rounded-lg transition-all duration-300 ${
                      index === currentStep - 1
                        ? 'ring-2 ring-white shadow-2xl'
                        : 'opacity-60'
                    }`}
                  >
                    <div className="bg-slate-800 rounded-lg p-6">
                      {/* Step Header */}
                      <div className="flex items-start gap-4 mb-4">
                        <div className="flex-shrink-0">
                          <div
                            className={`bg-gradient-to-r ${step.color} p-3 rounded-lg text-white`}
                          >
                            {step.icon}
                          </div>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-white">
                            {step.title}
                          </h3>
                          <p className="text-sm text-slate-400">
                            {step.description}
                          </p>
                        </div>
                        {index < currentStep && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="flex-shrink-0 bg-green-500 rounded-full p-1 text-white"
                          >
                            <Check className="w-5 h-5" />
                          </motion.div>
                        )}
                      </div>

                      {/* Details */}
                      {(index <= currentStep || demoState === 'completed') && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          transition={{ duration: 0.3 }}
                          className="space-y-2 text-sm text-slate-300"
                        >
                          {step.details.map((detail, i) => (
                            <motion.div
                              key={i}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: i * 0.1 }}
                              className="flex items-start gap-3"
                            >
                              <span className="text-slate-500 mt-0.5">→</span>
                              <span>{detail}</span>
                            </motion.div>
                          ))}
                        </motion.div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Control Panel */}
        <div className="space-y-6">
          {/* Progress */}
          <div className="bg-slate-700/50 rounded-lg p-6 border border-slate-600">
            <h3 className="text-sm font-semibold text-slate-300 mb-4">PROGRESS</h3>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-xs text-slate-400">Pipeline</span>
                  <span className="text-xs text-slate-300 font-mono">
                    {currentStep} / {demoSequence.length}
                  </span>
                </div>
                <motion.div className="h-2 bg-slate-600 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"
                    initial={{ width: 0 }}
                    animate={{
                      width: `${(currentStep / demoSequence.length) * 100}%`,
                    }}
                    transition={{ duration: 0.5 }}
                  />
                </motion.div>
              </div>

              {/* Status */}
              <div className="text-xs text-slate-400 font-mono mt-4">
                Status:{' '}
                <span
                  className={`font-semibold ${
                    demoState === 'running'
                      ? 'text-yellow-400'
                      : demoState === 'completed'
                        ? 'text-green-400'
                        : 'text-slate-300'
                  }`}
                >
                  {demoState === 'idle' && '⏹️ READY'}
                  {demoState === 'running' && '▶️ PROCESSING'}
                  {demoState === 'completed' && '✅ COMPLETE'}
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <button
              onClick={runDemo}
              disabled={demoState !== 'idle'}
              className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
            >
              <Zap className="w-4 h-4" />
              Start Demo
            </button>

            {demoState !== 'idle' && (
              <button
                onClick={resetDemo}
                className="w-full px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Reset
              </button>
            )}
          </div>

          {/* Key Insights */}
          <div className="bg-slate-700/50 rounded-lg p-6 border border-slate-600 space-y-3">
            <h3 className="text-sm font-semibold text-slate-300">💡 KEY INSIGHTS</h3>
            <div className="space-y-2 text-xs text-slate-400">
              <p>
                ✨ <span className="text-slate-300">Stage 1</span> runs silently in
                background
              </p>
              <p>
                ⚡ <span className="text-slate-300">Stage 2</span> executes instantly
                on trigger
              </p>
              <p>
                🎯 <span className="text-slate-300">Context</span> determines the exact
                report
              </p>
              <p>
                🧠 <span className="text-slate-300">AI Reasoning</span> is transparent
                to user
              </p>
            </div>
          </div>

          {/* The Wow Moment */}
          {demoState === 'completed' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/50 rounded-lg p-6"
            >
              <h3 className="text-sm font-bold text-green-400 mb-2">🎬 THE WOW MOMENT</h3>
              <p className="text-xs text-green-200 leading-relaxed">
                The doctor finished saying "reports" and before they even finished their
                thought, the exact document they needed appeared on screen. No search. No
                clicking. No waiting. Just instant context-aware assistance.
              </p>
            </motion.div>
          )}
        </div>
      </div>

      {/* Information Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-8 bg-slate-700/50 border border-slate-600 rounded-lg p-4"
      >
        <p className="text-sm text-slate-400">
          <span className="text-slate-300 font-semibold">Architecture:</span> The agent
          runs a 4-stage loop: Perceive (receive transcript) → Reason (extract context) →
          Plan (pre-fetch reports) → Execute (display on command). All processing is
          non-blocking and optimized for instant response.
        </p>
      </motion.div>
    </div>
  )
}
