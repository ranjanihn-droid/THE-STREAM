import { Shield, Leaf, Heart } from "lucide-react";
import { ABOUT_CONTENT } from "../data";
import { motion } from "motion/react";

export default function AboutView() {
  return (
    <div className="bg-canvas-bg min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        
        {/* Page Head */}
        <div className="text-center mb-16">
          <span className="text-terracotta font-amatic text-2xl font-bold tracking-widest uppercase">
            Deep Philosophical Roots
          </span>
          <h2 className="font-sketch text-4xl sm:text-6xl text-espresso mt-2 mb-4">
            Our Philosophical Anchor
          </h2>
          <div className="w-24 h-1 bg-ochre mx-auto rounded-full" />
        </div>

        {/* 🧘 J. Krishnamurti Quote Anchor */}
        <section className="relative bg-[#FAF9F6] rounded-lg p-8 sm:p-12 mb-20 shadow-sm border border-[#1A1D1C] overflow-hidden text-center">
          <div className="relative z-10 max-w-3xl mx-auto py-4">
            <p className="font-hand text-2xl sm:text-3xl text-espresso leading-relaxed italic">
              {ABOUT_CONTENT.philosophicalAnchor}
            </p>
          </div>
        </section>

        {/* 🏛️ The F.O.R.E. Trust Section */}
        <section className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center mb-24 pb-12 border-b-2 border-dashed border-[#DFDCDB]">
          <div className="md:col-span-5 flex flex-col items-center md:items-start text-center md:text-left">
            <div className="w-16 h-16 rounded-full bg-[#FAF9F6] border border-[#1A1D1C] flex items-center justify-center text-[#F37021] mb-4">
              <Shield className="w-8 h-8" />
            </div>
            <h3 className="font-sketch text-3xl sm:text-4xl text-espresso mb-4 leading-tight">
              {ABOUT_CONTENT.foreTrustTitle}
            </h3>
            <span className="font-hand text-lg text-[#F37021] font-bold block mt-1">
              a registered trust, with 80G approval.
            </span>
          </div>

          <div className="md:col-span-7 bg-[#FAF9F6] border-l border-[#F37021] p-6 sm:p-8 rounded-r-md border-y border-r border-[#1A1D1C]/20 shadow-sm">
            <p className="font-hand text-lg sm:text-xl text-espresso leading-relaxed">
              {ABOUT_CONTENT.foreTrustText}
            </p>
          </div>
        </section>

        {/* 👥 Our Team & Partners Grid (Using organic hand-drawn style vertical dividers) */}
        <section>
          <div className="text-center mb-12">
            <span className="text-[#F37021] font-amatic text-2xl font-bold tracking-widest uppercase">Collaborative Ecosystem</span>
            <h3 className="font-sketch text-3xl sm:text-4xl text-espresso mt-2">Our Team & Purpose</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border-y border-[#1A1D1C]">
            
            {/* Box 1: Core Values / Primary Mission (replacing NeeAr) */}
            <div className="py-10 px-6 sm:px-10 flex flex-col justify-between md:border-r border-[#1A1D1C] bg-white">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center text-[#F37021] border border-[#F37021]/30">
                    <Leaf className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-sketch text-2xl text-espresso leading-none">{ABOUT_CONTENT.partners[0].title}</h4>
                    <p className="font-amatic text-base text-[#F37021] tracking-widest font-bold uppercase mt-1">{ABOUT_CONTENT.partners[0].role}</p>
                  </div>
                </div>
                <p className="font-hand text-lg sm:text-xl text-[#4A4C4A] leading-relaxed">
                  {ABOUT_CONTENT.partners[0].desc}
                </p>
              </div>
              <div className="mt-8 pt-4 border-t border-dashed border-[#DFDCDB] flex items-center justify-between text-xs text-[#828482] font-mono">
                <span>UNHURRIED INQUIRY</span>
                <span>RIGHT LIFE</span>
              </div>
            </div>

            {/* Box 2: Founders */}
            <div className="py-10 px-6 sm:px-10 flex flex-col justify-between bg-white">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center text-[#F37021] border border-[#F37021]/30">
                    <Heart className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-sketch text-2xl text-espresso leading-none">The Founders</h4>
                    <p className="font-amatic text-base text-[#F37021] tracking-widest font-bold uppercase mt-1">A Fearless, Unconditioned Vision</p>
                  </div>
                </div>
                
                <p className="font-hand text-lg sm:text-xl text-[#414341] leading-relaxed">
                  Founded by <strong className="text-espresso">Murali Gotur</strong> and <strong className="text-espresso">Srinivasan HS</strong>, together they are dedicated to establishing fearless, conscious educational ecosystems designed to withstand systemic pressures of mechanical school templates.
                </p>
              </div>

              <div className="mt-8 pt-4 border-t border-dashed border-[#DFDCDB] flex items-center justify-between text-xs text-[#828482] font-mono">
                <span>FOUNDING DIRECTORS</span>
                <span>CHALKSTREAM EDUCATORS PVT LTD</span>
              </div>
            </div>

          </div>
        </section>

      </div>
    </div>
  );
}
