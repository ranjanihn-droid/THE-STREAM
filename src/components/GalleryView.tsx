import { useState, useEffect, useRef, KeyboardEvent } from "react";
import { 
  ChevronLeft, 
  ChevronRight, 
  Play, 
  Pause, 
  Maximize2, 
  X, 
  Aperture, 
  Video, 
  Image as ImageIcon,
  Grid,
  Sparkles,
  Layers,
  ArrowRight
} from "lucide-react";
import { GALLERY_ITEMS, JK_VIDEOS } from "../data";
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

// Extracts YouTube video ID from standard watch or sharing links
const getYoutubeId = (url: string) => {
  if (!url) return "";
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : "";
};

export default function GalleryView() {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Pre-resolve all local variables immediately for ultra-fast, responsive rendering
  const [resolvedUrls, setResolvedUrls] = useState<Record<string, string>>(() => {
    const initialUrls: Record<string, string> = {};
    GALLERY_ITEMS.forEach((item) => {
      initialUrls[item.imageSrc] = item.imageSrc;
    });
    return initialUrls;
  });

  const [loadingItems, setLoadingItems] = useState<Record<string, boolean>>(() => {
    const initialLoading: Record<string, boolean> = {};
    GALLERY_ITEMS.forEach((item) => {
      initialLoading[item.imageSrc] = false;
    });
    return initialLoading;
  });

  // No remote resolutions needed since all assets are high-performance local imports
  useEffect(() => {
    const urls: Record<string, string> = {};
    GALLERY_ITEMS.forEach((item) => {
      urls[item.imageSrc] = item.imageSrc;
    });
    setResolvedUrls(urls);

    // Load Behold Instagram feed script dynamically
    const existingScript = document.querySelector('script[src="https://w.behold.so/widget.js"]');
    if (!existingScript) {
      const script = document.createElement("script");
      script.type = "module";
      script.src = "https://w.behold.so/widget.js";
      script.async = true;
      document.head.appendChild(script);
    }
  }, []);
  const [viewMode, setViewMode] = useState<"carousel" | "grid">("carousel");
  const [isPlaying, setIsPlaying] = useState(false);
  const [lightboxItem, setLightboxItem] = useState<GalleryItem | null>(null);
  const [activeYoutubeVideo, setActiveYoutubeVideo] = useState<GalleryItem | null>(null);
  
  const thumbnailContainerRef = useRef<HTMLDivElement>(null);
  const autoplayTimerRef = useRef<NodeJS.Timeout | null>(null);

  const activeItem = GALLERY_ITEMS[currentIndex];

  // Keyboard navigation support
  useEffect(() => {
    const handleKeyDown = (e: globalThis.KeyboardEvent) => {
      if (viewMode === "carousel") {
        if (e.key === "ArrowLeft") handlePrev();
        if (e.key === "ArrowRight") handleNext();
        if (e.key === " ") {
          e.preventDefault();
          setIsPlaying((prev) => !prev);
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [viewMode, currentIndex]);

  // Autoplay handler
  useEffect(() => {
    if (isPlaying) {
      autoplayTimerRef.current = setTimeout(() => {
        handleNext();
      }, 5000); // 5 seconds per slide
    } else if (autoplayTimerRef.current) {
      clearTimeout(autoplayTimerRef.current);
    }

    return () => {
      if (autoplayTimerRef.current) clearTimeout(autoplayTimerRef.current);
    };
  }, [isPlaying, currentIndex]);

  // Scroll active thumbnail into visible center of strip
  useEffect(() => {
    if (thumbnailContainerRef.current) {
      const activeThumb = thumbnailContainerRef.current.children[currentIndex] as HTMLElement;
      if (activeThumb) {
        thumbnailContainerRef.current.scrollTo({
          left: activeThumb.offsetLeft - thumbnailContainerRef.current.offsetWidth / 2 + activeThumb.offsetWidth / 2,
          behavior: "smooth"
        });
      }
    }
  }, [currentIndex]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % GALLERY_ITEMS.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + GALLERY_ITEMS.length) % GALLERY_ITEMS.length);
  };

  const selectSlide = (index: number) => {
    setCurrentIndex(index);
    setIsPlaying(false); // Pause autoplay on manual interaction
  };

  return (
    <div className="bg-[#FAF9F6] min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Page Header */}
        <div className="text-center mb-10">
          <span className="text-[#F37021] font-amatic text-2xl font-bold tracking-widest uppercase">
            Aesthetic Realities
          </span>
          <h2 className="font-sketch text-4xl sm:text-6xl text-[#1A1D1C] mt-1 mb-3">
            Visualizing the Journey
          </h2>
          <p className="font-hand text-lg sm:text-xl text-[#5A5C5A] max-w-2xl mx-auto">
            Step directly into the unhurried circles of the **NeeAr** Cohorts. Scroll through high-resolution captures of forest pathways, material studies, and collaborative study.
          </p>
          
          {/* View Toggles & Autoplay Toggle */}
          <div className="flex flex-wrap items-center justify-center gap-4 mt-6">
            <div className="bg-[#1A1D1C]/5 p-1 rounded-lg border border-[#1A1D1C]/10 flex items-center shadow-inner">
              <button
                onClick={() => setViewMode("carousel")}
                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-md font-amatic text-lg font-bold uppercase tracking-wider transition-all duration-200 ${
                  viewMode === "carousel"
                    ? "bg-[#F37021] text-white shadow-sm"
                    : "text-[#5A5C5A] hover:text-[#1A1D1C]"
                }`}
                id="view-toggle-carousel"
              >
                <Layers className="w-4 h-4" /> Carousel Mode
              </button>
              <button
                onClick={() => setViewMode("grid")}
                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-md font-amatic text-lg font-bold uppercase tracking-wider transition-all duration-200 ${
                  viewMode === "grid"
                    ? "bg-[#F37021] text-white shadow-sm"
                    : "text-[#5A5C5A] hover:text-[#1A1D1C]"
                }`}
                id="view-toggle-grid"
              >
                <Grid className="w-4 h-4" /> Grid Index
              </button>
            </div>

            {viewMode === "carousel" && (
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className={`flex items-center gap-2 px-4 py-1.5 border border-[#1A1D1C]/15 rounded-lg font-mono text-xs uppercase tracking-wider transition-colors ${
                  isPlaying 
                    ? "bg-amber-100/60 font-bold border-amber-300 text-[#F37021] animate-pulse" 
                    : "bg-white hover:bg-amber-50/50 text-[#5A5C5A] hover:text-[#1A1D1C]"
                }`}
                id="autoplay-toggle"
              >
                {isPlaying ? (
                  <>
                    <Pause className="w-3.5 h-3.5 text-[#F37021]" /> Slideshow: Playing
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5" /> Slideshow: Paused
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* -------------------- CAROUSEL MODE -------------------- */}
        <AnimatePresence mode="wait">
          {viewMode === "carousel" && (
            <motion.div
              key="carousel-viewport"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="relative bg-white rounded-3xl overflow-hidden border border-[#1A1D1C]/15 shadow-xl p-4 sm:p-6 md:p-8 max-w-5xl mx-auto">
                
                {/* Active Slide Immersive Showcase */}
                <div className="relative aspect-video rounded-2xl overflow-hidden bg-black/90 shadow-md flex items-center justify-center group-player min-h-[260px] sm:min-h-[420px] md:min-h-[500px]">
                  
                  {loadingItems[activeItem.imageSrc] || !resolvedUrls[activeItem.imageSrc] ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#1A1D1C] text-center p-6 space-y-4">
                      <div className="relative flex items-center justify-center">
                        <Aperture className="w-12 h-12 text-[#F37021] animate-spin-slow" />
                        <span className="absolute w-12 h-12 rounded-full border border-dashed border-[#F37021]/60 animate-ping" />
                      </div>
                      <div>
                        <span className="font-amatic text-2xl font-bold text-white tracking-widest block uppercase animate-pulse">
                          Fetching OneDrive Asset...
                        </span>
                        <span className="font-mono text-[10px] text-[#7F817F]">
                          Establishing Secure Direct Stream Tunnel
                        </span>
                      </div>
                    </div>
                  ) : activeItem.mediaType === "video" ? (
                    <div className="absolute inset-0 w-full h-full bg-stone-950 flex items-center justify-center p-1">
                      {resolvedUrls[activeItem.imageSrc]?.includes("embed") ? (
                        <iframe 
                          src={resolvedUrls[activeItem.imageSrc]} 
                          className="w-full h-full border-0 absolute inset-0"
                          scrolling="no" 
                          allowFullScreen
                          title={activeItem.title}
                        ></iframe>
                      ) : (
                        <video 
                          key={activeItem.imageSrc}
                          src={resolvedUrls[activeItem.imageSrc]} 
                          className="max-w-full max-h-full rounded-xl shadow-lg focus:outline-none"
                          controls
                          playsInline
                          preload="metadata"
                          title={activeItem.title}
                        />
                      )}
                    </div>
                  ) : (
                    <motion.img
                      key={currentIndex}
                      src={resolvedUrls[activeItem.imageSrc]}
                      alt={activeItem.title}
                      referrerPolicy="no-referrer"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.4 }}
                      className="w-full h-full object-contain bg-neutral-900"
                    />
                  )}

                  {/* Keyboard navigation hints overlay (temporary visible on hover) */}
                  <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-[10px] sm:text-xs font-mono text-stone-300 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                    <span>Use Left/Right arrows</span>
                  </div>

                  {/* Indicator Badge for media type (floating top-left) */}
                  <div className="absolute top-4 left-4 flex gap-2">
                    <span className="flex items-center gap-1 px-3 py-1 bg-[#1A1D1C]/80 backdrop-blur-md text-white text-xs font-mono tracking-wider uppercase rounded-full">
                      {activeItem.mediaType === "video" ? (
                        <>
                          <Video className="w-3 h-3 text-rose-400" /> Video Clip
                        </>
                      ) : (
                        <>
                          <ImageIcon className="w-3 h-3 text-amber-400" /> Photo Capture
                        </>
                      )}
                    </span>
                    <span className="px-3 py-1 bg-amber-500/90 text-[#1A1D1C] font-semibold text-xs font-mono rounded-full">
                      Scene {currentIndex + 1} of {GALLERY_ITEMS.length}
                    </span>
                  </div>

                  {/* Left Floating Arrow Button */}
                  <button
                    onClick={handlePrev}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/20 hover:bg-white text-white hover:text-espresso backdrop-blur-md flex items-center justify-center border border-white/25 hover:scale-105 active:scale-95 transition-all shadow-lg z-10"
                    title="Previous Scene"
                    id="carousel-btn-prev"
                  >
                    <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8" />
                  </button>

                  {/* Right Floating Arrow Button */}
                  <button
                    onClick={handleNext}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/20 hover:bg-white text-white hover:text-espresso backdrop-blur-md flex items-center justify-center border border-white/25 hover:scale-105 active:scale-95 transition-all shadow-lg z-10"
                    title="Next Scene"
                    id="carousel-btn-next"
                  >
                    <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8" />
                  </button>

                  {/* Lightbox Trigger Icon (only for images) */}
                  {activeItem.mediaType !== "video" && (
                    <button
                      onClick={() => setLightboxItem(activeItem)}
                      className="absolute bottom-4 right-4 p-2.5 bg-[#FAF9F6] text-[#F37021] hover:bg-white rounded-full shadow-lg hover:scale-110 active:scale-95 transition-all border border-[#DFDCDB] z-10"
                      title="Zoom View"
                      id="carousel-btn-zoom"
                    >
                      <Maximize2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* active Details Card */}
                <div className="mt-6 pt-5 border-t border-[#1A1D1C]/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[#F37021] font-amatic text-2xl font-bold tracking-wider block">
                        Scene {String(currentIndex + 1).padStart(2, "0")}
                      </span>
                      <span className="w-3.5 h-[1.5px] bg-amber-400" />
                      <span className="text-[#7F817F] font-mono text-[10px] sm:text-xs">
                        {activeItem.mediaType === "video" ? "MP4 PLAYBACK" : "ARCHIVES"}
                      </span>
                    </div>
                    <h3 className="font-sketch text-2xl sm:text-3xl text-espresso mb-1">
                      {activeItem.title}
                    </h3>
                    <p className="font-hand text-base sm:text-lg text-[#5A5C5A] leading-relaxed max-w-4xl">
                      {activeItem.description}
                    </p>
                  </div>
                  
                  {activeItem.mediaType === "video" && (
                    <div className="bg-rose-50 border border-rose-100 rounded-xl p-3 flex items-center gap-2 text-rose-800 text-xs font-hand w-full md:w-auto shrink-0 md:max-w-[210px]">
                      <Video className="w-5 h-5 text-rose-500 shrink-0" />
                      <div>
                        <strong className="block font-mono text-[10px]">TAP PLAY ICON ABOVE</strong>
                        Scroll within iframe to explore the dialogue.
                      </div>
                    </div>
                  )}
                </div>

                {/* Autoplay progress line */}
                {isPlaying && (
                  <div className="w-full bg-stone-100 h-1 rounded-full overflow-hidden mt-6">
                    <motion.div
                      key={currentIndex}
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 5, ease: "linear" }}
                      className="bg-amber-500 h-full"
                    />
                  </div>
                )}

              </div>

              {/* Horizontal Thumbnail strip */}
              <div className="max-w-5xl mx-auto px-1">
                <p className="font-amatic text-xl font-bold text-espresso uppercase tracking-wider mb-2 flex items-center gap-1.5 justify-center sm:justify-start">
                  <Aperture className="w-5 h-5 text-[#F37021] animate-spin-slow" /> Browse Thumbnail Scroller
                </p>
                <div 
                  ref={thumbnailContainerRef}
                  className="flex items-center gap-4 overflow-x-auto pb-4 pt-1 px-2 no-scrollbar scroll-smooth snap-x"
                  style={{ scrollbarWidth: "thin" }}
                >
                  {GALLERY_ITEMS.map((item, index) => {
                    const isSelected = index === currentIndex;
                    return (
                      <button
                        key={item.title + "-" + index}
                        onClick={() => selectSlide(index)}
                        className={`relative w-24 h-18 sm:w-28 sm:h-20 flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all duration-300 transform snap-center ${
                          isSelected
                            ? "border-[#F37021] scale-105 ring-4 ring-amber-100/60 shadow-md"
                            : "border-stone-200 hover:border-[#F37021]/50 opacity-60 hover:opacity-100 grayscale hover:grayscale-0"
                        }`}
                        id={`carousel-thumb-${index}`}
                      >
                        {item.mediaType === "video" ? (
                          <div className="w-full h-full bg-[#1A1D1C] flex flex-col items-center justify-center p-1 text-center text-[10px] text-white">
                            <Video className="w-4 h-4 text-rose-400 mb-0.5" />
                            <span className="font-mono text-[8px] uppercase line-clamp-1">Video Clip</span>
                          </div>
                        ) : loadingItems[item.imageSrc] || !resolvedUrls[item.imageSrc] ? (
                          <div className="w-full h-full bg-stone-200 animate-pulse flex items-center justify-center">
                            <Aperture className="w-4 h-4 text-[#F37021] animate-spin" />
                          </div>
                        ) : (
                          <img
                            src={resolvedUrls[item.imageSrc]}
                            alt=""
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        )}
                        <span className="absolute bottom-1 right-1 bg-black/70 text-white text-[8px] font-mono px-1 rounded">
                          {index + 1}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

            </motion.div>
          )}

          {/* -------------------- GRID VIEW MODE -------------------- */}
          {viewMode === "grid" && (
            <motion.div
              key="grid-viewport"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 15 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 pb-10"
            >
              {GALLERY_ITEMS.map((item, index) => {
                const isVideo = item.mediaType === "video";
                return (
                  <div
                    key={item.title}
                    id={`grid-item-${index}`}
                    onClick={() => {
                      setCurrentIndex(index);
                      setViewMode("carousel");
                      setIsPlaying(false);
                    }}
                    className="bg-white rounded-2xl overflow-hidden border border-[#1A1D1C]/15 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group flex flex-col justify-between h-[360px]"
                  >
                    {/* Media Preview Container */}
                    <div className="relative w-full h-3/5 overflow-hidden bg-stone-900 flex items-center justify-center">
                      {isVideo ? (
                        <div className="w-full h-full flex flex-col items-center justify-center bg-stone-950 p-6 text-center text-stone-200">
                          <div className="p-3 bg-red-500/10 text-red-400 rounded-full mb-2">
                            <Video className="w-6 h-6 animate-pulse" />
                          </div>
                          <p className="font-sketch text-lg">Dialogue Video Clip</p>
                          <span className="font-hand text-xs text-stone-400 mt-1">Click to play in Carousel</span>
                        </div>
                      ) : loadingItems[item.imageSrc] || !resolvedUrls[item.imageSrc] ? (
                        <div className="w-full h-full bg-[#1A1D1C] flex flex-col items-center justify-center text-center p-4">
                          <Aperture className="w-8 h-8 text-[#F37021] animate-spin mb-2" />
                          <span className="font-amatic text-lg font-bold text-white tracking-widest block uppercase animate-pulse">
                            Loading Captures...
                          </span>
                        </div>
                      ) : (
                        <img
                          src={resolvedUrls[item.imageSrc]}
                          alt={item.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          loading="lazy"
                        />
                      )}

                      {/* Video vs Photo small circular corner tag */}
                      <span className="absolute top-2 left-2 p-1.5 rounded-full bg-black/65 backdrop-blur shadow text-white z-10">
                        {isVideo ? (
                          <Video className="w-3.5 h-3.5 text-rose-400" />
                        ) : (
                          <ImageIcon className="w-3.5 h-3.5 text-amber-400" />
                        )}
                      </span>

                      {/* Click overlay */}
                      <div className="absolute inset-0 bg-[#F37021]/15 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-10">
                        <div className="px-4 py-2 bg-[#1A1D1C] text-white font-amatic text-xl font-bold uppercase tracking-wider rounded-lg shadow-md flex items-center gap-1">
                          View in Carousel <ArrowRight className="w-4 h-4 ml-0.5 text-[#F37021]" />
                        </div>
                      </div>
                    </div>

                    {/* text detail box */}
                    <div className="p-5 bg-white border-t border-[#1A1D1C]/10 flex-grow flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-1.5 text-[#F37021] font-amatic text-lg font-bold uppercase tracking-wider mb-0.5">
                          <Aperture className="w-3.5 h-3.5" />
                          <span>Scene {index + 1}</span>
                        </div>
                        <h3 className="font-sketch text-xl text-espresso mb-1">
                          {item.title}
                        </h3>
                        <p className="font-hand text-base text-[#5A5C5A] line-clamp-2 leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>

        {/* J. Krishnamurti Video Archives Section */}
        <div className="mt-20 border-t border-[#1A1D1C]/10 pt-16">
          <div className="text-center mb-10">
            <span className="text-[#F37021] font-amatic text-2xl font-bold tracking-widest uppercase">
              Inquiry & Teachings
            </span>
            <h2 className="font-sketch text-3xl sm:text-5xl text-[#1A1D1C] mt-1 mb-3">
              J. Krishnamurti Audio Archives
            </h2>
            <p className="font-hand text-lg sm:text-xl text-[#5A5C5A] max-w-2xl mx-auto leading-relaxed">
              To learn, you must have a free, quiet, and unconditioned mind. Explore these foundational video inquiries on the true nature of learning and right education.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto pb-10">
            {JK_VIDEOS.map((item, index) => {
              const videoId = getYoutubeId(item.imageSrc);
              const thumbUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
              return (
                <div
                  key={item.title}
                  id={`jk-video-card-${index}`}
                  onClick={() => setActiveYoutubeVideo(item)}
                  className="bg-white rounded-2xl overflow-hidden border border-[#1A1D1C]/15 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col justify-between h-[380px] group"
                >
                  {/* YouTube Thumbnail Preview */}
                  <div className="relative w-full h-1/2 overflow-hidden bg-stone-900 flex items-center justify-center">
                    <img
                      src={thumbUrl}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                    />
                    {/* Dark translucent overlay */}
                    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                      {/* Play Button */}
                      <div className="w-12 h-12 rounded-full bg-white/95 text-[#F37021] flex items-center justify-center shadow-md transform group-hover:scale-110 active:scale-95 transition-all duration-300">
                        <Play className="w-6 h-6 fill-current ml-0.5" />
                      </div>
                    </div>
                    {/* YouTube Logo small floating badge */}
                    <span className="absolute bottom-2 right-2 bg-red-600 text-white font-mono text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded shadow-sm">
                      YouTube
                    </span>
                  </div>

                  {/* Descriptions card bottom */}
                  <div className="p-5 bg-white border-t border-[#1A1D1C]/10 flex-grow flex flex-col justify-between font-hand">
                    <div>
                      <div className="flex items-center gap-1 text-[#F37021] font-amatic text-lg font-bold uppercase tracking-wider mb-0.5">
                        <span>Dialogue {index + 1}</span>
                      </div>
                      <h3 className="font-sketch text-lg text-espresso mb-1 border-b border-dashed border-stone-100 pb-1 line-clamp-2">
                        {item.title}
                      </h3>
                      <p className="font-hand text-base text-[#5A5C5A] line-clamp-3 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Live Instagram Feed with Behold Widget */}
        <div className="mt-20 border-t-2 border-dashed border-[#1A1D1C]/15 pt-16" id="the-stream-instagram-section">
          <div className="text-center mb-10">
            <span className="text-[#F37021] font-amatic text-2xl font-bold tracking-widest uppercase">
              Digital Reflections
            </span>
            <h2 className="font-sketch text-3xl sm:text-5xl text-[#1A1D1C] mt-1 mb-3">
              Live Instagram Feed
            </h2>
            <p className="font-hand text-lg sm:text-xl text-[#5A5C5A] max-w-2xl mx-auto leading-relaxed">
              Observe our daily moments, dialogue circles, and community reflections as they unfold in real-time. Follow our journey directly on Instagram.
            </p>
          </div>

          <div className="max-w-5xl mx-auto bg-white p-4 sm:p-6 rounded-2xl border-2 border-espresso shadow-md overflow-hidden">
            {/* Behold Custom Element Container */}
            <div 
              className="w-full min-h-[300px]"
              dangerouslySetInnerHTML={{ 
                __html: '<behold-widget feed-id="WZg7uNog2SEFxqs4uZ0r"></behold-widget>' 
              }} 
            />
          </div>
        </div>

        {/* Note / Disclaimer footer section */}
        <div className="max-w-xl mx-auto bg-white text-center p-5 rounded-2xl border border-[#1A1D1C]/15 shadow-sm mt-10">
          <p className="font-hand text-lg text-[#1a1d1c]/80 leading-relaxed">
            🌿 <strong className="text-[#F37021]">Real-time Updates:</strong> Authentic, live photographs of ongoing Bangalore circles are compiled here to share the truth of our unhurried pedagogy with parents and trainers.
          </p>
        </div>

        {/* Lightbox zoom modal (only for pictures) */}
        <AnimatePresence>
          {lightboxItem && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-[#1A1D1C]/95 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
              onClick={() => setLightboxItem(null)}
              id="gallery-lightbox"
            >
              <button 
                onClick={() => setLightboxItem(null)}
                className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white text-white hover:text-[#1A1D1C] transition-colors z-50 shadow-lg"
                title="Close overlay"
                id="lightbox-close-btn"
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
                {/* Left picture screen */}
                <div className="md:w-3/5 bg-stone-900 relative max-h-[50vh] md:max-h-[75vh] overflow-hidden flex items-center justify-center">
                  {loadingItems[lightboxItem.imageSrc] || !resolvedUrls[lightboxItem.imageSrc] ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-stone-900">
                      <Aperture className="w-10 h-10 text-[#F37021] animate-spin" />
                    </div>
                  ) : (
                    <img
                      src={resolvedUrls[lightboxItem.imageSrc]}
                      alt={lightboxItem.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-contain max-h-[50vh] md:max-h-[75vh]"
                    />
                  )}
                </div>

                {/* Right descriptions card (The handwriting aesthetic matching curriculum theme) */}
                <div className="md:w-2/5 p-8 sm:p-10 flex flex-col justify-between bg-white text-espresso">
                  <div>
                    <span className="text-[#F37021] font-amatic text-2xl font-bold tracking-widest uppercase mb-1 block">
                      The Stream Experience
                    </span>
                    <h3 className="font-sketch text-2xl sm:text-3xl text-espresso mt-1 mb-4">
                      {lightboxItem.title}
                    </h3>
                    <p className="font-hand text-lg text-[#3A3A3A] leading-relaxed mb-6">
                      {lightboxItem.description}
                    </p>
                  </div>

                  <div className="border-t border-[#1A1D1C]/10 pt-5 flex flex-col gap-2 font-hand text-sm text-[#5A5C5A]">
                    <div className="flex justify-between">
                      <span>LOCATION</span>
                      <strong className="text-espresso">The FoRE Trust, Bangalore</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>FACILITATION</span>
                      <strong className="text-[#F37021]">NeeAr Curriculum</strong>
                    </div>
                    <div className="flex justify-between text-xs font-mono pt-2 text-[#7F817F]">
                      <span>© ARCHIVE ENTRY</span>
                      <span>SEC_R_EDU</span>
                    </div>
                  </div>
                </div>

              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* YouTube Video Lightbox Modal */}
        <AnimatePresence>
          {activeYoutubeVideo && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-[#1A1D1C]/95 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
              onClick={() => setActiveYoutubeVideo(null)}
              id="youtube-lightbox"
            >
              <button
                onClick={() => setActiveYoutubeVideo(null)}
                className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white text-white hover:text-[#1A1D1C] transition-colors z-50 shadow-lg"
                title="Close video"
                id="youtube-lightbox-close"
              >
                <X className="w-6 h-6" />
              </button>

              <motion.div
                initial={{ scale: 0.95, y: 15 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 15 }}
                className="bg-white max-w-4xl w-full rounded-2xl overflow-hidden shadow-2xl border border-[#1A1D1C] flex flex-col"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Responsive 16:9 Video Wrapper */}
                <div className="aspect-video bg-black relative">
                  {(() => {
                    const videoId = getYoutubeId(activeYoutubeVideo.imageSrc);
                    return (
                      <iframe
                        src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
                        title={activeYoutubeVideo.title}
                        className="w-full h-full border-0 absolute inset-0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    );
                  })()}
                </div>

                {/* Video descriptions */}
                <div className="p-6 sm:p-8 bg-white text-espresso">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[#F37021] font-amatic text-xl font-bold tracking-widest uppercase">
                      J. Krishnamurti Teachings
                    </span>
                    <span className="w-3.5 h-[1.5px] bg-amber-400" />
                    <span className="text-stone-400 font-mono text-[10px]">VIDEO ARCHIVE</span>
                  </div>
                  <h3 className="font-sketch text-2xl sm:text-3xl text-espresso mb-2">
                    {activeYoutubeVideo.title}
                  </h3>
                  <p className="font-hand text-base sm:text-lg text-[#3A3A3A] leading-relaxed">
                    {activeYoutubeVideo.description}
                  </p>
                  
                  <div className="mt-5 border-t border-stone-100 pt-4 flex justify-between items-center text-xs font-hand text-[#7F817F]">
                    <span>PRODUCED BY</span>
                    <strong className="text-espresso">J. Krishnamurti Foundation</strong>
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
