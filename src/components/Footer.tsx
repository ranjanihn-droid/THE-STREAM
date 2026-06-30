import { Compass, Mail, Phone, Heart, Globe, ArrowUp, Instagram, Facebook } from "lucide-react";
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
              The Steam
            </h4>
            <span className="font-amatic text-sm text-[#5A5C5A] tracking-widest uppercase font-bold block mb-4">
              Educator Training Ground & Dialogue Hub
            </span>
            <p className="font-hand text-lg text-[#5A5C5A] leading-relaxed max-w-sm">
              An immersive 12-month preparation journey into Right Education and fearless pedagogy, preparing conscious teachers for Aranyaani, Aarohi, and democratic learning spaces in Bangalore.
            </p>
            
            {/* Social Media Handles */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 mt-6">
              <a 
                href="https://instagram.com/thestreamlearners" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-[#5A5C5A] hover:text-[#F37021] transition-colors flex items-center gap-1.5 font-hand text-lg font-semibold"
                title="Instagram"
              >
                <Instagram className="w-5 h-5 text-[#F37021]" />
                <span>Instagram: @thestreamlearners</span>
              </a>
              <a 
                href="https://facebook.com/thestreamlearners" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-[#5A5C5A] hover:text-[#F37021] transition-colors flex items-center gap-1.5 font-hand text-lg font-semibold"
                title="Facebook"
              >
                <Facebook className="w-5 h-5 text-[#F37021]" />
                <span>Facebook: @thestreamlearners</span>
              </a>
            </div>
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
              <span className="font-semibold inline-flex items-center gap-1.5 text-[#25D366]">
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current shrink-0">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.458 5.704 1.459h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                WhatsApp Chatbot:
              </span>{" "}
              <a href="https://wa.me/917022973023" target="_blank" rel="noopener noreferrer" className="hover:text-[#25D366] font-semibold">
                7022973023
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
              <span>The Steam Education Circle</span>
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
