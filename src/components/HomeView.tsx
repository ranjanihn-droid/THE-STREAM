import { ArrowRight, Sprout, HeartHandshake } from "lucide-react";
import { HOME_INTRO, IMAGES } from "../data";
import StreamLogo from "./StreamLogo";

// Import real local uploaded high-resolution assets
import wideBannerImg from "../assets/images/You have to be your own Teacher'-1.png";

interface HomeViewProps {
  onExplorePrograms: () => void;
}

export default function HomeView({ onExplorePrograms }: HomeViewProps) {
  const wideDirectUrl = wideBannerImg;
  const mobileDirectUrl = wideBannerImg;

  return (
    <div className="flex flex-col min-h-screen bg-white">
      
      {/* 🧘 J. Krishnamurti Inspiration Layout & Top Branding Section */}
      <section 
        className="relative bg-white py-16 px-6 overflow-hidden border-b border-[#F37021] flex flex-col items-center w-full"
        id="inspiration-landing"
      >
        <div className="w-full max-w-7xl mx-auto flex flex-col items-center">
          
          <span className="text-[#F37021] font-amatic text-2xl sm:text-3xl font-bold tracking-widest uppercase mb-6 block text-center">
            The Foundation of Inquiry
          </span>
 
          {/* Clean full-bleed responsive inspiration image hero container */}
          <div className="w-full max-w-5xl flex items-center justify-center relative mb-10">
            <picture className="w-full h-full block">
              {/* Wide screens (widescreen hero aspect-ratio) */}
              {wideDirectUrl && (
                <source media="(min-width: 1024px)" srcSet={wideDirectUrl} />
              )}
              {/* Narrow / Tablet screens (optimized mobile layout) */}
              <img 
                src={mobileDirectUrl || undefined}
                alt="Jiddu Krishnamurti Quote Inspiration: You have to be your own TEACHER"
                referrerPolicy="no-referrer"
                className="w-full h-auto object-contain select-none shadow-sm rounded-lg"
              />
            </picture>
          </div>

          {/* Underpinning philosophy description block */}
          <div className="max-w-3xl text-center space-y-6">
            <p className="font-hand text-xl sm:text-2xl text-espresso/90 leading-relaxed italic max-w-2xl mx-auto">
              "So you have to be your own teacher and your own disciple, and there is no teacher outside, no saviour, no master; you yourself have to change, and therefore you have to learn to observe, to know yourself. This learning about yourself is a fascinating and joyous business."
            </p>
            <p className="font-hand text-lg text-[#5A5C5A] leading-relaxed max-w-xl mx-auto">
              In association with <strong className="text-espresso font-semibold">NeeAr</strong>, this core belief underpins every module in <strong className="text-[#F37021]">The Stream</strong>. We do not manufacture teachers to follow automated templates; we nurture conscious educators who learn to look closely at themselves, the child, and the environment.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <button
                onClick={onExplorePrograms}
                className="px-8 py-3.5 bg-[#F37021] hover:bg-[#E05A10] text-[#FFFFFF] font-sketch text-lg rounded shadow-sm hover:shadow-lg hover:scale-[1.01] transition-all flex items-center justify-center gap-2 border border-[#1A1D1C]"
              >
                <span>Explore Our Programs</span>
                <ArrowRight className="w-5 h-5 text-white" />
              </button>
              
              <span className="font-mono text-xs text-[#7F817F] uppercase tracking-wider px-3 py-1 bg-stone-50 border border-stone-200/50 rounded-full">
                STREAM & NeeAr TTP
              </span>
            </div>
          </div>

        </div>
      </section>

      {/* 🛖 Split-Screen Welcome & Introduction Section */}
      <section 
        className="w-full grid grid-cols-1 lg:grid-cols-12 min-h-screen border-b border-[#F37021]" 
        id="welcome-split"
      >
        {/* Left Side: Soft Parchment Content Card (7 Cols) */}
        <div className="lg:col-span-7 bg-white text-espresso py-16 px-6 sm:px-12 lg:px-20 flex flex-col justify-center border-b lg:border-b-0">
          <div className="max-w-2xl mx-auto lg:mx-0">
            <div className="flex items-center gap-2 text-[#F37021] font-amatic text-2xl font-bold uppercase tracking-widest mb-4">
              <Sprout className="w-6 h-6 text-[#F37021]" />
              <span>Right Learning Ecosystem</span>
            </div>
            
            <h2 className="font-sketch text-3xl sm:text-5xl text-espresso mb-8 leading-tight">
              {HOME_INTRO.welcomeTitle}
            </h2>

            <p className="font-hand text-xl sm:text-2xl text-[#1A1D1C] leading-relaxed mb-6">
              {HOME_INTRO.welcomeText}
            </p>

            <p className="font-hand text-lg sm:text-xl text-[#5A5C5A] leading-relaxed mb-8">
              {HOME_INTRO.welcomeSecondaryText}
            </p>

            {/* Accent Highlight details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 border-t border-[#F37021]/30 pt-8 mt-4">
              <div className="flex gap-3">
                <div className="w-10 h-10 shrink-0 bg-[#FAF9F6] border border-[#1A1D1C]/20 rounded-full flex items-center justify-center text-[#F37021] font-sketch text-lg font-bold">
                  1
                </div>
                <div>
                  <h4 className="font-amatic text-xl font-bold text-espresso">Unlearning is Key</h4>
                  <p className="font-hand text-base text-[#5A5C5A]">Stepping aside from standardized modern schedules into mindful observation.</p>
                </div>
              </div>
              
              <div className="flex gap-3">
                <div className="w-10 h-10 shrink-0 bg-[#FAF9F6] border border-[#1A1D1C]/20 rounded-full flex items-center justify-center text-[#F37021] font-sketch text-lg font-bold">
                  2
                </div>
                <div>
                  <h4 className="font-amatic text-xl font-bold text-espresso">Right Ecosystems</h4>
                  <p className="font-hand text-base text-[#5A5C5A]">Prepares teachers directly for pioneering setups like Aranyaani and Aarohi.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Rich dialogue circle artwork (5 Cols) */}
        <div className="lg:col-span-5 relative min-h-[400px] lg:min-h-full overflow-hidden flex items-stretch border-t lg:border-t-0 lg:border-l border-[#F37021] bg-white">
          <img
            src={IMAGES.dialogueCircle}
            alt="Mixed age group of educators with friendly indie dogs and a cow under the shade of a sacred Indian Peepal tree"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover lg:object-contain object-center absolute inset-0 filter saturate-95 brightness-95 bg-white"
          />
          {/* Saffron and subtle shade overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none lg:bg-gradient-to-r" />
          
          <div className="absolute bottom-6 left-6 right-6 z-10 p-5 bg-white/50 backdrop-blur-md rounded text-[#1A1D1C] shadow-lg border border-white/20">
            <div className="flex items-center gap-2 text-[#F37021] font-amatic text-xl font-bold uppercase tracking-widest mb-1">
              <HeartHandshake className="w-4 h-4 text-[#F37021]" />
              <span>Living Inquiry</span>
            </div>
            <p className="font-hand text-base text-[#1A1D1C] font-semibold">
              "Education is not merely acquiring information, but observing the unvarnished movements of fear, comparison, and conditioned action."
            </p>
          </div>
        </div>

      </section>

    </div>
  );
}
