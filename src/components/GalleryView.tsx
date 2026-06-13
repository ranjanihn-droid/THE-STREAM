import { useState } from "react";
import { Maximize2, X, Aperture, Video } from "lucide-react";
import { GALLERY_ITEMS } from "../data";
import { GalleryItem } from "../types";
import { motion, AnimatePresence } from "motion/react";

// Converts standard OneDrive share links to direct downloadable/renderable asset links
const getOneDriveDirectUrl = (sharingUrl: string) => {
  if (!sharingUrl) return "";
  if (sharingUrl.startsWith("/") || sharingUrl.startsWith(".") || !sharingUrl.startsWith("http")) {
    return sharingUrl;
  }
  try {
    const cleanUrl = sharingUrl.split("?")[0];
    const base64 = btoa(cleanUrl)
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");
    return `https://api.onedrive.com/v1.0/shares/u!${base64}/root/content`;
  } catch {
    return sharingUrl;
  }
};

export default function GalleryView() {
  const [lightboxItem, setLightboxItem] = useState<GalleryItem | null>(null);

  // Dynamic responsive heights based on index for true organic masonry aesthetic
  const getCardHeight = (index: number) => {
    const dynamicHeights = [
      "h-[390px] sm:h-[450px]",
      "h-[320px] sm:h-[350px]",
      "h-[360px] sm:h-[390px]",
    ];
    return dynamicHeights[index % dynamicHeights.length];
  };

  return (
    <div className="bg-[#FAF9F6] min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Page Head */}
        <div className="text-center mb-16">
          <span className="text-[#F37021] font-amatic text-2xl font-bold tracking-widest uppercase">
            Aesthetic Realities
          </span>
          <h2 className="font-sketch text-4xl sm:text-6xl text-[#1A1D1C] mt-2 mb-4">
            Visualizing the Journey
          </h2>
          <p className="font-hand text-xl text-[#5A5C5A] max-w-2xl mx-auto">
            A curated selection capturing the active training rounds, the environments we study, and the unhurried pedagogy of our educational circle.
          </p>
          <div className="w-24 h-1 bg-[#F37021] mx-auto rounded-full mt-6" />
        </div>

        {/* 🎥 Featured Video Session: The Stream in Practice */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16 bg-white rounded-2xl border border-[#1A1D1C]/15 shadow-sm p-4 sm:p-6 md:p-8 max-w-4xl mx-auto"
        >
          <div className="text-center mb-6 flex flex-col items-center">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-50 text-[#F43F5E] text-xs font-mono uppercase tracking-wider rounded-md border border-rose-100 mb-2">
              <Video className="w-3.5 h-3.5" /> Featured Dialogue Clip
            </span>
            <h3 className="font-sketch text-2xl sm:text-3xl text-[#1a1d1c]">
              Experiencing the Unhurried Dialogue
            </h3>
            <p className="font-hand text-base text-[#5A5C5A] max-w-xl mx-auto mt-1">
              Step directly inside active modules and outdoor pedagogical forums exploring Right Education with trainers and active cohorts.
            </p>
          </div>
          
          {/* Responsive aspect ratio container for OneDrive Video Iframe */}
          <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-black border border-[#1A1D1C]/15 shadow-md">
            <iframe 
              src="https://1drv.ms/v/c/4dae11835575d5c1/IQRQl9Ix7av7R4lz4RoX0MghASpRpmDpOTQ-50QLiPMlvoo" 
              width="100%" 
              height="100%" 
              frameBorder="0" 
              scrolling="no" 
              allowFullScreen
              className="absolute inset-0 w-full h-full"
            ></iframe>
          </div>
        </motion.div>

        {/* 🖼️ Masonry Photo-Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20 items-start">
          {GALLERY_ITEMS.map((item, index) => {
            const rawUrl = getOneDriveDirectUrl(item.imageSrc);
            return (
              <div 
                key={item.title}
                onClick={() => setLightboxItem(item)}
                className={`bg-white rounded-2xl overflow-hidden border border-[#1A1D1C]/15 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer group flex flex-col justify-between ${getCardHeight(index)}`}
                id={`gallery-item-${index}`}
              >
                {/* Image Container with Hover Overlay */}
                <div className="relative w-full flex-grow overflow-hidden bg-[#FAF9F6]">
                  <img
                    src={rawUrl}
                    alt={item.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    loading="lazy"
                  />

                  {/* Hover Visual Overlay */}
                  <div className="absolute inset-0 bg-[#1A1D1C]/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="p-3 bg-white rounded-full shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                      <Maximize2 className="w-6 h-6 text-[#F37021]" />
                    </div>
                  </div>
                </div>

                {/* Text detail bar */}
                <div className="p-5 bg-white border-t border-[#1A1D1C]/10">
                  <div className="flex items-center gap-1.5 text-[#F37021] font-amatic text-lg font-bold uppercase tracking-wider mb-1">
                    <Aperture className="w-3.5 h-3.5" />
                    <span>Scene {index + 1}</span>
                  </div>
                  <h3 className="font-sketch text-xl text-[#1a1d1c] mb-1">
                    {item.title}
                  </h3>
                  <p className="font-hand text-base text-[#5A5C5A] line-clamp-2">
                    {item.description}
                  </p>
                </div>

              </div>
            );
          })}
        </div>

        {/* Disclaimer / Note at footer of gallery */}
        <div className="max-w-xl mx-auto bg-white text-center p-6 rounded-2xl border border-[#1A1D1C]/15">
          <p className="font-hand text-lg text-[#1a1d1c]/80 leading-relaxed">
            🌿 <strong className="text-[#F37021]">Continuous Updates:</strong> Authentic, live photographs of ongoing <strong>NeeAr</strong> workshops and special Bangalore projects are captured regularly by our facilitators and mentors.
          </p>
        </div>

        {/* 🌌 Lightbox Overlay Modal */}
        <AnimatePresence>
          {lightboxItem && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-[#1A1D1C]/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
              onClick={() => setLightboxItem(null)}
            >
              <button 
                onClick={() => setLightboxItem(null)}
                className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white text-white hover:text-[#1A1D1C] transition-colors z-50"
              >
                <X className="w-6 h-6" />
              </button>

              <motion.div 
                initial={{ scale: 0.95, y: 15 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 15 }}
                className="bg-white max-w-4xl w-full rounded-2xl overflow-hidden shadow-2xl border border-[#1A1D1C] flex flex-col md:flex-row"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Left (Image section) */}
                <div className="md:w-3/5 bg-[#1A1D1C] relative max-h-[50vh] md:max-h-[75vh] overflow-hidden flex items-center justify-center">
                  <img
                    src={getOneDriveDirectUrl(lightboxItem.imageSrc)}
                    alt={lightboxItem.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-contain max-h-[50vh] md:max-h-[75vh]"
                  />
                </div>

                {/* Right (Information details in neat educator handwriting) */}
                <div className="md:w-2/5 p-8 sm:p-10 flex flex-col justify-between bg-white text-[#1a1d1c]">
                  <div>
                    <span className="text-[#F37021] font-amatic text-2xl font-bold tracking-widest uppercase">
                      The Stream Experience
                    </span>
                    <h3 className="font-sketch text-2xl sm:text-3xl text-[#1a1d1c] mt-2 mb-6">
                      {lightboxItem.title}
                    </h3>
                    <p className="font-hand text-xl text-[#3A3A3A] leading-relaxed mb-6">
                      {lightboxItem.description}
                    </p>
                  </div>

                  <div className="border-t border-[#1A1D1C]/10 pt-6 flex flex-col gap-3 font-hand text-sm text-[#5A5C5A]">
                    <div className="flex justify-between">
                      <span>LOCATION</span>
                      <span className="font-bold text-[#1a1d1c]">Bangalore, IN</span>
                    </div>
                    <div className="flex justify-between">
                      <span>FACILITATION</span>
                      <span className="font-bold text-[#F37021]">NeeAr Curriculum</span>
                    </div>
                    <div className="flex justify-between text-xs font-mono pt-2">
                      <span>© STREAM ARCHIVES</span>
                      <span>SEC - {lightboxItem.title.toUpperCase().slice(0, 5)}</span>
                    </div>
                  </div>
                </div>

              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
