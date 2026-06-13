import { useState, FormEvent, DragEvent, ChangeEvent } from "react";
import { Mail, Phone, Globe, Send, CheckCircle2, User, FileText, Sparkles, MapPin, Upload, Trash2, Paperclip } from "lucide-react";
import { CONTACT_INFO } from "../data";
import { motion, AnimatePresence } from "motion/react";

export default function ContactView() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [journeyText, setJourneyText] = useState("");
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleDrag = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setCvFile(file);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setCvFile(file);
    }
  };

  const removeFile = () => {
    setCvFile(null);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name || !email || !journeyText) return;
    
    setIsSubmitting(true);
    // Simulate natural submission speed
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setName("");
      setEmail("");
      setJourneyText("");
      setCvFile(null);
    }, 1500);
  };

  return (
    <div className="bg-canvas-bg min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        
        {/* Page Head */}
        <div className="text-center mb-16">
          <span className="text-[#F37021] font-amatic text-2xl font-bold tracking-widest uppercase">
            Inquire & Embark
          </span>
          <h2 className="font-sketch text-4xl sm:text-6xl text-espresso mt-2 mb-4">
            {CONTACT_INFO.title}
          </h2>
          <p className="font-hand text-xl text-[#5A5C5A] max-w-2xl mx-auto">
            {CONTACT_INFO.subtitle}
          </p>
          <div className="w-24 h-1 bg-[#F37021] mx-auto rounded-full mt-6" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mt-8">
          
          {/* Left Column: Coordinates and Details (5 columns) */}
          <div className="lg:col-span-5 bg-[#FAF9F6] rounded-xl p-8 border border-[#1A1D1C] shadow-sm flex flex-col justify-between h-full min-h-[480px]">
            <div>
              <h3 className="font-sketch text-2xl sm:text-3xl text-espresso mb-6 border-b border-[#DDD9CE] pb-3">
                Communications
              </h3>
              <p className="font-hand text-lg text-[#5E605E] leading-relaxed mb-8">
                We read every reflection deeply. If you feel called to transition from standard instruction structures into Right Education environments, connect with Sreenivasan directly or write your thoughts.
              </p>

              {/* Direct Coordinate Channels */}
              <div className="space-y-6">
                
                {/* Channel 1: Contact Person & Phone */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded bg-amber-50 flex items-center justify-center text-[#F37021] font-bold font-sketch text-lg shrink-0 border border-[#F37021]/30">
                    <Phone className="w-5 h-5 text-[#F37021]" />
                  </div>
                  <div>
                    <span className="font-amatic text-base text-[#F37021] font-bold tracking-wider uppercase block">
                      Phone
                    </span>
                    <p className="font-hand text-xl text-espresso">
                      {CONTACT_INFO.contactPerson}:{" "}
                      <a href={`tel:${CONTACT_INFO.phone}`} className="font-semibold hover:underline">
                        {CONTACT_INFO.phone}
                      </a>
                    </p>
                  </div>
                </div>

                {/* Channel 2: Email */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded bg-amber-50 flex items-center justify-center text-[#F37021] shrink-0 border border-[#F37021]/30">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-amatic text-base text-[#F37021] font-bold tracking-wider uppercase block">
                      Email
                    </span>
                    <p className="font-hand text-xl text-espresso">
                      <a href={`mailto:${CONTACT_INFO.email}`} className="hover:underline font-semibold">
                        {CONTACT_INFO.email}
                      </a>
                    </p>
                  </div>
                </div>

                {/* Channel 3: Registry URL */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded bg-amber-50 flex items-center justify-center text-[#F37021] shrink-0 border border-[#F37021]/30">
                    <Globe className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-amatic text-base text-[#F37021] font-bold tracking-wider uppercase block">
                      Website
                    </span>
                    <p className="font-hand text-xl text-espresso">
                      <a 
                        href={`https://${CONTACT_INFO.website}`} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="hover:underline font-semibold"
                      >
                        {CONTACT_INFO.website}
                      </a>
                    </p>
                  </div>
                </div>

                {/* Channel 4: Campus Location */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded bg-amber-50 flex items-center justify-center text-[#F37021] shrink-0 border border-[#F37021]/30">
                    <MapPin className="w-5 h-5 text-[#F37021]" />
                  </div>
                  <div>
                    <span className="font-amatic text-base text-[#F37021] font-bold tracking-wider uppercase block">
                      Campus Location
                    </span>
                    <p className="font-hand text-xl text-espresso font-semibold">
                      The FoRE Trust Campus, Kodipalya, Kengeri
                    </p>
                    <p className="font-hand text-md text-[#5A5C5A]">
                      Map location pointing to "Sridhara Sri Gudda"
                    </p>
                  </div>
                </div>

              </div>
            </div>

            <div className="mt-12 pt-6 border-t border-[#DDD9CE] font-hand text-base text-[#727472]">
              <p className="italic">
                “We look forward to walking this path with you.”
              </p>
              <p className="font-sketch text-xs tracking-wider text-espresso uppercase mt-3">
                {CONTACT_INFO.legalEntity}
              </p>
            </div>
          </div>

          {/* Right Column: Minimalist reflection submission board (7 columns) */}
          <div className="lg:col-span-7 bg-canvas-bg border border-dashed border-[#DFDCDB] rounded-xl p-8 sm:p-10">
            
            <AnimatePresence mode="wait">
              {!submitted ? (
                <motion.form 
                  key="contact-form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleSubmit}
                  className="space-y-6"
                >
                  <p className="font-hand text-lg text-espresso mb-2">
                    Please leave your contact information below so we can share dates and location points for dialogue sessions.
                  </p>
                  
                  {/* Name field */}
                  <div className="relative">
                    <label htmlFor="user-name" className="font-amatic text-xl font-bold text-espresso uppercase tracking-wider block mb-1">
                      Your Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#979997]">
                        <User className="w-5 h-5" />
                      </div>
                      <input
                        type="text"
                        id="user-name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Anand"
                        required
                        className="w-full pl-10 pr-4 py-3 bg-[#FAF8F5] border border-ochre/25 focus:border-terracotta rounded font-hand text-lg text-espresso placeholder-gray-400 focus:outline-none transition-colors"
                      />
                    </div>
                  </div>

                  {/* Email field */}
                  <div className="relative">
                    <label htmlFor="user-email" className="font-amatic text-xl font-bold text-espresso uppercase tracking-wider block mb-1">
                      Email address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#979997]">
                        <Mail className="w-5 h-5" />
                      </div>
                      <input
                        type="email"
                        id="user-email"
                        value={email}
                        placeholder="e.g. anand@thestream.co.in"
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full pl-10 pr-4 py-3 bg-[#FAF8F5] border border-ochre/25 focus:border-terracotta rounded font-hand text-lg text-espresso placeholder-gray-400 focus:outline-none transition-colors"
                      />
                    </div>
                  </div>

                  {/* Reflection Essay field */}
                  <div className="relative">
                    <label htmlFor="user-journey" className="font-amatic text-xl font-bold text-espresso uppercase tracking-wider block mb-1 flex items-center justify-between">
                      <span>Tell us about your journey as an educator</span>
                      <span className="text-xs font-hand text-sage italic">(Take your time)</span>
                    </label>
                    <div className="relative">
                      <div className="absolute top-3 left-3 pointer-events-none text-[#979997]">
                        <FileText className="w-5 h-5" />
                      </div>
                      <textarea
                        id="user-journey"
                        rows={5}
                        value={journeyText}
                        onChange={(e) => setJourneyText(e.target.value)}
                        placeholder="Share your resonance with fearless, unhurried education, past milestones, or doubts..."
                        required
                        className="w-full pl-10 pr-4 py-3 bg-[#FAF8F5] border border-[#1A1D1C]/25 focus:border-[#F37021] rounded font-hand text-lg text-espresso placeholder-gray-400 focus:outline-none transition-colors resize-y min-h-[110px]"
                      />
                    </div>
                  </div>

                  {/* CV Selection / Drag & Drop File Upload */}
                  <div className="relative">
                    <label className="font-amatic text-xl font-bold text-espresso uppercase tracking-wider block mb-1 flex items-center justify-between">
                      <span>Upload your CV / Resume</span>
                      <span className="text-xs font-hand text-sage italic">(For Aspirants)</span>
                    </label>
                    
                    <div
                      onDragEnter={handleDrag}
                      onDragOver={handleDrag}
                      onDragLeave={handleDrag}
                      onDrop={handleDrop}
                      className={`relative border-2 border-dashed rounded-lg p-5 flex flex-col items-center justify-center transition-all ${
                        dragActive 
                          ? "border-[#F37021] bg-amber-50/40" 
                          : cvFile 
                            ? "border-sage bg-emerald-50/10" 
                            : "border-ochre/25 hover:border-[#F37021]/50 bg-[#FAF8F5] cursor-pointer"
                      }`}
                    >
                      <input
                        type="file"
                        id="cv-upload-input"
                        className="hidden"
                        onChange={handleFileChange}
                        accept=".pdf,.doc,.docx"
                      />
                      
                      {!cvFile ? (
                        <label 
                          htmlFor="cv-upload-input" 
                          className="flex flex-col items-center justify-center cursor-pointer text-center w-full py-2"
                        >
                          <div className="p-2.5 bg-amber-50 text-[#F37021] rounded-full mb-2 border border-[#F37021]/15">
                            <Upload className="w-5 h-5 animate-pulse" />
                          </div>
                          <p className="font-hand text-base text-espresso">
                            Drag & drop your CV here, or <span className="text-[#F37021] hover:underline font-mono text-sm font-bold">browse</span>
                          </p>
                          <p className="font-hand text-xs text-[#7F817F] mt-0.5">
                            Supports PDF, DOC, or DOCX formats
                          </p>
                        </label>
                      ) : (
                        <div className="flex items-center justify-between w-full bg-white p-3 rounded border border-[#DFDCDB] shadow-sm">
                          <div className="flex items-center gap-3 overflow-hidden">
                            <div className="p-2 bg-emerald-100 text-emerald-800 rounded">
                              <Paperclip className="w-4 h-4" />
                            </div>
                            <div className="text-left overflow-hidden">
                              <p className="font-hand text-base text-espresso font-semibold truncate max-w-[200px] sm:max-w-xs">
                                {cvFile.name}
                              </p>
                              <p className="font-mono text-[10px] text-[#7F817F]">
                                {(cvFile.size / 1024 / 1024).toFixed(2)} MB • Ready to send
                              </p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={removeFile}
                            className="p-1 text-[#7F817F] hover:text-[#F43F5E] hover:bg-rose-50 rounded transition-colors"
                            title="Remove file"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Submission Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 bg-[#F37021] hover:bg-[#E05A10] text-white font-sketch text-lg rounded-md shadow-md active:translate-y-[1px] disabled:opacity-50 transition-all flex items-center justify-center gap-2 border border-[#1A1D1C]"
                    id="submit-journey-button"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Sending Reflection & CV...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 text-white" />
                        <span>Submit Reflection Journey</span>
                      </>
                    )}
                  </button>

                </motion.form>
              ) : (
                <motion.div
                  key="submission-feedback"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-[#FAF9F6] p-8 text-center rounded-lg border border-[#1A1D1C] flex flex-col items-center justify-center py-12"
                >
                  <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-800 mb-6 shadow-sm">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  
                  <h4 className="font-sketch text-3xl text-espresso mb-4">
                    Inquiry Received Beautifully
                  </h4>
                  
                  <p className="font-hand text-xl text-[#1A1D1C] max-w-md mx-auto leading-relaxed mb-6">
                    Thank you for sharing your resonance. Sreenivasan and our founding education coordinators will review your reflections thoughtfully and reach out to you within 3 business days at your address.
                  </p>

                  <div className="px-4 py-1.5 bg-amber-50 rounded font-mono text-xs text-[#F37021] uppercase tracking-widest flex items-center gap-2 mb-8 border border-[#F37021]/30">
                    <Sparkles className="w-3.5 h-3.5 text-[#F37021]" />
                    <span>DIALOGUE CONNECTION SECURED</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSubmitted(false)}
                    className="px-6 py-2 border border-[#828482] hover:bg-[#FAF9F5] text-[#2C302E] font-hand text-base rounded transition-colors"
                  >
                    Submit another reflection
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

          </div>

        </div>

      </div>
    </div>
  );
}
