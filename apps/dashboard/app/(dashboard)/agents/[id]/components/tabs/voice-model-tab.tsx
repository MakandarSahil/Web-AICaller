'use client'

import React, { useEffect, useMemo, useRef, useState } from 'react'
import {
  Badge,
  Button,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
} from '@aicaller/ui'
import { Cpu, Loader2, Mic, Square, Volume2 } from 'lucide-react'
import type { getAgent } from '@aicaller/supabase/queries'
import { useUpdateAgent } from '@/hooks/use-agents'
import { previewAgentVoice } from '@aicaller/api-client'

type Agent = NonNullable<Awaited<ReturnType<typeof getAgent>>>

const LLM_MODEL_OPTIONS = [
  { value: 'llama-3.3-70b-versatile', label: 'llama-3.3-70b-versatile', hint: 'Default' },
  { value: 'llama-3.1-8b-instant', label: 'llama-3.1-8b-instant', hint: 'Faster' },
  { value: 'mixtral-8x7b-32768', label: 'mixtral-8x7b-32768', hint: 'Large context' },
]

const TTS_VOICE_OPTIONS = [
  { value: 'en-IN-PrabhatNeural', label: 'en-IN-PrabhatNeural', hint: 'Default' },
  { value: 'en-US-JennyNeural', label: 'en-US-JennyNeural', hint: 'US female' },
  { value: 'en-US-AriaNeural', label: 'en-US-AriaNeural', hint: 'US female' },
  { value: 'en-US-GuyNeural', label: 'en-US-GuyNeural', hint: 'US male' },
  { value: 'en-GB-SoniaNeural', label: 'en-GB-SoniaNeural', hint: 'UK female' },
  { value: 'hi-IN-SwaraNeural', label: 'hi-IN-SwaraNeural', hint: 'Hindi female' },
  { value: 'hi-IN-MadhurNeural', label: 'hi-IN-MadhurNeural', hint: 'Hindi male' },
  { value: 'mr-IN-AarohiNeural', label: 'mr-IN-AarohiNeural', hint: 'Marathi female' },
  { value: 'mr-IN-ManoharNeural', label: 'mr-IN-ManoharNeural', hint: 'Marathi male' },
  { value: 'en-AU-NatashaNeural', label: 'en-AU-NatashaNeural', hint: 'Australia' },
]

const STT_PROVIDER_OPTIONS = [{ value: 'azure', label: 'Azure Speech', hint: 'Current backend' }]
const TTS_PROVIDER_OPTIONS = [{ value: 'azure', label: 'Azure Neural', hint: 'Current backend' }]
const LLM_PROVIDER_OPTIONS = [{ value: 'groq', label: 'Groq', hint: 'Current backend' }]

const STT_MODEL_OPTIONS = [
  { value: 'default', label: 'default', hint: 'Global fallback' },
  { value: 'en-US', label: 'en-US', hint: 'English (US)' },
  { value: 'en-IN', label: 'en-IN', hint: 'English (India)' },
  { value: 'hi-IN', label: 'hi-IN', hint: 'Hindi (India)' },
  { value: 'mr-IN', label: 'mr-IN', hint: 'Marathi (India)' },
  { value: 'en-GB', label: 'en-GB', hint: 'English (UK)' },
]

const PREVIEW_TEXT_BY_LOCALE: Record<string, string> = {
  'en-IN': 'Namaste! This is your CallMind assistant. How can I help you today?',
  'en-US': 'Hello! This is your CallMind assistant. How can I help you today?',
  'en-GB': 'Hello! This is your CallMind assistant. How can I help you today?',
  'hi-IN': 'नमस्ते! मैं आपका कॉलमाइंड सहायक हूं। मैं आपकी कैसे मदद कर सकता हूं?',
  'mr-IN': 'नमस्कार! मी तुमचा कॉलमाइंड सहाय्यक आहे. मी तुमची कशी मदत करू शकतो?',
}

function getPreviewTextForLocale(locale: string): string {
  return PREVIEW_TEXT_BY_LOCALE[locale] ?? PREVIEW_TEXT_BY_LOCALE['en-IN'] ?? ''
}

interface VoiceModelTabProps {
  agent: Agent
}

export default function VoiceModelTab({ agent }: VoiceModelTabProps) {
  const { mutate: updateAgent, isPending: saving } = useUpdateAgent()

  const [sttProvider, setSttProvider] = useState(agent.stt_provider || 'azure')
  const [sttModel, setSttModel] = useState(agent.stt_model || 'default')
  const [ttsProvider, setTtsProvider] = useState(agent.tts_provider || 'azure')
  const [ttsModel, setTtsModel] = useState(agent.tts_model || 'default')
  const [ttsVoice, setTtsVoice] = useState(agent.tts_voice || 'en-IN-PrabhatNeural')
  const [llmProvider, setLlmProvider] = useState(agent.llm_provider || 'groq')
  const [llmModel, setLlmModel] = useState(agent.llm_model || 'llama-3.3-70b-versatile')
  const [previewText, setPreviewText] = useState(getPreviewTextForLocale('en-IN'))
  const [previewLanguage, setPreviewLanguage] = useState('en-IN')
  const [isPreviewing, setIsPreviewing] = useState(false)
  const [previewError, setPreviewError] = useState<string | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const audioUrlRef = useRef<string | null>(null)

  useEffect(() => {
    setSttProvider(agent.stt_provider || 'azure')
    setSttModel(agent.stt_model || 'default')
    setTtsProvider(agent.tts_provider || 'azure')
    setTtsModel(agent.tts_model || 'default')
    setTtsVoice(agent.tts_voice || 'en-IN-PrabhatNeural')
    setLlmProvider(agent.llm_provider || 'groq')
    setLlmModel(agent.llm_model || 'llama-3.3-70b-versatile')
  }, [agent])

  useEffect(() => {
    const localeMatch = ttsVoice.match(/^([a-z]{2}-[A-Z]{2})-/)
    if (localeMatch?.[1]) {
      setPreviewLanguage(localeMatch[1])
      setPreviewText(getPreviewTextForLocale(localeMatch[1]))
    }
  }, [ttsVoice])

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
      if (audioUrlRef.current) {
        URL.revokeObjectURL(audioUrlRef.current)
        audioUrlRef.current = null
      }
    }
  }, [])

  const isDirty = useMemo(() => {
    return (
      sttProvider !== (agent.stt_provider || 'azure') ||
      sttModel !== (agent.stt_model || 'default') ||
      ttsProvider !== (agent.tts_provider || 'azure') ||
      ttsModel !== (agent.tts_model || 'default') ||
      ttsVoice !== (agent.tts_voice || 'en-IN-PrabhatNeural') ||
      llmProvider !== (agent.llm_provider || 'groq') ||
      llmModel !== (agent.llm_model || 'llama-3.3-70b-versatile')
    )
  }, [
    agent.llm_model,
    agent.llm_provider,
    agent.stt_model,
    agent.stt_provider,
    agent.tts_model,
    agent.tts_provider,
    agent.tts_voice,
    llmModel,
    llmProvider,
    sttModel,
    sttProvider,
    ttsModel,
    ttsProvider,
    ttsVoice,
  ])

  const stackBadges = [
    { label: 'STT', value: sttProvider },
    { label: 'TTS', value: ttsProvider },
    { label: 'LLM', value: llmProvider },
  ]

  const stopPreview = () => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
      audioRef.current = null
    }
    if (audioUrlRef.current) {
      URL.revokeObjectURL(audioUrlRef.current)
      audioUrlRef.current = null
    }
    setIsPreviewing(false)
  }

  const handlePreview = async (options?: { language?: string; text?: string; voice?: string }) => {
    const selectedVoice = options?.voice || ttsVoice
    const text = (options?.text ?? previewText).trim()
    if (!text) {
      setPreviewError('Enter preview text before playing the sample.')
      return
    }

    stopPreview()
    setPreviewError(null)

    try {
      setIsPreviewing(true)
      const audioBlob = await previewAgentVoice(agent.id, text, selectedVoice)
      const url = URL.createObjectURL(audioBlob)
      audioUrlRef.current = url

      const audio = new Audio(url)
      audioRef.current = audio
      audio.onended = () => {
        setIsPreviewing(false)
      }
      audio.onerror = () => {
        setIsPreviewing(false)
        setPreviewError('Unable to play preview in this browser/device.')
      }
      await audio.play()
    } catch {
      setIsPreviewing(false)
      setPreviewError('Preview failed. Check backend is running and Azure credentials are valid.')
    }
  }

  const handleVoiceSelect = (value: string) => {
    setTtsVoice(value)
    const localeMatch = value.match(/^([a-z]{2}-[A-Z]{2})-/)
    const derivedLocale = localeMatch?.[1] || 'en-IN'
    setPreviewLanguage(derivedLocale)
    const languageSample = getPreviewTextForLocale(derivedLocale)
    setPreviewText(languageSample)
    void handlePreview({ language: derivedLocale, voice: value, text: languageSample })
  }

  return (
    <div className="space-y-12">
      
      {/* 1. Model Configuration */}
      <section className="space-y-8">
        <div className="flex flex-col gap-1">
           <h3 className="text-[14px] font-bold text-foreground tracking-tight uppercase">Language Model intelligence</h3>
           <p className="text-[11px] font-medium text-muted-foreground/40 leading-relaxed uppercase tracking-widest">
             Choose the brain of your AI assistant.
           </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
           <div className="space-y-4">
              <div className="flex items-center gap-2 mb-1">
                <Cpu className="h-4 w-4 text-primary opacity-60" />
                <Label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/60">Language Model</Label>
              </div>
              <Select value={llmModel} onValueChange={setLlmModel}>
                <SelectTrigger className="h-12 bg-muted/20 border-border/50 rounded-xl focus:ring-1 focus:ring-primary/20 font-bold transition-all px-5 text-[14px]">
                  <SelectValue placeholder="Select a model" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-border/50">
                  {LLM_MODEL_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value} className="font-bold">
                      {option.label}{option.hint ? ` • ${option.hint}` : ''}
                    </SelectItem>
                  ))}
                  {!LLM_MODEL_OPTIONS.some((option) => option.value === llmModel) ? (
                    <SelectItem value={llmModel} className="font-bold">
                      {llmModel}
                    </SelectItem>
                  ) : null}
                </SelectContent>
              </Select>
           </div>

           <div className="space-y-4">
              <Label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/60">Provider</Label>
              <Select value={llmProvider} onValueChange={setLlmProvider}>
                <SelectTrigger className="h-12 bg-muted/20 border-border/50 rounded-xl focus:ring-1 focus:ring-primary/20 font-bold transition-all px-5 text-[14px]">
                  <SelectValue placeholder="Select a provider" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-border/50">
                  {LLM_PROVIDER_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value} className="font-bold">
                      {option.label}{option.hint ? ` • ${option.hint}` : ''}
                    </SelectItem>
                  ))}
                  {!LLM_PROVIDER_OPTIONS.some((option) => option.value === llmProvider) ? (
                    <SelectItem value={llmProvider} className="font-bold">
                      {llmProvider}
                    </SelectItem>
                  ) : null}
                </SelectContent>
              </Select>
           </div>
        </div>
      </section>

      {/* 2. Voice (TTS) Configuration */}
      <section className="space-y-8 pt-4">
        <div className="flex flex-col gap-1">
           <h3 className="text-[14px] font-bold text-foreground tracking-tight uppercase">Voice Personality (TTS)</h3>
           <p className="text-[11px] font-medium text-muted-foreground/40 leading-relaxed uppercase tracking-widest">
             Decide how your agent sounds on a call.
           </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
           <div className="space-y-4">
              <div className="flex items-center gap-2 mb-1">
                <Volume2 className="h-4 w-4 text-emerald-500 opacity-60" />
                <Label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/60">TTS Voice</Label>
              </div>
              <Select value={ttsVoice} onValueChange={handleVoiceSelect}>
                <SelectTrigger className="h-12 bg-muted/20 border-border/50 rounded-xl focus:ring-1 focus:ring-primary/20 font-bold transition-all px-5 text-[14px]">
                  <SelectValue placeholder="Select a voice" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-border/50">
                  {TTS_VOICE_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value} className="font-bold">
                      {option.label}{option.hint ? ` • ${option.hint}` : ''} • select to preview
                    </SelectItem>
                  ))}
                  {!TTS_VOICE_OPTIONS.some((option) => option.value === ttsVoice) ? (
                    <SelectItem value={ttsVoice} className="font-bold">
                      {ttsVoice}
                    </SelectItem>
                  ) : null}
                </SelectContent>
              </Select>
           </div>

           <div className="space-y-4">
              <Label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/60">TTS Provider</Label>
              <Select value={ttsProvider} onValueChange={setTtsProvider}>
                <SelectTrigger className="h-12 bg-muted/20 border-border/50 rounded-xl focus:ring-1 focus:ring-primary/20 font-bold transition-all px-5 text-[14px]">
                  <SelectValue placeholder="Select a provider" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-border/50">
                  {TTS_PROVIDER_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value} className="font-bold">
                      {option.label}{option.hint ? ` • ${option.hint}` : ''}
                    </SelectItem>
                  ))}
                  {!TTS_PROVIDER_OPTIONS.some((option) => option.value === ttsProvider) ? (
                    <SelectItem value={ttsProvider} className="font-bold">
                      {ttsProvider}
                    </SelectItem>
                  ) : null}
                </SelectContent>
              </Select>
           </div>
        </div>
      </section>

      {/* 3. Transcription (STT) Infrastructure */}
      <section className="space-y-8 pt-4 pb-10 border-b border-border/20">
         <div className="flex flex-col gap-1">
           <h3 className="text-[14px] font-bold text-foreground tracking-tight uppercase">Speech-to-Text (STT)</h3>
           <p className="text-[11px] font-medium text-muted-foreground/40 leading-relaxed uppercase tracking-widest">
             Real-time transcription and parsing layer.
           </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
           <div className="space-y-4">
              <div className="flex items-center gap-2 mb-1">
                <Mic className="h-4 w-4 text-primary opacity-60" />
                <Label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/60">Provider</Label>
              </div>
              <Select value={sttProvider} onValueChange={setSttProvider}>
                <SelectTrigger className="h-12 bg-muted/20 border-border/50 rounded-xl focus:ring-1 focus:ring-primary/20 font-bold transition-all px-5 text-[14px]">
                  <SelectValue placeholder="Select a provider" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-border/50">
                  {STT_PROVIDER_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value} className="font-bold">
                      {option.label}{option.hint ? ` • ${option.hint}` : ''}
                    </SelectItem>
                  ))}
                  {!STT_PROVIDER_OPTIONS.some((option) => option.value === sttProvider) ? (
                    <SelectItem value={sttProvider} className="font-bold">
                      {sttProvider}
                    </SelectItem>
                  ) : null}
                </SelectContent>
              </Select>
           </div>

           <div className="space-y-4">
              <Label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/60">STT Model</Label>
              <Select value={sttModel} onValueChange={setSttModel}>
                <SelectTrigger className="h-12 bg-muted/20 border-border/50 rounded-xl focus:ring-1 focus:ring-primary/20 font-bold transition-all px-5 text-[14px]">
                  <SelectValue placeholder="Select a model" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-border/50">
                  {STT_MODEL_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value} className="font-bold">
                      {option.label}{option.hint ? ` • ${option.hint}` : ''}
                    </SelectItem>
                  ))}
                  {!STT_MODEL_OPTIONS.some((option) => option.value === sttModel) ? (
                    <SelectItem value={sttModel} className="font-bold">
                      {sttModel}
                    </SelectItem>
                  ) : null}
                </SelectContent>
              </Select>
           </div>
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex flex-col gap-1">
          <h3 className="text-[14px] font-bold text-foreground tracking-tight uppercase">Voice Preview</h3>
          <p className="text-[11px] font-medium text-muted-foreground/40 leading-relaxed uppercase tracking-widest">
            Quick browser preview to test language and voice feel before saving.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="space-y-4">
            <Label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/60">Preview Language</Label>
            <Select
              value={previewLanguage}
              onValueChange={(value) => {
                setPreviewLanguage(value)
                setPreviewText(getPreviewTextForLocale(value))
              }}
            >
              <SelectTrigger className="h-12 bg-muted/20 border-border/50 rounded-xl focus:ring-1 focus:ring-primary/20 font-bold transition-all px-5 text-[14px]">
                <SelectValue placeholder="Select preview language" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-border/50">
                <SelectItem value="en-IN" className="font-bold">en-IN • English (India)</SelectItem>
                <SelectItem value="en-US" className="font-bold">en-US • English (US)</SelectItem>
                <SelectItem value="hi-IN" className="font-bold">hi-IN • Hindi (India)</SelectItem>
                <SelectItem value="mr-IN" className="font-bold">mr-IN • Marathi (India)</SelectItem>
                <SelectItem value="en-GB" className="font-bold">en-GB • English (UK)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-4">
            <Label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/60">Actions</Label>
            <div className="flex items-center gap-3">
              <Button
                type="button"
                onClick={() => void handlePreview()}
                disabled={isPreviewing}
                className="h-12 px-6 rounded-xl font-bold text-[11px] uppercase tracking-widest"
              >
                {isPreviewing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Volume2 className="h-4 w-4" />}
                {isPreviewing ? 'Playing...' : 'Play Preview'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={stopPreview}
                disabled={!isPreviewing}
                className="h-12 px-6 rounded-xl font-bold text-[11px] uppercase tracking-widest"
              >
                <Square className="h-4 w-4" />
                Stop
              </Button>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <Label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/60">Preview Text</Label>
          <Textarea
            value={previewText}
            onChange={(event) => setPreviewText(event.target.value)}
            placeholder="Type sample text to test TTS output"
            className="min-h-30 bg-muted/10 border-border/50 rounded-xl"
          />
          {previewError ? (
            <p className="text-[11px] font-bold text-destructive uppercase tracking-widest">{previewError}</p>
          ) : (
            <p className="text-[11px] font-medium text-muted-foreground/40 uppercase tracking-widest">
              Selecting a TTS voice in the dropdown auto-plays an Azure preview sample so each voice sounds distinct from backend output.
            </p>
          )}
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="space-y-1">
            <h3 className="text-[14px] font-bold text-foreground tracking-tight uppercase">Current Stack</h3>
            <p className="text-[11px] font-medium text-muted-foreground/40 leading-relaxed uppercase tracking-widest">
              Editable fields are limited to the providers and models supported by the current backend.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {stackBadges.map((item) => (
              <Badge
                key={item.label}
                variant="outline"
                className="h-7 px-3 border-border/40 bg-background text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60"
              >
                {item.label}: {item.value}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      <div className="pt-6 border-t border-border/40 flex justify-end">
        <Button
          onClick={() => {
            updateAgent({
              id: agent.id,
              payload: {
                stt_provider: sttProvider,
                stt_model: sttModel,
                tts_provider: ttsProvider,
                tts_model: ttsModel,
                tts_voice: ttsVoice,
                llm_provider: llmProvider,
                llm_model: llmModel,
              },
            })
          }}
          disabled={saving || !isDirty}
          className="h-12 px-10 rounded-xl font-bold text-[11px] uppercase tracking-widest gap-3 shadow-lg shadow-primary/10 disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save Voice & Model'}
        </Button>
      </div>

    </div>
  )
}
