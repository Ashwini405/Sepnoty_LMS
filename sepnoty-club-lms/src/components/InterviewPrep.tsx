import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Target, ChevronDown, ChevronRight, CheckCircle,
  Lightbulb, Code, Briefcase, Users, Brain, Play
} from 'lucide-react'

interface Question {
  id: string
  question: string
  answer: string
  tips: string[]
  category: string
}

export default function InterviewPrep() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [expandedQuestion, setExpandedQuestion] = useState < string | null > (null)
  const [completed, setCompleted] = useState < string[] > ([])

  const categories = [
    { id: 'all', label: 'All Questions', icon: Brain },
    { id: 'behavioral', label: 'Behavioral', icon: Users },
    { id: 'technical', label: 'Technical', icon: Code },
    { id: 'situational', label: 'Situational', icon: Briefcase },
  ]

  const questions: Question[] = [
    {
      id: '1',
      category: 'behavioral',
      question: 'Tell me about yourself.',
      answer: 'I\'m a [Your Role] with [X years] of experience in [Industry/Field]. I\'ve worked on [key projects/achievements] and I\'m passionate about [relevant interests]. Currently, I\'m looking to [your career goal] at a company like yours because [specific reason].',
      tips: [
        'Keep it under 2 minutes',
        'Focus on professional experience',
        'End with why you\'re interested in this role',
        'Practice your delivery to sound natural'
      ]
    },
    {
      id: '2',
      category: 'behavioral',
      question: 'What is your greatest strength?',
      answer: 'My greatest strength is [specific skill]. For example, in my previous role at [Company], I [specific example demonstrating this strength]. This resulted in [measurable outcome].',
      tips: [
        'Choose a strength relevant to the job',
        'Back it up with a specific example',
        'Quantify results when possible',
        'Be confident but not arrogant'
      ]
    },
    {
      id: '3',
      category: 'behavioral',
      question: 'What is your greatest weakness?',
      answer: 'I\'ve found that [genuine weakness] has been a challenge for me. To address this, I\'ve [specific steps taken to improve]. For instance, [example of improvement].',
      tips: [
        'Choose a real weakness that isn\'t critical to the job',
        'Show self-awareness',
        'Demonstrate steps you\'re taking to improve',
        'Avoid clichés like "I\'m a perfectionist"'
      ]
    },
    {
      id: '4',
      category: 'technical',
      question: 'Explain the difference between REST and GraphQL.',
      answer: 'REST (Representational State Transfer) uses fixed endpoints that return predetermined data structures. GraphQL is a query language that allows clients to request exactly the data they need. REST is simpler and has better caching, while GraphQL reduces over-fetching and allows for more flexible queries.',
      tips: [
        'Know the pros and cons of each',
        'Be ready to discuss when to use which',
        'Mention practical experience if you have it',
        'Understand concepts like over-fetching and under-fetching'
      ]
    },
    {
      id: '5',
      category: 'technical',
      question: 'What is the difference between == and === in JavaScript?',
      answer: '== is the loose equality operator that performs type coercion before comparison. === is the strict equality operator that checks both value and type without coercion. For example, "5" == 5 is true, but "5" === 5 is false.',
      tips: [
        'Always prefer === for predictable comparisons',
        'Understand type coercion rules',
        'Give practical examples',
        'Mention edge cases like null == undefined'
      ]
    },
    {
      id: '6',
      category: 'situational',
      question: 'Describe a time you had to deal with a difficult coworker.',
      answer: 'In my previous role, I worked with a colleague who had a different communication style. I scheduled a one-on-one meeting to understand their perspective and found common ground. We established clear communication protocols, which improved our collaboration and project outcomes.',
      tips: [
        'Use the STAR method (Situation, Task, Action, Result)',
        'Stay professional - never badmouth colleagues',
        'Focus on what you learned',
        'Emphasize the positive outcome'
      ]
    },
    {
      id: '7',
      category: 'situational',
      question: 'Tell me about a time you failed.',
      answer: 'During a project at [Company], I underestimated the timeline for [specific task]. As a result, we missed an internal deadline. I took responsibility, communicated transparently with stakeholders, and implemented better estimation practices. Since then, I\'ve consistently delivered projects on time.',
      tips: [
        'Choose a real failure, not a humble brag',
        'Take responsibility - don\'t blame others',
        'Focus on what you learned',
        'Show how you\'ve grown from the experience'
      ]
    },
    {
      id: '8',
      category: 'behavioral',
      question: 'Why do you want to work here?',
      answer: 'I\'m excited about [Company] because of [specific reason - culture, mission, products]. My experience in [relevant area] aligns well with [company\'s goal/project], and I believe I can contribute to [specific impact]. I\'m also drawn to [another specific aspect of the company].',
      tips: [
        'Research the company thoroughly',
        'Be specific - avoid generic answers',
        'Connect your skills to their needs',
        'Show genuine enthusiasm'
      ]
    },
  ]

  const filteredQuestions = questions.filter(q =>
    selectedCategory === 'all' || q.category === selectedCategory
  )

  const toggleComplete = (id: string) => {
    setCompleted(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    )
  }

  return (
    <div className="min-h-screen bg-background pt-24 pb-12">
      <div className="max-w-5xl mx-auto px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            Interview <span className="gradient-text">Preparation</span>
          </h1>
          <p className="text-muted">Practice common interview questions with expert answers</p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {categories.map((cat, i) => (
            <motion.button
              key={cat.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedCategory(cat.id)}
              className={`p-4 rounded-2xl text-left transition-all ${selectedCategory === cat.id
                  ? 'gradient-bg text-white shadow-lg shadow-primary/25'
                  : 'bg-surface text-foreground hover:bg-border'
                }`}
            >
              <cat.icon className={`w-6 h-6 mb-2 ${selectedCategory === cat.id ? 'text-white' : 'text-primary'}`} />
              <span className="font-medium text-sm">{cat.label}</span>
            </motion.button>
          ))}
        </div>

        <div className="bg-surface rounded-2xl p-4 mb-8">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted">Progress</span>
            <span className="text-sm font-medium text-foreground">{completed.length}/{questions.length} completed</span>
          </div>
          <div className="h-2 bg-border rounded-full mt-2 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(completed.length / questions.length) * 100}%` }}
              className="h-full gradient-bg rounded-full"
            />
          </div>
        </div>

        <div className="space-y-4">
          {filteredQuestions.map((q, i) => (
            <motion.div
              key={q.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`bg-surface rounded-2xl overflow-hidden border transition-all ${completed.includes(q.id) ? 'border-success/50' : 'border-border hover:border-primary/50'
                }`}
            >
              <button
                onClick={() => setExpandedQuestion(expandedQuestion === q.id ? null : q.id)}
                className="w-full p-5 flex items-center justify-between text-left"
              >
                <div className="flex items-center gap-4">
                  <button
                    onClick={(e) => { e.stopPropagation(); toggleComplete(q.id); }}
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${completed.includes(q.id)
                        ? 'bg-success border-success'
                        : 'border-border hover:border-primary'
                      }`}
                  >
                    {completed.includes(q.id) && <CheckCircle className="w-4 h-4 text-white" />}
                  </button>
                  <div>
                    <span className="text-xs text-primary font-medium capitalize mb-1 block">
                      {q.category}
                    </span>
                    <h3 className="font-semibold text-foreground">{q.question}</h3>
                  </div>
                </div>
                {expandedQuestion === q.id ? (
                  <ChevronDown className="w-5 h-5 text-muted flex-shrink-0" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-muted flex-shrink-0" />
                )}
              </button>

              <AnimatePresence>
                {expandedQuestion === q.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-5 pt-0">
                      <div className="p-4 bg-primary/5 rounded-xl mb-4">
                        <h4 className="font-medium text-foreground mb-2 flex items-center gap-2">
                          <Play className="w-4 h-4 text-primary" />
                          Sample Answer
                        </h4>
                        <p className="text-muted text-sm leading-relaxed">{q.answer}</p>
                      </div>

                      <div className="p-4 bg-warning/5 rounded-xl">
                        <h4 className="font-medium text-foreground mb-2 flex items-center gap-2">
                          <Lightbulb className="w-4 h-4 text-warning" />
                          Pro Tips
                        </h4>
                        <ul className="space-y-2">
                          {q.tips.map((tip, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-muted">
                              <CheckCircle className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
                              {tip}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
