import { useState, useEffect, useCallback } from "react";
import { ArrowRight, Sprout, HeartHandshake, ChevronLeft, ChevronRight, Quote, Pause, Play } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { HOME_INTRO, IMAGES } from "../data";
import StreamLogo from "./StreamLogo";

// Import real local uploaded high-resolution assets
import wideBannerImg from "../assets/images/K-teachers.png";

const EDUCATIONAL_QUOTES = [
  {
    philosopher: "Swami Vivekananda",
    role: "Spiritual Visionary & Integral Educator",
    quote: "Education is the manifestation of the perfection already in man. We want that education by which character is formed, strength of mind is increased, the intellect is expanded, and by which one can stand on one's own feet.",
    subQuote: "The very essence of education is concentration of mind, not the collecting of facts.",
    accentColor: "#D97706",
  },
  {
    philosopher: "J. Krishnamurti",
    role: "Philosopher & Founder of Brockwood Park & Rishi Valley",
    quote: "There is no end to education. It is not that you read a book, pass an examination, and finish with education. The whole of life, from the moment you are born to the moment you die, is a process of learning.",
    subQuote: "To understand life is to understand ourselves, and that is both the beginning and the end of education.",
    accentColor: "#F37021",
  },
  {
    philosopher: "Rabindranath Tagore",
    role: "Nobel Laureate & Founder of Santiniketan (Visva-Bharati)",
    quote: "The highest education is that which does not merely give us information but makes our life in harmony with all existence.",
    subQuote: "Don't limit a child to your own learning, for he was born in another time.",
    accentColor: "#059669",
  },
  {
    philosopher: "Philosophy of A. S. Neill",
    role: "Pioneer of Summerhill & Self-Directed Education",
    quote: "The aim of life is to find happiness, which means to find interest. Education should be a preparation for life, not just for examinations.",
    subQuote: "I would rather Summerhill produced a happy street cleaner than a neurotic scholar.",
    accentColor: "#2563EB",
  },
  {
    philosopher: "Steiner Waldorf (Rudolf Steiner)",
    role: "Founder of Waldorf Education & Anthroposophy",
    quote: "Receive the children in reverence, educate them in love, and send them forth in freedom.",
    subQuote: "Our highest endeavor must be to develop free human beings who are able of themselves to impart purpose and direction to their lives.",
    accentColor: "#7C3AED",
  }
];

interface HomeViewProps {
  onExplorePrograms: () => void;
}

export default function HomeView({ onExplorePrograms }: HomeViewProps) {
  const wideDirectUrl = wideBannerImg;
  const mobileDirectUrl = wideBannerImg;

  const [currentQuoteIdx, setCurrentQuoteIdx] = useState(0);
  const [isAutoplayActive, setIsAutoplayActive] = useState(true);

  const nextQuote = useCallback(() => {
    setCurrentQuoteIdx((prev) => (prev + 1) % EDUCATIONAL_QUOTES.length);
  }, []);

  const prevQuote = useCallback(() => {
    setCurrentQuoteIdx((prev) => (prev - 1 + EDUCATIONAL_QUOTES.length) % EDUCATIONAL_QUOTES.length);
  }, []);

  // Autoplay Effect
  useEffect(() => {
    if (!isAutoplayActive) return;
    const interval = setInterval(() => {
      nextQuote();
    }, 8000); // Mindful pause of 8 seconds per quote
    return () => clearInterval(interval);
  }, [isAutoplayActive, nextQuote]);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      
      {/* 🧘 J. Krishnamurti Inspiration Layout & Top Branding Section */}
      <section 
        className="relative bg-white py-16 px-6 overflow-hidden border-b border-[#F37021] flex flex-col items-center w-full"
        id="inspiration-landing"
      >
        <div className="w-full max-w-7xl mx-auto flex flex-col items-center">
          
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
              In association with <strong className="text-espresso font-semibold">NeeAr</strong>, this core belief underpins every module in <strong className="text-[#F37021]">The Steam</strong>. We do not manufacture teachers to follow automated templates; we nurture conscious educators who learn to look closely at themselves, the child, and the environment.
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
                THE STEAM & NeeAr TTP
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

      {/* 🎡 Educational Philosophies Carousel Section */}
      <section className="w-full bg-[#FAF9F6] py-16 px-6 border-b border-[#F37021]/30 overflow-hidden" id="quotes-carousel">
        <div className="w-full max-w-5xl mx-auto">
          
          <div className="text-center mb-10 space-y-3">
            <h2 className="font-sketch text-3xl sm:text-4xl text-espresso">
              Educational Wisdom & Visions
            </h2>
            <div className="w-24 h-1 bg-[#F37021] mx-auto rounded-full mt-2" />
          </div>

          {/* Carousel Card Container */}
          <div className="relative bg-white border-2 border-espresso rounded-2xl p-6 sm:p-10 shadow-lg overflow-hidden min-h-[420px] sm:min-h-[340px] flex flex-col justify-between">
            
            {/* Background Decorative Quote Mark */}
            <div className="absolute right-6 top-6 text-espresso/5 select-none pointer-events-none">
              <Quote className="w-32 h-32" />
            </div>

            {/* Quote Slide with Fade Animation */}
            <div className="relative z-10 flex-1 flex flex-col justify-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentQuoteIdx}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div className="space-y-1">
                    <span 
                      className="text-xs font-mono px-3 py-1 rounded-full uppercase tracking-wider font-semibold inline-block"
                      style={{ 
                        backgroundColor: `${EDUCATIONAL_QUOTES[currentQuoteIdx].accentColor}15`, 
                        color: EDUCATIONAL_QUOTES[currentQuoteIdx].accentColor,
                        border: `1px solid ${EDUCATIONAL_QUOTES[currentQuoteIdx].accentColor}25`
                      }}
                    >
                      {EDUCATIONAL_QUOTES[currentQuoteIdx].role}
                    </span>
                    <h3 className="font-sketch text-2xl sm:text-3xl text-espresso mt-2">
                      {EDUCATIONAL_QUOTES[currentQuoteIdx].philosopher}
                    </h3>
                  </div>

                  <div className="space-y-4">
                    <p className="font-hand text-xl sm:text-2xl text-espresso/90 leading-relaxed italic">
                      "{EDUCATIONAL_QUOTES[currentQuoteIdx].quote}"
                    </p>
                    {EDUCATIONAL_QUOTES[currentQuoteIdx].subQuote && (
                      <p className="font-hand text-base sm:text-lg text-[#5A5C5A] border-l-2 pl-4 italic" style={{ borderColor: EDUCATIONAL_QUOTES[currentQuoteIdx].accentColor }}>
                        "{EDUCATIONAL_QUOTES[currentQuoteIdx].subQuote}"
                      </p>
                    )}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Bottom Controls Row */}
            <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[#DDD9CE]/60 pt-6 mt-8">
              
              {/* Autoplay & Playback Indicator Status */}
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsAutoplayActive(!isAutoplayActive)}
                  className="p-1.5 rounded-full hover:bg-stone-100 border border-stone-200 text-espresso cursor-pointer transition-colors"
                  title={isAutoplayActive ? "Pause Autoplay" : "Start Autoplay"}
                >
                  {isAutoplayActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </button>
                <span className="text-xs font-mono text-gray-500 uppercase tracking-wider">
                  {isAutoplayActive ? "Autoplay Active" : "Autoplay Paused"}
                </span>
              </div>

              {/* Indicator dots */}
              <div className="flex items-center gap-2">
                {EDUCATIONAL_QUOTES.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setCurrentQuoteIdx(idx);
                      setIsAutoplayActive(false); // Pause autoplay on manual click
                    }}
                    className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                      currentQuoteIdx === idx 
                        ? "w-6 bg-[#F37021]" 
                        : "w-2.5 bg-stone-200 hover:bg-stone-300"
                    }`}
                    title={`Go to quote ${idx + 1}`}
                  />
                ))}
              </div>

              {/* Navigation Arrows */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={prevQuote}
                  className="p-2 border border-espresso/25 rounded-lg hover:border-espresso hover:bg-stone-50 text-espresso transition-all cursor-pointer"
                  title="Previous quote"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={nextQuote}
                  className="p-2 border border-espresso/25 rounded-lg hover:border-espresso hover:bg-stone-50 text-espresso transition-all cursor-pointer"
                  title="Next quote"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

            </div>

          </div>

          {/* Alternative Schooling Insight Footer tag */}
          <p className="text-center font-hand text-sm text-[#7F817F] mt-4 uppercase tracking-wider">
            ❋ these voices form the fundamental inquiry of self-directed and organic learning ecosystems ❋
          </p>

        </div>
      </section>

    </div>
  );
}
