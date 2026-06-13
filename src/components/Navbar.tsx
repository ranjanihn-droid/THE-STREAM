import { useState } from "react";
import { Menu, X, Compass, Info, BookOpen, Handshake, Image, Mail, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import StreamLogo from "./StreamLogo";

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function Navbar({ activeTab, setActiveTab }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { id: "home", label: "Home", icon: Compass },
    { id: "about", label: "About", icon: Info },
    { id: "programs", label: "Programs & Admissions", icon: BookOpen },
    { id: "placement", label: "Placement & Partners", icon: Handshake },
    { id: "gallery", label: "Gallery", icon: Image },
    { id: "contact", label: "Contact", icon: Mail },
  ];

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    setIsOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-[#F37021] text-[#1A1D1C] shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between min-h-24 sm:min-h-28 py-2 md:py-3">
          
          {/* Logo Brand Section with Custom Hand-Drawn Tree Illustration & High-Contrast Tagline */}
          <div className="flex-shrink-0 flex items-center gap-3">
            <button
              onClick={() => handleTabClick("home")}
              className="text-left group focus:outline-none"
              aria-label="The Stream Home"
            >
              <StreamLogo inverse={false} />
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:ml-6 md:flex md:items-center md:space-x-1 lg:space-x-3">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabClick(item.id)}
                  className={`relative px-3 py-2 rounded-md font-hand text-lg tracking-wide transition-all duration-300 flex items-center gap-1 focus:outline-none ${
                    isActive
                      ? "text-[#F37021] font-bold"
                      : "text-[#5A5C5A] hover:text-[#1A1D1C] hover:translate-y-[-1px]"
                  }`}
                  id={`nav-item-${item.id}`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-[#F37021]" : "text-[#5A5C5A]"}`} />
                  <span>{item.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="activeNavIndicator"
                      className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#F37021] rounded-full"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
            
            {/* Call to action element in navbar */}
            <button
              onClick={() => handleTabClick("programs")}
              className="ml-4 px-4 py-2 bg-[#F37021] hover:bg-[#E05A10] text-white font-sketch text-sm rounded shadow-sm hover:shadow-md active:translate-y-[1px] transition-all flex items-center gap-2 border border-[#1A1D1C]"
              id="nav-cta-explore"
            >
              Explore Programs
              <ArrowRight className="w-4 h-4 text-white" />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-[#1A1D1C] hover:text-[#F37021] focus:outline-none bg-[#FAF9F6] border border-[#DDDCDA]"
              aria-expanded="false"
              id="mobile-menu-btn"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="md:hidden bg-white border-t border-[#F37021] overflow-hidden shadow-inner"
          >
            <div className="px-2 pt-2 pb-6 space-y-1 sm:px-3">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleTabClick(item.id)}
                    className={`nav-mobile-item flex items-center gap-1.5 w-full px-4 py-3 rounded-md font-hand text-xl text-left transition-colors ${
                      isActive
                        ? "bg-amber-50 text-[#F37021] border-l border-[#F37021] font-bold"
                        : "text-[#5A5C5A] hover:bg-gray-50 hover:text-[#1A1D1C]"
                    }`}
                  >
                    <Icon className="w-4.5 h-4.5 text-[#F37021] shrink-0" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
              <div className="pt-4 px-4">
                <button
                  onClick={() => handleTabClick("programs")}
                  className="w-full flex justify-center items-center gap-2 py-3 bg-[#F37021] hover:bg-[#E05A10] text-white font-sketch text-lg rounded shadow-sm border border-[#1A1D1C]"
                >
                  Explore Our Programs
                  <ArrowRight className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
