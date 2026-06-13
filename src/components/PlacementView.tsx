import { Handshake, Compass, Globe, CheckCircle, ExternalLink, ArrowUpRight, MapPin } from "lucide-react";
import { PLACEMENT_CONTENT } from "../data";
import { motion } from "motion/react";

interface PlacementViewProps {
  onContactClick: () => void;
}

export default function PlacementView({ onContactClick }: PlacementViewProps) {
  return (
    <div className="bg-canvas-bg min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        
        {/* Page Head */}
        <div className="text-center mb-16">
          <span className="text-sage font-amatic text-2xl font-bold tracking-widest uppercase">
            Sustaining the Movement
          </span>
          <h2 className="font-sketch text-4xl sm:text-6xl text-espresso mt-2 mb-4">
            Placement & Partners
          </h2>
          <div className="w-24 h-1 bg-[#8F9E8B] mx-auto rounded-full" />
        </div>

        {/* 🚀 Intro statement */}
        <section className="bg-[#EAE6DC] rounded-xl p-8 sm:p-12 mb-20 border border-ochre/30 shadow-sm">
          <h3 className="font-sketch text-2xl sm:text-4xl text-espresso mb-6">
            Stepping into the Ecosystem
          </h3>
          <p className="font-hand text-lg sm:text-xl text-[#3A3A3A] leading-relaxed mb-6">
            {PLACEMENT_CONTENT.intro}
          </p>
          <p className="font-hand text-lg sm:text-xl text-[#5E605E] leading-relaxed">
            We operate in concert with progressive schools who actively seek to eliminate the conventional mechanisms of fear, comparisons, and grading, replacing them with observation circles, nature walks, and unburdensome exploration.
          </p>
        </section>

        {/* 🏫 School Grid / Logo Presentation */}
        <section className="mb-24">
          <div className="text-center mb-10">
            <h4 className="font-sketch text-2xl sm:text-3xl text-espresso">
              Pioneering Ecosystem Partners
            </h4>
            <p className="font-hand text-base text-[#656765] italic">
              Our trainees are prepared to step directly into spaces such as:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            {PLACEMENT_CONTENT.schools.map((school) => (
              <div
                key={school.name}
                className="bg-[#FAF9F5] rounded-xl p-6 sm:p-8 border border-ochre/20 shadow-sm hover:shadow-md hover:border-ochre/50 transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  {/* Monochromatic to full-color brand frame imitating Hand-drawn sign shape */}
                  <div className="w-full bg-[#E5E2D9] h-20 rounded border border-dashed border-ochre/50 flex flex-col items-center justify-center mb-6 transition-all duration-300 filter grayscale group-hover:grayscale-0 group-hover:bg-[#CBD5C8]/40">
                    <span className="font-sketch text-2xl tracking-wide text-espresso transition-all duration-300 group-hover:text-amber-900">
                      {school.logoText}
                    </span>
                    <span className="font-amatic text-xs tracking-wider text-terracotta uppercase font-bold mt-1">
                      {school.tagline}
                    </span>
                  </div>

                  <h5 className="font-sketch text-xl text-espresso mb-3 flex items-center justify-between">
                    <span>{school.name}</span>
                    <ArrowUpRight className="w-4 h-4 text-sage opacity-0 group-hover:opacity-100 transition-opacity" />
                  </h5>

                  <p className="font-hand text-base sm:text-lg text-[#5A5C5A] leading-relaxed">
                    {school.description}
                  </p>
                </div>

                <div className="mt-8 pt-4 border-t border-dashed border-[#DFDCDB] flex items-center justify-between font-hand text-sm text-[#7F817F]">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-terracotta" />
                    <span>Bangalore</span>
                  </span>
                  <span className="text-sage text-xs font-mono uppercase">ACTIVE OUTPOST</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 🤝 Call to Action for schools */}
        <section className="bg-slate-bg text-chalk-white border border-ochre rounded-xl p-8 sm:p-12 relative overflow-hidden shadow-lg">
          
          <div className="relative z-10 max-w-3xl">
            <div className="flex items-center gap-2 text-ochre font-amatic text-2xl font-bold uppercase tracking-widest mb-4">
              <Handshake className="w-6 h-6 text-ochre" />
              <span>Invite Our Trainees</span>
            </div>
            
            <h3 className="font-sketch text-3xl sm:text-4xl text-chalk-white mb-6 leading-tight">
              Does your school align with the philosophy of fearless, unhurried education?
            </h3>
            
            <p className="font-hand text-lg sm:text-xl text-espresso/85 leading-relaxed mb-8">
              {PLACEMENT_CONTENT.ctaText}
            </p>

            <button
              onClick={onContactClick}
              className="px-6 py-3 bg-sage hover:bg-[#A3B29F] text-slate-bg font-sketch text-base rounded shadow hover:shadow-lg transition-colors flex items-center gap-2"
              id="placement-invite-cta"
            >
              <span>Connect with Placement Network</span>
              <ExternalLink className="w-4 h-4 text-slate-bg" />
            </button>
          </div>
        </section>

      </div>
    </div>
  );
}
