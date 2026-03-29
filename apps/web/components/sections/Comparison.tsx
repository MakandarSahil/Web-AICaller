import { Badge } from "@aicaller/ui";
import { Check, X } from "lucide-react";

export function Comparison() {
  return (
    <section className="bg-white py-24 lg:py-32" id="comparison">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end w-full mb-16 gap-6">
          <div className="relative inline-block">
            <h2 className="text-3xl md:text-4xl lg:text-[44px] font-medium tracking-tight text-gray-900 leading-[1.1]">
              What is CallMind?
            </h2>
            {/* Yellow floating badge */}
            <div className="absolute -right-16 lg:-right-20 top-[-10px] hidden lg:block animate-[float_3s_ease-in-out_infinite] z-20">
              <Badge className="bg-yellow-400 text-black px-4 py-2 rounded-full text-sm font-semibold shadow-md rotate-[8deg] border-none hover:bg-yellow-400">
                No Code
              </Badge>
            </div>
          </div>
          <p className="text-gray-800 font-medium text-[18px] lg:text-[20px] leading-snug max-w-[420px] translate-y-1 md:translate-y-3">
            LLM based, humanlike, voice-first conversational AI platform
          </p>
        </div>

        {/* 3-Column Comparison Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Column 1: IVR */}
          <div className="bg-[#f6f7fa] rounded-[20px] p-8 lg:p-10 flex flex-col justify-between min-h-[550px]">
            <div>
              <span className="text-[13px] font-bold text-gray-900 tracking-tight">Other Solution</span>
            </div>
            
            <div className="mb-auto mt-[40%]">
              <h3 className="text-[26px] xl:text-[28px] font-medium tracking-tight text-gray-900 leading-tight">
                IVR Voice Agent
              </h3>
            </div>

            <div className="mt-8">
              <p className="text-[15px] font-semibold text-gray-800 leading-snug tracking-tight">
                Primarily Used For Call Routing Through Pre-Defined, Touch-Tone Menu Options
              </p>
            </div>
          </div>

          {/* Column 2: IVA */}
          <div className="bg-[#f6f7fa] rounded-[20px] p-8 lg:p-10 flex flex-col min-h-[550px]">
            <div>
              <span className="text-[13px] font-bold text-gray-900 tracking-tight">Other Solution</span>
            </div>
            
            <div className="mt-[40%]">
              <h3 className="text-[26px] xl:text-[28px] font-medium tracking-tight text-gray-900 leading-tight">
                IVA Voice Agent
              </h3>
              <p className="text-[15px] font-semibold text-gray-800 mt-5">
                Powered by NLP and Intent Mapping
              </p>
            </div>

            <div className="mt-10 flex flex-col gap-5 flex-grow">
              <div className="flex items-start gap-4">
                <X className="w-[18px] h-[18px] text-gray-500 flex-shrink-0 mt-0.5" strokeWidth={2.5} />
                <span className="text-[14px] text-gray-700 leading-snug font-medium">Non-natural conversations (limited interaction)</span>
              </div>
              <div className="flex items-start gap-4">
                <X className="w-[18px] h-[18px] text-gray-500 flex-shrink-0 mt-0.5" strokeWidth={2.5} />
                <span className="text-[14px] text-gray-700 leading-snug font-medium">Slow setup with complex configuration</span>
              </div>
              <div className="flex items-start gap-4">
                <X className="w-[18px] h-[18px] text-gray-500 flex-shrink-0 mt-0.5" strokeWidth={2.5} />
                <span className="text-[14px] text-gray-700 leading-snug font-medium">Can't handle edge cases and unexpected inputs</span>
              </div>
              <div className="flex items-start gap-4">
                <X className="w-[18px] h-[18px] text-gray-500 flex-shrink-0 mt-0.5" strokeWidth={2.5} />
                <span className="text-[14px] text-gray-700 leading-snug font-medium">Limited support for simple, one-turn interactions and inbound use cases</span>
              </div>
            </div>
          </div>

          {/* Column 3: 3rd Gen */}
          <div className="bg-[#030d22] rounded-[20px] p-8 lg:p-10 flex flex-col min-h-[550px]">
            <div>
              <span className="text-[13px] font-bold text-white tracking-tight">Our Solution</span>
            </div>
            
            <div className="mt-[40%]">
              <h3 className="text-[22px] xl:text-[24px] font-medium tracking-tight text-white leading-tight">
                3rd Gen Voice AI
              </h3>
              <p className="text-[18px] xl:text-[20px] font-bold text-white mt-4">
                Powered by LLMs
              </p>
            </div>

            <div className="mt-10 flex flex-col gap-5 flex-grow">
              <div className="flex items-start gap-4">
                <div className="w-[18px] h-[18px] rounded-full bg-white/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-3 h-3 text-white" strokeWidth={3} />
                </div>
                <span className="text-[14px] text-gray-200 leading-snug font-medium">Natural, Human-Like Conversations</span>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-[18px] h-[18px] rounded-full bg-white/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-3 h-3 text-white" strokeWidth={3} />
                </div>
                <span className="text-[14px] text-gray-200 leading-snug font-medium">Fast Setup With Minimal Configuration</span>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-[18px] h-[18px] rounded-full bg-white/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-3 h-3 text-white" strokeWidth={3} />
                </div>
                <span className="text-[14px] text-gray-200 leading-snug font-medium">Handles Edge Cases And Unexpected Inputs</span>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-[18px] h-[18px] rounded-full bg-white/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-3 h-3 text-white" strokeWidth={3} />
                </div>
                <span className="text-[14px] text-gray-200 leading-snug font-medium">Supports Complex, Multi-Turn And Outbound Use Cases</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
