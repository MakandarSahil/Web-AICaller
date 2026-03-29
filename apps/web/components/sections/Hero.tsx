import Link from "next/link";
import { Mic, Phone, Bot, Sparkles, Globe, ArrowRight } from "lucide-react";

// <<<<<<< HEAD
// const DASHBOARD_URL =
//   process.env.NEXT_PUBLIC_DASHBOARD_URL ?? "https://dashboard.callmind.ai";
// =======
// import { DASHBOARD_URL } from '@/lib/urls'
// >>>>>>> f26a120466fadd7b0a596800c750b4fd14bb94f8

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#f8f8fb] min-h-[100dvh] flex items-center justify-center pt-20 pb-12">

      {/* 2-column grid */}
      <div className="w-full max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">

        {/* Left Column: Context centered within the left side */}
        <div className="flex flex-col items-center text-center justify-center py-12">

          {/* Top Badge */}
          <div className="mb-6 animate-[fadeIn_0.6s_ease_forwards]">
            <span className="inline-block rounded-full bg-[#ececf3] px-5 py-2 text-sm text-gray-600 font-medium">
              AI Can Now Make & Take Calls On Your Behalf!
            </span>
          </div>

          {/* Floating Tags + Heading Wrapper */}
          <div className="relative inline-block">

            {/* Left Tag - Yellow (Shifted next to 'For' on the second line) */}
            <div className="absolute -left-12 lg:-left-28 top-[100px] lg:top-[115px] hidden lg:block animate-[float_3s_ease-in-out_infinite] z-20">
              <span className="bg-yellow-400 text-black px-4 py-2 rounded-full text-sm font-medium shadow-md rotate-[-10deg] inline-block whitespace-nowrap">
                Inbound & Outbound Calls
              </span>
            </div>

            {/* Right Tag - Indigo */}
            <div className="absolute -right-8 lg:-right-20 top-[20px] lg:top-[30px] hidden lg:block animate-[float_3s_ease-in-out_infinite] [animation-delay:0.2s] z-20">
              <span className="bg-indigo-600 text-white px-4 py-2 rounded-full text-sm font-medium shadow-md rotate-[8deg] inline-block whitespace-nowrap">
                Human-Like
              </span>
            </div>

            {/* Headline */}
            <h1 className="animate-[fadeUp_0.8s_ease_forwards] text-4xl md:text-5xl lg:text-[56px] font-bold leading-tight tracking-tight text-gray-900 max-w-2xl relative z-10 lg:pt-4">
              Next-Gen AI Voice Agents <br />
              For Businesses and Agencies
            </h1>

            {/* Subheadline */}
            <p
              className="mt-6 animate-fade-in-up text-lg leading-relaxed text-gray-500 max-w-lg"
              style={{ animationDelay: '0.1s' }}
            >
              CallMind sits at the front line, handling the simple questions,
              checks, and outreach across the customer lifecycle in the same way
              a good human would. It answers, qualifies, and routes through your
              existing stack in seconds.
            </p>

            {/* CTA buttons */}
            <div
              className="mt-10 flex animate-fade-in-up flex-wrap items-center gap-4"
              style={{ animationDelay: '0.2s' }}
            >
              <Link
                href={`${DASHBOARD_URL}/signup`}
                className="btn-blue px-7 py-3.5 text-base gap-2"
              >
                Start for free
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="#demo"
                className="btn-outline px-7 py-3.5 text-base gap-2"
              >
                <Phone className="h-4 w-4" />
                Try a live call
              </a>
            </div>
          </div>
        </div>

        {/* Right Column - Clean White UI Smart Phone */}
        <div className="flex justify-center xl:justify-end items-center py-12 lg:pr-8 xl:pr-12 animate-[fadeUp_1s_ease_forwards] [animation-delay:0.4s]">
          {/* Scaled down, smaller phone wrapper */}
          <div className="relative w-[300px] h-[580px] group">

            {/* Phone Body - White app aesthetic matching screenshot */}
            <div className="absolute inset-0 bg-white rounded-[45px] border-[8px] border-gray-800 shadow-2xl overflow-hidden flex flex-col items-center group-hover:animate-[ring_1.2s_ease-in-out]">

              {/* StatusBar & Notch */}
              <div className="w-full h-[52px] flex justify-between items-center px-6 relative z-30 pt-2 bg-white">
                <span className="text-[12px] font-semibold text-gray-900">10:41</span>

                {/* Notch */}
                <div className="absolute left-1/2 -translate-x-1/2 w-16 h-3.5 bg-gray-800 rounded-full top-[16px]"></div>

                {/* Status Icons */}
                <div className="flex gap-[5px] items-center text-gray-900">
                  {/* Cellular */}
                  <svg className="w-[14px] h-[14px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="20" x2="18" y2="10"></line>
                    <line x1="14" y1="20" x2="14" y2="14"></line>
                    <line x1="10" y1="20" x2="10" y2="17"></line>
                    <line x1="6" y1="20" x2="6" y2="20"></line>
                  </svg>
                  {/* Wifi */}
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12.55a11 11 0 0 1 14.08 0"></path>
                    <path d="M1.42 9a16 16 0 0 1 21.16 0"></path>
                    <path d="M8.53 16.11a6 6 0 0 1 6.95 0"></path>
                    <line x1="12" y1="20" x2="12.01" y2="20"></line>
                  </svg>
                  {/* Battery */}
                  <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="7" width="16" height="10" rx="3" ry="3"></rect>
                    <line x1="22" y1="11" x2="22" y2="13"></line>
                    <rect x="4" y="9" width="12" height="6" rx="1" fill="currentColor" stroke="none"></rect>
                  </svg>
                </div>
              </div>

              {/* Inner Soft Blue Container */}
              <div className="w-[90%] flex-1 bg-[#eff2fb] rounded-[32px] rounded-b-none mt-2 px-5 py-6 flex flex-col items-center relative z-20">

                {/* Profile Section */}
                <div className="flex flex-col items-center justify-center gap-3 mt-4 mb-6 w-full border-b border-gray-200/50 pb-6">
                  <div className="w-[68px] h-[68px] rounded-2xl bg-gray-300 shadow-sm flex items-center justify-center flex-shrink-0">
                    <Bot className="w-8 h-8 text-gray-800" strokeWidth={2.5} />
                  </div>
                  <div className="flex flex-col items-center justify-center">
                    <span className="text-[#3b3a4a] text-[16px] font-bold tracking-tight">Nick from CallMind</span>
                  </div>
                </div>


                {/* Talk CTA */}
                <Link href="#demo" className="w-full bg-[#4e3ed8] text-white rounded-[14px] h-[48px] font-semibold flex justify-center items-center gap-2.5 hover:bg-[#4336B3] transition-all duration-300 shadow-[0_8px_20px_rgba(78,62,216,0.3)] mt-auto mb-6 transform hover:-translate-y-0.5">
                  <Mic className="h-5 w-5" /> Talk with AI
                </Link>
              </div>

            </div>

            {/* Floating External Badges */}
            <div className="absolute -left-12 lg:-left-28 top-[38%] z-40 bg-[#fbf7ee] px-4 py-2.5 rounded-2xl shadow-[0_12px_45px_rgba(0,0,0,0.08)] flex items-center gap-2 border border-orange-100/30 w-max transform hover:-translate-y-1 transition duration-300 animate-[fadeIn_0.5s_ease_forwards] [animation-delay:0.6s] opacity-0">
              <Globe className="w-4 h-4 text-blue-500" />
              <span className="text-[13px] font-semibold text-gray-800 tracking-tight">English speaker</span>
            </div>

            <div className="absolute -left-14 lg:-left-32 top-[52%] z-40 bg-[#fbf7ee] px-4 py-2.5 rounded-2xl shadow-[0_12px_45px_rgba(0,0,0,0.08)] flex items-center gap-2 border border-orange-100/30 w-max transform hover:-translate-y-1 transition duration-300 animate-[fadeIn_0.5s_ease_forwards] [animation-delay:0.8s] opacity-0">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span className="text-[13px] font-semibold text-gray-800 tracking-tight">Trained on CallMind FAQs</span>
            </div>

            {/* Try Free textual arrow indicator */}
            <div className="absolute -right-12 lg:-right-36 -top-6 lg:-top-10 z-0 hidden lg:block animate-[fadeIn_0.8s_ease_forwards] [animation-delay:1s] opacity-0">
              <div className="flex flex-col items-center gap-1">
                <span className="text-black font-semibold text-[17px] leading-[1.1] text-center rotate-[4deg] font-['Caveat','Dancing_Script',cursive]">
                  Try a FREE<br />demo call!
                </span>
                {/* Looping arrow mimicking the screenshot */}
                <svg width="80" height="90" viewBox="0 0 80 90" className="text-black rotate-[-5deg] mr-8 mt-1 overflow-visible">
                  <path d="M50,10 C60,40 80,60 50,60 C40,60 40,40 50,45 C60,50 40,75 10,85" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M10,85 L18,76 M10,85 L22,87" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* Background Glow */}
      <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-purple-300 opacity-20 blur-[120px] rounded-full pointer-events-none z-0"></div>

      {/* Keyframes using Tailwind arbitrary values */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes float {
          0%,100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        @keyframes ring {
          0%, 100% { transform: rotate(0deg); }
          15%, 45%, 75% { transform: rotate(-3deg); }
          30%, 60%, 90% { transform: rotate(3deg); }
        }
      `}</style>
    </section>
  );
}