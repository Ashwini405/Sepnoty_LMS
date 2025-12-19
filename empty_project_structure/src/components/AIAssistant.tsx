import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Send, Sparkles, User, Loader2, Copy, Check,
  ThumbsUp, ThumbsDown, RefreshCw, Lightbulb, BookOpen, Code, Calculator
} from 'lucide-react'
import { useAuth } from '../App'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export default function AIAssistant() {
  const { user } = useAuth()
  const [messages, setMessages] = useState < Message[] > ([
    {
      id: '1',
      role: 'assistant',
      content: `Hi ${user?.name?.split(' ')[0] || 'there'}! 👋 I'm your AI tutor. I can help you with:\n\n• **Explaining concepts** in any subject\n• **Solving problems** step by step\n• **Creating study plans** tailored to you\n• **Generating practice questions**\n\nWhat would you like to learn today?`,
      timestamp: new Date()
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [copiedId, setCopiedId] = useState < string | null > (null)
  const messagesEndRef = useRef < HTMLDivElement > (null)

  const quickPrompts = [
    { icon: Lightbulb, text: 'Explain quantum physics simply', color: 'bg-primary/10 text-primary' },
    { icon: Code, text: 'Help me with React hooks', color: 'bg-success/10 text-success' },
    { icon: Calculator, text: 'Solve a calculus problem', color: 'bg-warning/10 text-warning' },
    { icon: BookOpen, text: 'Create a study plan', color: 'bg-danger/10 text-danger' },
  ]

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const res = await fetch('api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage.content,
          userId: user?.id
        })
      })
      const data = await res.json().catch(() => ({}))

      const aiResponse = data.response || generateMockResponse(userMessage.content)

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, aiMessage])
    } catch (err) {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: generateMockResponse(userMessage.content),
        timestamp: new Date()
      }
      setMessages(prev => [...prev, aiMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const generateMockResponse = (query: string): string => {
    const lowerQuery = query.toLowerCase()

    if (lowerQuery.includes('react') || lowerQuery.includes('hooks')) {
      return `Great question about React! 🚀\n\n**React Hooks** are functions that let you use state and other React features in functional components.\n\n**Common Hooks:**\n\n1. **useState** - For managing local state\n\`\`\`javascript\nconst [count, setCount] = useState(0);\n\`\`\`\n\n2. **useEffect** - For side effects (API calls, subscriptions)\n\`\`\`javascript\nuseEffect(() => {\n  document.title = \`Count: \${count}\`;\n}, [count]);\n\`\`\`\n\n3. **useContext** - For consuming context\n\n4. **useRef** - For mutable values that persist across renders\n\nWould you like me to explain any of these in more detail?`
    }

    if (lowerQuery.includes('quantum') || lowerQuery.includes('physics')) {
      return `Let me explain quantum physics in simple terms! ⚛️\n\n**Quantum physics** is like the rulebook for the tiniest things in our universe - atoms and particles even smaller!\n\n**Key Concepts:**\n\n1. **Wave-Particle Duality** 🌊\n   - Things can be both waves AND particles at the same time\n   - Like being in two places at once!\n\n2. **Superposition** 🎭\n   - A particle can exist in multiple states until we observe it\n   - Schrödinger's cat: both alive AND dead until you check!\n\n3. **Quantum Entanglement** 🔗\n   - Two particles can be connected, so changing one instantly affects the other\n   - Einstein called it "spooky action at a distance"\n\nWant me to dive deeper into any of these concepts?`
    }

    if (lowerQuery.includes('calculus') || lowerQuery.includes('math') || lowerQuery.includes('solve')) {
      return `I'd love to help with calculus! 📐\n\n**Common Calculus Topics:**\n\n1. **Derivatives** - Rate of change\n   - Power Rule: d/dx(xⁿ) = nxⁿ⁻¹\n   - Example: d/dx(x³) = 3x²\n\n2. **Integrals** - Area under curves\n   - ∫xⁿ dx = xⁿ⁺¹/(n+1) + C\n\n3. **Limits** - What happens as x approaches a value\n\n**Try this problem:**\nFind the derivative of f(x) = 3x² + 2x - 5\n\n**Solution:**\n- f'(x) = 6x + 2\n\nWant me to walk through a specific problem? Just share it!`
    }

    if (lowerQuery.includes('study') || lowerQuery.includes('plan')) {
      return `Let me help you create an effective study plan! 📚\n\n**Your Personalized Study Plan:**\n\n**1. Set Clear Goals**\n   - What do you want to achieve?\n   - By when?\n\n**2. Daily Schedule Template:**\n\`\`\`\n🌅 Morning (2 hrs): Core subjects\n☀️ Afternoon (1.5 hrs): Practice problems\n🌙 Evening (1 hr): Review & revise\n\`\`\`\n\n**3. Study Techniques:**\n   - 📍 Pomodoro: 25 min study, 5 min break\n   - 🔄 Spaced Repetition: Review at intervals\n   - ✍️ Active Recall: Test yourself\n\n**4. Weekly Review:**\n   - Sundays: Assess what worked\n   - Adjust plan as needed\n\nWould you like me to create a specific plan for a subject you're studying?`
    }

    return `Thanks for your question! 🎓\n\nI understand you're asking about: **"${query}"**\n\nHere's what I can help you with:\n\n1. **Break down complex concepts** into simple explanations\n2. **Provide examples** to illustrate ideas\n3. **Create practice exercises** for better understanding\n4. **Suggest resources** for further learning\n\nCould you tell me more about what specific aspect you'd like to explore? I'm here to help you learn! 💡`
  }

  const handleQuickPrompt = (text: string) => {
    setInput(text)
  }

  const copyToClipboard = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const formatMessage = (content: string) => {
    const parts = content.split(/(```[\s\S]*?```)/g)

    return parts.map((part, i) => {
      if (part.startsWith('```') && part.endsWith('```')) {
        const code = part.slice(3, -3)
        const [lang, ...codeLines] = code.split('\n')
        const codeContent = codeLines.join('\n').trim()

        return (
          <div key={i} className="my-3 rounded-xl overflow-hidden bg-foreground/5">
            <div className="flex items-center justify-between px-4 py-2 bg-foreground/10">
              <span className="text-xs text-muted">{lang || 'code'}</span>
              <button
                onClick={() => copyToClipboard(codeContent, `code-${i}`)}
                className="text-muted hover:text-foreground transition-colors"
              >
                {copiedId === `code-${i}` ? (
                  <Check className="w-4 h-4 text-success" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
            <pre className="p-4 overflow-x-auto text-sm">
              <code>{codeContent}</code>
            </pre>
          </div>
        )
      }

      return (
        <span key={i} className="whitespace-pre-wrap">
          {part.split(/(\*\*.*?\*\*)/g).map((text, j) => {
            if (text.startsWith('**') && text.endsWith('**')) {
              return <strong key={j}>{text.slice(2, -2)}</strong>
            }
            return text
          })}
        </span>
      )
    })
  }

  return (
    <div className="min-h-screen bg-background pt-20 pb-4">
      <div className="max-w-4xl mx-auto h-[calc(100vh-6rem)] flex flex-col px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-4"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-2">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">AI Tutor</span>
          </div>
          <h1 className="text-2xl font-bold text-foreground">How can I help you learn today?</h1>
        </motion.div>

        {messages.length === 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-2 gap-3 mb-4"
          >
            {quickPrompts.map((prompt, i) => (
              <motion.button
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                onClick={() => handleQuickPrompt(prompt.text)}
                className={`${prompt.color} p-4 rounded-xl text-left hover:scale-[1.02] transition-transform`}
              >
                <prompt.icon className="w-5 h-5 mb-2" />
                <span className="text-sm font-medium">{prompt.text}</span>
              </motion.button>
            ))}
          </motion.div>
        )}

        <div className="flex-1 overflow-y-auto space-y-4 pb-4 scrollbar-hide">
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : ''}`}
              >
                {message.role === 'assistant' && (
                  <div className="w-10 h-10 gradient-bg rounded-xl flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                )}
                <div className={`max-w-[80%] ${message.role === 'user' ? 'order-first' : ''}`}>
                  <div className={`rounded-2xl px-4 py-3 ${message.role === 'user'
                      ? 'gradient-bg text-white rounded-tr-none'
                      : 'bg-surface text-foreground rounded-tl-none'
                    }`}>
                    <div className="text-sm leading-relaxed">
                      {formatMessage(message.content)}
                    </div>
                  </div>
                  {message.role === 'assistant' && (
                    <div className="flex items-center gap-2 mt-2 ml-2">
                      <button
                        onClick={() => copyToClipboard(message.content, message.id)}
                        className="p-1.5 rounded-lg hover:bg-surface text-muted hover:text-foreground transition-colors"
                      >
                        {copiedId === message.id ? (
                          <Check className="w-4 h-4 text-success" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                      <button className="p-1.5 rounded-lg hover:bg-surface text-muted hover:text-success transition-colors">
                        <ThumbsUp className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 rounded-lg hover:bg-surface text-muted hover:text-danger transition-colors">
                        <ThumbsDown className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 rounded-lg hover:bg-surface text-muted hover:text-foreground transition-colors">
                        <RefreshCw className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
                {message.role === 'user' && (
                  <div className="w-10 h-10 bg-surface rounded-xl flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5 text-muted" />
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-3"
            >
              <div className="w-10 h-10 gradient-bg rounded-xl flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div className="bg-surface rounded-2xl rounded-tl-none px-4 py-3">
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-primary" />
                  <span className="text-sm text-muted">Thinking...</span>
                </div>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit}
          className="relative bg-surface rounded-2xl border border-border focus-within:border-primary transition-colors"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me anything..."
            className="w-full px-5 py-4 pr-14 bg-transparent outline-none text-foreground placeholder:text-muted"
          />
          <motion.button
            type="submit"
            disabled={!input.trim() || isLoading}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 gradient-bg rounded-xl flex items-center justify-center text-white disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/25"
          >
            <Send className="w-5 h-5" />
          </motion.button>
        </motion.form>

        <p className="text-center text-xs text-muted mt-3">
          AI responses are generated to help with learning. Always verify important information.
        </p>
      </div>
    </div>
  )
}
