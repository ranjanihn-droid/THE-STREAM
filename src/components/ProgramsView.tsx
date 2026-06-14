import { BookOpen, Calendar, MapPin, Sparkles, Heart, Brain, Users, Compass, HelpCircle, ExternalLink } from "lucide-react";
import { CORE_PROGRAM, INCLUSIVE_PROGRAM, PARENT_PROGRAM } from "../data";
import { motion } from "motion/react";

export default function ProgramsView() {
  return (
    <div className="bg-[#FAF9F6] min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Page Head */}
        <div className="text-center mb-16">
          <span className="text-[#F37021] font-amatic text-2xl font-bold tracking-widest uppercase">
            Evolve and Facilitate
          </span>
          <h2 className="font-sketch text-4xl sm:text-6xl text-espresso mt-2 mb-4">
            Programs & Admissions
          </h2>
          <div className="w-24 h-1 bg-[#F37021] mx-auto rounded-full mt-4" />
        </div>

        {/* 🧘 J. Krishnamurti Dialogue Quote Card */}
        <motion.section 
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 bg-[#FAF9F6] rounded-2xl p-8 sm:p-12 border border-[#1A1D1C]/15 shadow-sm relative text-center max-w-4xl mx-auto"
        >
          <div className="absolute top-2 left-6 text-[#F37021]/15 font-serif text-8xl pointer-events-none select-none">“</div>
          <div className="relative z-10">
            <h3 className="font-sketch text-2xl sm:text-3xl text-espresso mb-4">
              The Essence of Dialogue
            </h3>
            <p className="font-hand text-xl sm:text-2xl text-[#1A1D1C] leading-relaxed italic mb-6">
              "A dialogue is very important. It is a form of communication in which question and answer continue till a question is left without an answer. Thus the question is suspended between the two persons involved in this answer and question. It is like a bud with untouched blossoms . . . If the question is left totally untouched by thought, it then has its own answer because the questioner and answerer, as persons, have disappeared. This is a form of dialogue in which investigation reaches a certain point of intensity and depth, which then has a quality that thought can never reach."
            </p>
            <span className="font-sketch text-lg text-[#F37021] tracking-wide block border-t border-[#1A1D1C]/10 pt-4 mt-6">
              — Jiddu Krishnamurti
            </span>
          </div>
          <div className="absolute bottom-2 right-6 text-[#F37021]/15 font-serif text-8xl pointer-events-none select-none">”</div>
        </motion.section>

        {/* 🌟 1. MSKTW Framework Intro Callout Card */}
        <motion.section 
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 bg-[#EDEAE2] rounded-2xl p-6 sm:p-8 border border-dashed border-[#F37021]/30 shadow-sm relative overflow-hidden"
        >
          <div className="absolute top-[-20px] right-[-20px] text-[#F37021]/5 select-none font-sketch text-[100px] leading-none pointer-events-none">
            STREAM
          </div>
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6 relative z-10">
            <div className="p-4 bg-[#F37021]/10 rounded-full text-[#F37021] shrink-0">
              <Sparkles className="w-8 h-8" />
            </div>
            <div>
              <h3 className="font-sketch text-2xl sm:text-3xl text-espresso mb-2">
                Our Foundational Framework
              </h3>
              <p className="font-hand text-lg sm:text-xl text-[#3A3A3A] leading-relaxed">
                Our offerings, facilitated in association with NeeAr (STREAM _ NeeAr_TTP), are designed around a powerful developmental framework: <strong className="text-[#F37021] font-sketch text-xl">MSKTW</strong> (Mindset, Skill set, Knowledge set, Tool set, and Wisdom set).
              </p>
            </div>
          </div>
        </motion.section>

        {/* 📚 2. Core Educator Training Program Section */}
        <section className="mb-24" id="core-educator-program">
          <div className="bg-white rounded-2xl p-6 sm:p-10 border border-[#1A1D1C]/15 mb-12 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 w-2 h-full bg-[#F37021]" />
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-6 border-b border-[#E5E2D9]">
              <div>
                <span className="px-3 py-1 bg-amber-50 text-[#F37021] font-amatic text-lg tracking-wider font-bold rounded-full uppercase border border-[#F37021]/30">
                  Flagship offering
                </span>
                <h3 className="font-sketch text-3xl sm:text-4xl text-espresso mt-2">
                  {CORE_PROGRAM.title}
                </h3>
                <p className="font-hand text-base text-[#F37021] tracking-wide mt-1 italic">
                  {CORE_PROGRAM.tagline}
                </p>
              </div>
              <div className="flex items-center gap-2 bg-[#1A1D1C] text-white py-2.5 px-5 rounded-md font-sketch text-lg border border-[#1A1D1C] shadow-inner self-start md:self-center">
                <Calendar className="w-5 h-5 text-[#F37021]" />
                <span>{CORE_PROGRAM.duration}</span>
              </div>
            </div>

            <p className="font-hand text-xl sm:text-2xl text-[#1A1D1C] leading-relaxed mb-4">
              {CORE_PROGRAM.description}
            </p>
            <p className="font-hand text-lg text-[#5A5C5A] leading-relaxed italic">
              {CORE_PROGRAM.framework}
            </p>
          </div>

          {/* ⏳ Vertical Phases Details Timeline */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
            
            {/* Phase 1 Detail Card */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-[#FAF9F6] rounded-xl p-6 sm:p-8 border border-[#1A1D1C]/15 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between border-b border-[#DDD9CE] pb-3 mb-4">
                  <span className="text-[#F37021] font-sketch text-xl sm:text-2xl uppercase tracking-wide">
                    {CORE_PROGRAM.phase1Title}
                  </span>
                  <span className="font-sketch text-base bg-amber-50 text-[#F37021] px-3 py-1 rounded border border-[#F37021]/20">
                    Months 1 - 6
                  </span>
                </div>
                
                <h4 className="font-sketch text-2xl sm:text-3xl text-espresso mb-4">
                  {CORE_PROGRAM.phase1Duration}
                </h4>
                
                <p className="font-hand text-lg sm:text-xl text-[#3A3A3A] leading-relaxed mb-6">
                  {CORE_PROGRAM.phase1Description}
                </p>
              </div>

              <div className="bg-white p-4 rounded border border-[#1A1D1C]/10 text-xs font-mono text-[#5A5C5A] uppercase tracking-wider">
                🎯 Build mindsets, hone facilitation skills, explore pedagogical unlearning.
              </div>
            </motion.div>

            {/* Phase 2 Detail Card */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-[#FAF9F6] rounded-xl p-6 sm:p-8 border border-[#1A1D1C]/15 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between border-b border-[#DDD9CE] pb-3 mb-4">
                  <span className="text-[#F37021] font-sketch text-xl sm:text-2xl uppercase tracking-wide">
                    {CORE_PROGRAM.phase2Title}
                  </span>
                  <span className="font-sketch text-base bg-amber-50 text-[#F37021] px-3 py-1 rounded border border-[#F37021]/20">
                    Months 7 - 9
                  </span>
                </div>
                
                <h4 className="font-sketch text-2xl sm:text-3xl text-espresso mb-4">
                  {CORE_PROGRAM.phase2Duration}
                </h4>
                
                <p className="font-hand text-lg sm:text-xl text-[#3A3A3A] leading-relaxed mb-6">
                  {CORE_PROGRAM.phase2Description}
                </p>
              </div>

              <div className="bg-white p-4 rounded border border-[#1A1D1C]/10 text-xs font-mono text-[#5A5C5A] uppercase tracking-wider flex items-center gap-1">
                <MapPin className="w-4.5 h-4.5 text-[#F37021]" />
                <span>Hands-on Internship in pioneering Bangalore pedagogical schools.</span>
              </div>
            </motion.div>

          </div>
        </section>

        {/* 🧠 3. Teacher to Educator - Inclusive Educator Programme */}
        <section className="mb-24" id="inclusive-educator">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-[#FAF9F6] rounded-2xl p-6 sm:p-10 border border-[#1A1D1C]/15 shadow-sm relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 h-full w-2 bg-[#F37021]" />
            
            <div className="mb-6">
              <span className="px-3 py-1 bg-amber-50 text-[#F37021] font-amatic text-xl tracking-wider font-bold rounded-full uppercase border border-[#F37021]/30">
                {INCLUSIVE_PROGRAM.tagline}
              </span>
              <h3 className="font-sketch text-3xl sm:text-5xl text-espresso mt-3">
                {INCLUSIVE_PROGRAM.title}
              </h3>
              <p className="font-hand text-xl sm:text-2xl text-[#1A1D1C]/80 italic mt-2">
                {INCLUSIVE_PROGRAM.description}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              {INCLUSIVE_PROGRAM.points.map((point, idx) => (
                <div 
                  key={idx}
                  className="bg-white p-5 rounded-xl border border-[#1A1D1C]/10 flex gap-4 hover:shadow-md transition-shadow relative overflow-hidden"
                >
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-[#F37021]" />
                  <div className="w-8 h-8 rounded-full bg-amber-50 text-[#F37021] border border-[#F37021]/30 flex items-center justify-center font-sketch text-base shrink-0">
                    {idx + 1}
                  </div>
                  <p className="font-hand text-lg text-espresso leading-relaxed">
                    {point}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-4 border-t border-[#DFDCDB] flex justify-end text-xs font-mono text-[#5A5C5A]">
              <span>★ INCLUSIVE EDUCATION METHODOLOGY</span>
            </div>
          </motion.div>
        </section>

        {/* 🏡 4. Inclusive Education – A Parent Programme Section */}
        <section className="bg-[#FAF9F6] -mx-4 sm:mx-0 rounded-2xl p-6 sm:p-10 border border-[#1A1D1C]/15 shadow-sm" id="parent-programme">
          
          <div className="max-w-3xl mx-auto text-center mb-12">
            <span className="text-[#F37021] font-amatic text-2xl font-bold tracking-widest uppercase">
              Support at Home
            </span>
            <h3 className="font-sketch text-3xl sm:text-5xl text-espresso mt-2 mb-4">
              {PARENT_PROGRAM.title}
            </h3>
            <p className="font-hand text-lg sm:text-xl text-[#1A1D1C]/80 leading-relaxed">
              {PARENT_PROGRAM.description}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
            
            {/* Format Structure Card */}
            <div className="bg-white rounded-xl p-6 sm:p-8 border border-[#1A1D1C]/10 flex flex-col justify-between hover:shadow-lg transition-shadow relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-[#F37021]" />
              <div className="flex gap-4 items-start pl-2">
                <div className="p-3 bg-amber-50 text-[#F37021] rounded-xl shrink-0 border border-[#F37021]/20">
                  <Calendar className="w-6 h-6 text-[#F37021]" />
                </div>
                <div>
                  <h4 className="font-sketch text-xl sm:text-2xl text-espresso">
                    Program Format
                  </h4>
                  <p className="font-hand text-lg text-[#5A5C5A] leading-normal uppercase text-xs tracking-wider mt-1">
                    Rolling intake every 6 weeks
                  </p>
                  <p className="font-hand text-lg sm:text-xl text-espresso mt-3 leading-relaxed">
                    {PARENT_PROGRAM.details.format}
                  </p>
                </div>
              </div>
            </div>

            {/* Focus Area Card */}
            <div className="bg-white rounded-xl p-6 sm:p-8 border border-[#1A1D1C]/10 flex flex-col justify-between hover:shadow-lg transition-shadow relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-[#F37021]" />
              <div className="flex gap-4 items-start pl-2">
                <div className="p-3 bg-amber-50 text-[#F37021] rounded-xl shrink-0 border border-[#F37021]/20">
                  <Brain className="w-6 h-6 text-[#F37021]" />
                </div>
                <div>
                  <h4 className="font-sketch text-xl sm:text-2xl text-espresso">
                    Detailed Focus
                  </h4>
                  <p className="font-hand text-lg text-[#5A5C5A] leading-normal uppercase text-xs tracking-wider mt-1">
                    The 4Ds of Inclusive Education
                  </p>
                  <p className="font-hand text-lg sm:text-xl text-espresso mt-3 leading-relaxed">
                    {PARENT_PROGRAM.details.focus}
                  </p>
                </div>
              </div>
            </div>

            {/* Application Practice Card */}
            <div className="bg-white rounded-xl p-6 sm:p-8 border border-[#1A1D1C]/10 flex flex-col justify-between hover:shadow-lg transition-shadow relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-[#F37021]" />
              <div className="flex gap-4 items-start pl-2">
                <div className="p-3 bg-amber-50 text-[#F37021] rounded-xl shrink-0 border border-[#F37021]/20">
                  <Compass className="w-6 h-6 text-[#F37021]" />
                </div>
                <div>
                  <h4 className="font-sketch text-xl sm:text-2xl text-espresso">
                    Practical Application
                  </h4>
                  <p className="font-hand text-lg text-[#5A5C5A] leading-normal uppercase text-xs tracking-wider mt-1">
                    Guidance and classroom observation
                  </p>
                  <p className="font-hand text-lg sm:text-xl text-espresso mt-3 leading-relaxed">
                    {PARENT_PROGRAM.details.application}
                  </p>
                </div>
              </div>
            </div>

            {/* Growth & Mindset Card */}
            <div className="bg-white rounded-xl p-6 sm:p-8 border border-[#1A1D1C]/10 flex flex-col justify-between hover:shadow-lg transition-shadow relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-[#F43F5E]" />
              <div className="flex gap-4 items-start pl-2">
                <div className="p-3 bg-rose-50 text-[#F43F5E] rounded-xl shrink-0 border border-rose-200">
                  <Heart className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-sketch text-xl sm:text-2xl text-espresso">
                    Mindfulness & Growth
                  </h4>
                  <p className="font-hand text-lg text-[#5A5C5A] leading-normal uppercase text-xs tracking-wider mt-1">
                    MSKTW of Inclusive Parenting
                  </p>
                  <p className="font-hand text-lg sm:text-xl text-espresso mt-3 leading-relaxed">
                    {PARENT_PROGRAM.details.growth}
                  </p>
                </div>
              </div>
            </div>

          </div>

          <div className="mt-8 text-center text-xs font-mono text-[#5A5C5A] uppercase tracking-widest">
            ★ INTIMATE DIALOGUE GROUPS • HOLISTIC LIVING PRINCIPLES
          </div>
        </section>

        {/* 🎬 5. Dialogue Screenings & Watch Suggestions Section */}
        <section className="mt-24 mb-16" id="watch-suggestions">
          <div className="text-center mb-12">
            <span className="text-[#F37021] font-amatic text-2xl font-bold tracking-widest uppercase mb-1 block">
              Dialogue Screenings
            </span>
            <h3 className="font-sketch text-3xl sm:text-5xl text-espresso mt-2 mb-4">
              Watch Suggestions
            </h3>
            <p className="font-hand text-lg sm:text-xl text-[#1A1D1C]/80 leading-relaxed max-w-2xl mx-auto">
              Selected lectures and foundational dialogues on the nature of enquiry, observation, and right learning.
            </p>
            <div className="w-16 h-1 bg-[#F37021] mx-auto rounded-full mt-4" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Video One */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white rounded-2xl border border-[#1A1D1C]/15 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col h-full"
            >
              <div className="aspect-video w-full bg-black relative">
                <iframe
                  src="https://www.youtube.com/embed/IEEg6dwYrxk"
                  title="What is the Purpose of Education? | J. Krishnamurti"
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
              <div className="p-6 flex flex-col flex-grow justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="font-mono text-[9px] text-[#F37021] uppercase tracking-wider px-2 py-0.5 bg-amber-50 border border-[#F37021]/20 rounded font-semibold">
                      Education
                    </span>
                    <span className="font-mono text-[9px] text-stone-500 uppercase tracking-wider">
                      ~10 mins
                    </span>
                  </div>
                  <h4 className="font-sketch text-xl text-espresso mb-3 leading-tight">
                    What is the Purpose of Education?
                  </h4>
                  <p className="font-hand text-base text-[#5A5C5A] leading-relaxed mb-4">
                    An intense inquiry into whether education is merely acquiring skills and career security, or if it is the awakening of intelligence to understand life as a whole.
                  </p>
                </div>
                <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                  <span className="font-mono text-[10px] text-stone-400 uppercase tracking-widest">
                    J. Krishnamurti
                  </span>
                  <a 
                    href="https://youtu.be/IEEg6dwYrxk"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-mono text-[#F37021] hover:underline flex items-center gap-1"
                  >
                    <span>YouTube</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </motion.div>

            {/* Video Two */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white rounded-2xl border border-[#1A1D1C]/15 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col h-full"
            >
              <div className="aspect-video w-full bg-black relative">
                <iframe
                  src="https://www.youtube.com/embed/5fRbafjn12Y"
                  title="To Learn, You Must Have a Quiet Mind | J. Krishnamurti"
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
              <div className="p-6 flex flex-col flex-grow justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="font-mono text-[9px] text-[#F37021] uppercase tracking-wider px-2 py-0.5 bg-amber-50 border border-[#F37021]/20 rounded font-semibold">
                      Learning
                    </span>
                    <span className="font-mono text-[9px] text-stone-500 uppercase tracking-wider">
                      ~15 mins
                    </span>
                  </div>
                  <h4 className="font-sketch text-xl text-espresso mb-3 leading-tight">
                    To Learn, You Must Have a Quiet Mind
                  </h4>
                  <p className="font-hand text-base text-[#5A5C5A] leading-relaxed mb-4">
                    J. Krishnamurti discusses how a mind burdened with comparison, competition, and authority cannot learn. Real learning demands the freedom of an unburdened mind.
                  </p>
                </div>
                <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                  <span className="font-mono text-[10px] text-stone-400 uppercase tracking-widest">
                    J. Krishnamurti
                  </span>
                  <a 
                    href="https://youtu.be/5fRbafjn12Y"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-mono text-[#F37021] hover:underline flex items-center gap-1"
                  >
                    <span>YouTube</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </motion.div>

            {/* Video Three */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-white rounded-2xl border border-[#1A1D1C]/15 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col h-full"
            >
              <div className="aspect-video w-full bg-black relative">
                <iframe
                  src="https://www.youtube.com/embed/DEBE_PXCb_Y"
                  title="Can you observe without the observer? | J. Krishnamurti"
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
              <div className="p-6 flex flex-col flex-grow justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="font-mono text-[9px] text-[#F37021] uppercase tracking-wider px-2 py-0.5 bg-amber-50 border border-[#F37021]/20 rounded font-semibold">
                      Inquiry
                    </span>
                    <span className="font-mono text-[9px] text-stone-500 uppercase tracking-wider">
                      ~12 mins
                    </span>
                  </div>
                  <h4 className="font-sketch text-xl text-espresso mb-3 leading-tight">
                    Observation Without the Observer
                  </h4>
                  <p className="font-hand text-base text-[#5A5C5A] leading-relaxed mb-4">
                    Investigating the deep division between the thinker and the thought. Discovering how a state of pure observing unlocks deep awareness without intellectual conflict.
                  </p>
                </div>
                <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                  <span className="font-mono text-[10px] text-stone-400 uppercase tracking-widest">
                    J. Krishnamurti
                  </span>
                  <a 
                    href="https://youtu.be/DEBE_PXCb_Y"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-mono text-[#F37021] hover:underline flex items-center gap-1"
                  >
                    <span>YouTube</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

      </div>
    </div>
  );
}
