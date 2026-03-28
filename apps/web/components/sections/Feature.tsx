import {
    Mic,
    Brain,
    Volume2,
    Clock,
    BookOpen,
    Phone,
    BarChart2,
    Zap,
    Shield,
  } from 'lucide-react'
  
  const FEATURES = [
    {
      icon: Mic,
      title: 'Real-time STT',
      description:
        'Azure Cognitive Speech streams audio with sub-200ms latency. Your agent hears and responds while the caller is still speaking.',
      highlight: true,
    },
    {
      icon: Brain,
      title: 'LLM-powered responses',
      description:
        'Groq-powered Llama 3.3 70B gives human-quality answers grounded in your knowledge base — every time, on every call.',
      highlight: false,
    },
    {
      icon: Volume2,
      title: 'Natural TTS',
      description:
        'Azure Neural TTS converts responses to natural speech sentence-by-sentence, so callers hear answers as they are generated — not after.',
      highlight: true,
    },
    {
      icon: BookOpen,
      title: 'Knowledge base',
      description:
        'Upload PDFs, Word docs, or plain text. Your agent reads everything and cites it accurately. No hallucinations from your own docs.',
      highlight: false,
    },
    {
      icon: Clock,
      title: '24/7 availability',
      description:
        'No shifts, no sick days, no hold music. Your agent picks up every call instantly — at 3am on a Sunday the same as 9am Monday.',
      highlight: false,
    },
    {
      icon: Phone,
      title: 'Any phone number',
      description:
        'Use a number from our platform pool or bring your own Twilio number. Assign different agents to different numbers.',
      highlight: false,
    },
    {
      icon: BarChart2,
      title: 'Conversation logs',
      description:
        'Every call is recorded with a full transcript, auto-generated summary, and caller history. Review, edit, and learn.',
      highlight: false,
    },
    {
      icon: Zap,
      title: 'Barge-in detection',
      description:
        'Callers can interrupt mid-response. The agent stops, listens, and responds to the new input — just like a human would.',
      highlight: true,
    },
    {
      icon: Shield,
      title: 'Secure by design',
      description:
        'Row-level security on every table. Service role key never touches the frontend. Your data stays yours.',
      highlight: false,
    },
  ]
  
  export function Features() {
    return (
      <section id="features" className="section py-24 lg:py-32">
        <div className="container-wide">
          {/* Header */}
          <div className="mb-16 text-center">
            <span className="inline-block rounded-full border border-brand-500/20 bg-brand-500/10 px-3 py-1 text-xs font-medium uppercase tracking-wider text-brand-400">
              Features
            </span>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-content sm:text-4xl lg:text-5xl">
              Everything you need
              <br />
              <span className="text-gradient">nothing you don't</span>
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base text-content-secondary">
              A complete voice AI platform — STT, LLM, TTS, knowledge base, analytics — all wired
              together so you don't have to.
            </p>
          </div>
  
          {/* Feature grid */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map(({ icon: Icon, title, description, highlight }) => (
              <div
                key={title}
                className={`group glass glass-hover relative overflow-hidden rounded-2xl p-6 transition-all ${
                  highlight
                    ? 'border-brand-500/20 hover:border-brand-500/40 hover:shadow-glow-sm'
                    : 'border-white/[0.06] hover:border-white/10'
                }`}
              >
                {/* Subtle glow on highlighted cards */}
                {highlight && (
                  <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-brand-500/10 blur-2xl" />
                )}
  
                <div className="relative">
                  <div
                    className={`mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl ${
                      highlight
                        ? 'bg-brand-500/20 ring-1 ring-brand-500/30'
                        : 'bg-white/5 ring-1 ring-white/10'
                    }`}
                  >
                    <Icon
                      className={`h-5 w-5 ${highlight ? 'text-brand-400' : 'text-content-secondary'}`}
                    />
                  </div>
                  <h3 className="mb-2 text-base font-semibold text-content">{title}</h3>
                  <p className="text-sm leading-relaxed text-content-secondary">{description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }