import { useState, useEffect } from "react";
import { ArrowRight, Sprout, HeartHandshake, Aperture } from "lucide-react";
import { HOME_INTRO, IMAGES } from "../data";
import { motion } from "motion/react";
import StreamLogo from "./StreamLogo";

interface HomeViewProps {
  onExplorePrograms: () => void;
}

export default function HomeView({ onExplorePrograms }: HomeViewProps) {
  const [imgUrl, setImgUrl] = useState<string>("");
  const [useIframeFallback, setUseIframeFallback] = useState<boolean>(false);

  useEffect(() => {
    const originalUrl = "https://1drv.ms/u/c/4dae11835575d5c1/IQTGfBm9w_6VSbqw4z63RcHkAfslr44LZofupMWjxh4chAc";
    try {
      // Standard Microsoft OneDrive API direct file mapping using base64 sharing ID
      const base64 = btoa(originalUrl)
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");
      setImgUrl(`https://api.onedrive.com/v1.0/shares/u!${base64}/root/content`);
    } catch (e) {
      console.error("HomeView: Failed to generate direct OneDrive link, using native fallback structure:", e);
      setUseIframeFallback(true);
    }
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      
      {/* 🧘 J. Krishnamurti Inspiration Layout & Top Branding Section */}
      <section 
        className="relative bg-white py-12 px-4 overflow-hidden border-b border-[#F37021] flex flex-col items-center w-full"
        id="inspiration-landing"
      >
        <div className="w-full max-w-7xl mx-auto flex flex-col items-center">
          
          {/* 🧘 J. Krishnamurti Inspiration Layout (Side-by-Side as inspired by the uploaded image) */}
          <div className="w-full bg-white grid grid-cols-1 lg:grid-cols-12 mb-6 gap-8 lg:gap-12">
            
            {/* Left side: Originally Uploaded Image resolved directly from OneDrive */}
            <div className="lg:col-span-5 relative min-h-[410px] lg:min-h-[580px] bg-stone-50 border border-stone-200/60 rounded-2xl overflow-hidden flex items-stretch p-1 shadow-sm">
              {useIframeFallback ? (
                <iframe 
                  src="https://1drv.ms/u/c/4dae11835575d5c1/IQTGfBm9w_6VSbqw4z63RcHkAfslr44LZofupMWjxh4chAc" 
                  width="100%" 
                  title="Originally Uploaded Inspiration Image"
                  className="w-full min-h-[410px] lg:min-h-full border-0 select-none bg-transparent"
                  scrolling="no"
                ></iframe>
              ) : (
                <div className="w-full h-full flex items-center justify-center relative p-1">
                  {!imgUrl && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-stone-50 text-center gap-3">
                      <Aperture className="w-10 h-10 text-[#F37021] animate-spin-slow" />
                      <span className="font-mono text-[11px] text-[#7F817F]">Loading Inspiration Plate...</span>
                    </div>
                  )}
                  {imgUrl && (
                    <img 
                      src={imgUrl} 
                      alt="Originally Uploaded Inspiration Image"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-contain rounded-xl select-none"
                      onError={() => {
                        console.warn("Direct image failed to load, falling back to Microsoft interactive iframe.");
                        setUseIframeFallback(true);
                      }}
                    />
                  )}
                </div>
              )}
            </div>

            {/* Right side: Inspiration Quote and explanation */}
            <div className="lg:col-span-7 bg-white p-4 sm:p-8 flex flex-col justify-center">
              <span className="text-[#F37021] font-amatic text-2xl font-bold tracking-widest uppercase mb-4 block">
                The Foundation of Inquiry
              </span>
              
              <h2 className="font-chalk text-4xl sm:text-5xl text-[#1A1D1C] mb-6 leading-tight border-b-2 border-dashed border-[#DDDCDA] pb-3" style={{ fontFamily: "Fredericka the Great, cursive" }}>
                Inspiration
              </h2>

              <p className="font-hand text-xl sm:text-2xl text-[#1A1D1C] leading-relaxed mb-6 italic select-all">
                "So you have to be your own teacher and your own disciple, and there is no teacher outside, no saviour, no master; you yourself have to change, and therefore you have to learn to observe, to know yourself. This learning about yourself is a fascinating and joyous business."
              </p>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-4 border-t border-[#1A1D1C]/10 pt-6">
                <div>
                  <span className="font-sketch text-lg text-[#F37021] block">
                    — Jiddu Krishnamurti
                  </span>
                  <span className="font-hand text-sm text-[#5A5C5A]">
                    “Talks with American Students”
                  </span>
                </div>

                <button
                  onClick={onExplorePrograms}
                  className="px-6 py-3 bg-[#F37021] hover:bg-[#E05A10] text-[#FFFFFF] font-sketch text-base rounded shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 border border-[#1A1D1C] self-start sm:self-center"
                >
                  <span>Explore Programs</span>
                  <ArrowRight className="w-4 h-4 text-white" />
                </button>
              </div>
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
