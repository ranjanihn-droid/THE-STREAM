import { Compass, Mail, Phone, Heart, Globe, ArrowUp } from "lucide-react";
import { CONTACT_INFO } from "../data";

interface FooterProps {
  setActiveTab: (tab: string) => void;
}

export default function Footer({ setActiveTab }: FooterProps) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-[#FAF9F6] text-[#1A1D1C] border-t border-[#F37021] pt-16 pb-12 px-4 sm:px-6 lg:px-8 relative" id="site-footer">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-10 border-b border-[#1A1D1C]/10 pb-12 mb-10">
        
        {/* Col 1: Description & Core Association (5 columns) */}
        <div className="md:col-span-5 flex flex-col justify-between">
          <div>
            <h4 className="font-sketch text-3xl text-[#F37021] tracking-wide mb-3">
              The Stream
            </h4>
            <span className="font-amatic text-sm text-[#5A5C5A] tracking-widest uppercase font-bold block mb-4">
              Educator Training Ground & Dialogue Hub
            </span>
            <p className="font-hand text-lg text-[#5A5C5A] leading-relaxed max-w-sm">
              An immersive 9-month preparation journey into Right Education and fearless pedagogy, preparing conscious teachers for Aranyaani, Aarohi, and democratic learning spaces in Bangalore.
            </p>
          </div>
          
          <div className="mt-8 font-hand text-xs text-[#5A5C5A]">
            <span>An initiative of the registered charity <strong>The F.O.R.E. (Foundation for Right Education) Trust</strong>.</span>
          </div>
        </div>

        {/* Col 2: Navigation Map Links (3 columns) */}
        <div className="md:col-span-3">
          <h5 className="font-sketch text-xl text-[#F37021] tracking-wide mb-6">
            Explore Ecosystem
          </h5>
          <ul className="space-y-3 font-hand text-lg text-[#5A5C5A]">
            <li>
              <button 
                onClick={() => { setActiveTab("home"); scrollToTop(); }}
                className="hover:text-[#F37021] hover:translate-x-1 transition-all flex items-center gap-2"
              >
                <span>Home Page</span>
              </button>
            </li>
            <li>
              <button 
                onClick={() => { setActiveTab("about"); scrollToTop(); }}
                className="hover:text-[#F37021] hover:translate-x-1 transition-all flex items-center gap-2"
              >
                <span>Our Philosophical Anchor</span>
              </button>
            </li>
            <li>
              <button 
                onClick={() => { setActiveTab("programs"); scrollToTop(); }}
                className="hover:text-[#F37021] hover:translate-x-1 transition-all flex items-center gap-2"
              >
                <span>Program Modules & Admission</span>
              </button>
            </li>
            <li>
              <button 
                onClick={() => { setActiveTab("placement"); scrollToTop(); }}
                className="hover:text-[#F37021] hover:translate-x-1 transition-all flex items-center gap-2"
              >
                <span>Placement & Partners</span>
              </button>
            </li>
            <li>
              <button 
                onClick={() => { setActiveTab("gallery"); scrollToTop(); }}
                className="hover:text-[#F37021] hover:translate-x-1 transition-all flex items-center gap-2"
              >
                <span>Gallery & Visuals</span>
              </button>
            </li>
          </ul>
        </div>

        {/* Col 3: Quick Desk Contacts (4 columns) */}
        <div className="md:col-span-4">
          <h5 className="font-sketch text-xl text-[#F37021] tracking-wide mb-6">
            Coordinator Assistance
          </h5>
          
          <div className="space-y-4 font-hand text-lg text-[#5A5C5A] uppercase">
            <p className="flex items-center gap-2.5">
              <Phone className="w-4.5 h-4.5 text-[#F37021] shrink-0" />
              <span>Contact: {CONTACT_INFO.contactPerson}</span>
            </p>
            <p className="flex items-center gap-2.5 pl-7 -mt-2">
              <a href={`tel:${CONTACT_INFO.phone}`} className="hover:text-[#F37021] font-semibold">
                {CONTACT_INFO.phone}
              </a>
            </p>
            <p className="flex items-center gap-2.5">
              <Mail className="w-4.5 h-4.5 text-[#F37021] shrink-0" />
              <a href={`mailto:${CONTACT_INFO.email}`} className="hover:text-[#F37021] font-semibold">
                {CONTACT_INFO.email}
              </a>
            </p>
            <p className="flex items-center gap-2.5">
              <Globe className="w-4.5 h-4.5 text-[#F37021] shrink-0" />
              <span className="font-semibold">{CONTACT_INFO.website}</span>
            </p>
          </div>

          <div className="mt-8 p-4 bg-white rounded border border-[#1A1D1C]/20 inline-block shadow-sm">
            <span className="font-amatic text-sm text-[#F37021] tracking-widest uppercase block mb-1">
              Curriculum Facilitators
            </span>
            <div className="font-sketch text-sm text-[#1A1D1C] flex flex-col gap-0.5">
              <span>The Stream Education Circle</span>
              <span className="font-hand text-xs text-[#5A5C5A] text-center">&amp;</span>
              <span>NeeAr team</span>
            </div>
          </div>
        </div>

      </div>

      {/* Corporate Metadata bottom bar */}
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-hand text-[#5A5C5A]">
        
        <div className="text-center sm:text-left flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
          <p>© {new Date().getFullYear()} {CONTACT_INFO.legalEntity}. All human rights observed.</p>
          <span className="hidden sm:inline text-gray-300">|</span>
          <button
            onClick={() => { setActiveTab("staff"); scrollToTop(); }}
            className="hover:text-[#F37021] underline cursor-pointer transition-colors focus:outline-none"
            id="staff-portal-button"
          >
            Staff Portal
          </button>
        </div>

        <button 
          onClick={scrollToTop}
          className="p-3 bg-[#F37021] hover:bg-[#E05A10] rounded-full text-white transition-all flex items-center justify-center border border-[#1A1D1C]"
          aria-label="Scroll to top"
          id="scroll-to-top-button"
        >
          <ArrowUp className="w-4 h-4 text-white" />
        </button>

      </div>
    </footer>
  );
}
