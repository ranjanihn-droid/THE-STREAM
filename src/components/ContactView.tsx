import { useState, FormEvent, DragEvent, ChangeEvent } from "react";
import { Mail, Phone, Globe, Send, CheckCircle2, User, FileText, Sparkles, MapPin, Upload, Trash2, Paperclip, Image, AlertCircle } from "lucide-react";
import { CONTACT_INFO } from "../data";
import { motion, AnimatePresence } from "motion/react";

export default function ContactView() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [journeyText, setJourneyText] = useState("");
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [cvError, setCvError] = useState("");

  // Supporting image uploads
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imageDragActive, setImageDragActive] = useState(false);
  const [imageError, setImageError] = useState("");

  const FILE_SIZE_LIMIT = 5 * 1024 * 1024; // 5 MB
  const MAX_IMAGES_COUNT = 4;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");

  // Verification states
  const [emailVerified, setEmailVerified] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);

  const [emailOtpSent, setEmailOtpSent] = useState(false);
  const [phoneOtpSent, setPhoneOtpSent] = useState(false);

  const [emailOtpLoading, setEmailOtpLoading] = useState(false);
  const [phoneOtpLoading, setPhoneOtpLoading] = useState(false);

  const [emailOtpInput, setEmailOtpInput] = useState("");
  const [phoneOtpInput, setPhoneOtpInput] = useState("");

  const [emailOtpError, setEmailOtpError] = useState("");
  const [phoneOtpError, setPhoneOtpError] = useState("");

  const [simulatedEmailOtp, setSimulatedEmailOtp] = useState("");
  const [simulatedPhoneOtp, setSimulatedPhoneOtp] = useState("");

  // CV Upload Drag & Drop Core Handlers
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
    setCvError("");
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.size > FILE_SIZE_LIMIT) {
        setCvError("THE CHOSEN FILE EXCEEDS OUR 5MB LIMIT. PLEASE CHOOSE A LIGHTER CV.");
        return;
      }
      setCvFile(file);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setCvError("");
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > FILE_SIZE_LIMIT) {
        setCvError("THE CHOSEN FILE EXCEEDS OUR 5MB LIMIT. PLEASE CHOOSE A LIGHTER CV.");
        return;
      }
      setCvFile(file);
    }
  };

  const removeFile = () => {
    setCvFile(null);
    setCvError("");
  };

  // Image Gallery Handlers
  const handleImageDrag = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setImageDragActive(true);
    } else if (e.type === "dragleave") {
      setImageDragActive(false);
    }
  };

  const handleImageDrop = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setImageDragActive(false);
    setImageError("");
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      addSelectedImages(Array.from(e.dataTransfer.files));
    }
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setImageError("");
    if (e.target.files && e.target.files.length > 0) {
      addSelectedImages(Array.from(e.target.files));
    }
  };

  const addSelectedImages = (files: File[]) => {
    // filter image types
    const validImages = files.filter(f => f.type.startsWith("image/"));
    if (validImages.length === 0) {
      setImageError("ONLY VALID IMAGE FILE FORMATS (PNG, JPG, JPEG, WEBP, GIF) ARE ALLOWED.");
      return;
    }

    // size limits check
    const heavyImages = validImages.filter(f => f.size > FILE_SIZE_LIMIT);
    if (heavyImages.length > 0) {
      setImageError(`SOME MAPPED IMAGES EXCEED OUR 5MB LIMIT PER FILE (${heavyImages.map(h => h.name).join(", ")}).`);
      return;
    }

    // quantity limits count check
    if (imageFiles.length + validImages.length > MAX_IMAGES_COUNT) {
      setImageError(`YOU CAN UPLOAD A SECURED CAPACITY OF UP TO ${MAX_IMAGES_COUNT} IMAGES ONLY.`);
      return;
    }

    setImageFiles(prev => [...prev, ...validImages]);
  };

  const removeImage = (idx: number) => {
    setImageFiles(prev => prev.filter((_, i) => i !== idx));
    setImageError("");
  };

  // Trigger simulated Email OTP Code
  const sendEmailOtp = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email.trim())) {
      setEmailOtpError("Please enter a valid, authentic email address structure (e.g., name@domain.com).");
      return;
    }
    setEmailOtpError("");
    setEmailOtpLoading(true);
    try {
      const res = await fetch("/api/verify/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ target: email.trim(), type: "email" })
      });
      if (res.ok) {
        const data = await res.json();
        setEmailOtpSent(true);
        setSimulatedEmailOtp(data.simulatedCode);
      } else {
        setEmailOtpError("Failed to issue verification code.");
      }
    } catch (err) {
      setEmailOtpError("Error starting email verification.");
    } finally {
      setEmailOtpLoading(false);
    }
  };

  // Verify Email OTP Code
  const verifyEmailOtp = async () => {
    if (!emailOtpInput.trim()) return;
    setEmailOtpError("");
    try {
      const res = await fetch("/api/verify/check-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ target: email.trim(), code: emailOtpInput.trim() })
      });
      if (res.ok) {
        setEmailVerified(true);
        setEmailOtpSent(false);
        setSimulatedEmailOtp("");
      } else {
        const data = await res.json();
        setEmailOtpError(data.error || "Incorrect OTP code.");
      }
    } catch (err) {
      setEmailOtpError("Unable to verify OTP code.");
    }
  };

  // Trigger simulated Phone OTP Code
  const sendPhoneOtp = async () => {
    const phoneClean = phone.replace(/[\s\-\(\)\+]/g, "");
    if (!phone || phoneClean.length < 8 || !/^\d+$/.test(phoneClean)) {
      setPhoneOtpError("Please enter a valid, authentic phone number containing at least 8 digits.");
      return;
    }
    setPhoneOtpError("");
    setPhoneOtpLoading(true);
    try {
      const res = await fetch("/api/verify/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ target: phone.trim(), type: "phone" })
      });
      if (res.ok) {
        const data = await res.json();
        setPhoneOtpSent(true);
        setSimulatedPhoneOtp(data.simulatedCode);
      } else {
        setPhoneOtpError("Failed to issue phone verification code.");
      }
    } catch (err) {
      setPhoneOtpError("Error starting phone verification.");
    } finally {
      setPhoneOtpLoading(false);
    }
  };

  // Verify Phone OTP Code
  const verifyPhoneOtp = async () => {
    if (!phoneOtpInput.trim()) return;
    setPhoneOtpError("");
    try {
      const res = await fetch("/api/verify/check-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ target: phone, code: phoneOtpInput.trim() })
      });
      if (res.ok) {
        setPhoneVerified(true);
        setPhoneOtpSent(false);
        setSimulatedPhoneOtp("");
      } else {
        const data = await res.json();
        setPhoneOtpError(data.error || "Incorrect OTP code.");
      }
    } catch (err) {
      setPhoneOtpError("Unable to verify OTP code.");
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name || !email || !journeyText) return;

    if (!emailVerified || !phoneVerified) {
      setSubmitError("Verification required: Please verify both your email address and phone number with the codes below before submitting your reflection form.");
      return;
    }
    
    setIsSubmitting(true);
    setSubmitError("");

    // Helper to read file as Base64 Data URL
    const fileToBase64 = (file: File): Promise<string> => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
      });
    };

    try {
      // 1. Process CV base64
      let cvBase64 = null;
      if (cvFile) {
        try {
          cvBase64 = await fileToBase64(cvFile);
        } catch (err) {
          console.error("Error reading CV file:", err);
        }
      }

      // 2. Process Supporting Images base64
      let uploadedImages: Array<{ name: string; size: number; base64: string }> = [];
      if (imageFiles.length > 0) {
        try {
          uploadedImages = await Promise.all(
            imageFiles.map(async (file) => {
              const b64 = await fileToBase64(file);
              return {
                name: file.name,
                size: file.size,
                base64: b64
              };
            })
          );
        } catch (err) {
          console.error("Error reading supporting image files:", err);
          setSubmitError("Failed to process one or more supporting images. Please check the files and retry.");
          setIsSubmitting(false);
          return;
        }
      }

      const response = await fetch("/api/enquiries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name,
          email,
          phone,
          journeyText,
          cvName: cvFile ? cvFile.name : null,
          cvBase64,
          images: uploadedImages
        })
      });

      if (response.ok) {
        // Save locally to localStorage so it persists in the browser and is accessible immediately on the portal
        const newEnquiry = {
          id: "enq-user-" + Date.now(),
          name,
          email,
          phone,
          journeyText,
          cvName: cvFile ? cvFile.name : null,
          cvBase64,
          images: uploadedImages,
          date: new Date().toISOString().split("T")[0]
        };
        const localEnqs = localStorage.getItem("stream_staff_enquiries");
        let list = [];
        if (localEnqs) {
          try {
            list = JSON.parse(localEnqs);
          } catch (e) {
            console.error("Error parsing local enquiries", e);
          }
        }
        list = [newEnquiry, ...list];
        localStorage.setItem("stream_staff_enquiries", JSON.stringify(list));

        setSubmitted(true);
        setName("");
        setEmail("");
        setPhone("");
        setJourneyText("");
        setCvFile(null);
        setImageFiles([]);
        setEmailVerified(false);
        setPhoneVerified(false);
      } else {
        const errData = await response.json();
        setSubmitError(errData.error || "Submission failed. Please try again.");
      }
    } catch (err: any) {
      console.error("[Submit Enquiry] Error:", err.message);
      setSubmitError("Could not connect to the admissions server. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
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
                      PHONE
                    </span>
                    <p className="font-hand text-xl text-espresso uppercase">
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
                      EMAIL
                    </span>
                    <p className="font-hand text-xl text-espresso uppercase">
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
                      WEBSITE
                    </span>
                    <p className="font-hand text-xl text-espresso uppercase">
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
                      CAMPUS LOCATION
                    </span>
                    <p className="font-hand text-xl text-espresso font-semibold uppercase">
                      The FoRE Trust Campus, Kodipalya, Kengeri
                    </p>
                    <p className="font-hand text-md text-[#5A5C5A] mt-1 uppercase">
                      <a 
                        href="https://www.google.com/maps/search/?api=1&query=Sridhara+Sri+Gudda+Kodipalya+Kengeri"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#F37021] hover:underline font-semibold inline-flex items-center gap-1 bg-[#F37021]/5 px-2.5 py-1 rounded border border-[#F37021]/15 mt-1"
                      >
                        📍 Map location pointing to "Sridhara Sri Gudda"
                      </a>
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
                  <div className="relative space-y-2">
                    <div className="flex justify-between items-center">
                      <label htmlFor="user-email" className="font-amatic text-xl font-bold text-espresso uppercase tracking-wider flex items-center gap-2">
                        <span>Email address</span>
                        {email && (
                          /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) ? (
                            <span className="text-emerald-600 text-xs font-sans font-medium bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100 uppercase tracking-normal">✓ Authentic format</span>
                          ) : (
                            <span className="text-amber-600 text-xs font-sans font-medium bg-amber-50 px-1.5 py-0.5 rounded border border-amber-100 uppercase tracking-normal">✗ Invalid format</span>
                          )
                        )}
                      </label>
                      {emailVerified ? (
                        <span className="text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded font-hand text-sm flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={sendEmailOtp}
                          disabled={emailOtpLoading || !email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())}
                          className="text-[#F37021] hover:text-[#E05A10] disabled:text-gray-400 disabled:cursor-not-allowed font-hand text-base underline focus:outline-none cursor-pointer"
                        >
                          {emailOtpLoading ? "Sending Code..." : emailOtpSent ? "Resend Code" : "Send Verification Code"}
                        </button>
                      )}
                    </div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#979997]">
                        <Mail className="w-5 h-5" />
                      </div>
                      <input
                        type="email"
                        id="user-email"
                        value={email}
                        disabled={emailVerified}
                        placeholder="e.g. anand@thestream.co.in"
                        onChange={(e) => {
                          setEmail(e.target.value);
                          if (emailVerified) setEmailVerified(false);
                        }}
                        required
                        className="w-full pl-10 pr-4 py-3 bg-[#FAF8F5] border border-ochre/25 focus:border-terracotta rounded font-hand text-lg text-espresso placeholder-gray-400 focus:outline-none transition-colors disabled:opacity-75"
                      />
                    </div>

                    {emailOtpError && (
                      <p className="text-rose-600 font-hand text-sm mt-1">{emailOtpError}</p>
                    )}

                    {/* Sim OTP Code Delivery Alert Box */}
                    {emailOtpSent && !emailVerified && (
                      <div className="bg-amber-50/70 border border-dashed border-[#F37021]/30 rounded-lg p-3.5 space-y-2.5 mt-2 animate-fadeIn">
                        <p className="font-hand text-[#5A5C5A] text-sm leading-tight">
                          📨 <span className="font-semibold text-espresso">Simulated Verification Dispatch:</span> We sent a 4-digit code to <span className="font-mono text-xs">{email}</span>. Since this is a local preview, please use this code to authorize:
                        </p>
                        <div className="flex items-center gap-2">
                          <span className="px-3 py-1 bg-white border border-[#F37021]/30 font-mono text-sm font-bold text-[#F37021] rounded tracking-widest">
                            {simulatedEmailOtp}
                          </span>
                          <span className="text-xs text-gray-400 font-hand">(Input this below to verify)</span>
                        </div>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            maxLength={4}
                            value={emailOtpInput}
                            onChange={(e) => setEmailOtpInput(e.target.value)}
                            placeholder="Enter 4-digit code"
                            className="bg-white border border-gray-300 rounded font-mono text-sm px-3 py-1.5 w-32 focus:outline-none focus:border-[#F37021] text-center"
                          />
                          <button
                            type="button"
                            onClick={verifyEmailOtp}
                            className="px-4 py-1.5 bg-[#F37021] hover:bg-[#E05A10] text-white text-xs font-semibold rounded cursor-pointer"
                          >
                            Verify Code
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Phone field */}
                  <div className="relative space-y-2">
                    <div className="flex justify-between items-center">
                      <label htmlFor="user-phone" className="font-amatic text-xl font-bold text-espresso uppercase tracking-wider flex items-center gap-2">
                        <span>Phone Number</span>
                        {phone && (
                          phone.replace(/[\s\-\(\)\+]/g, "").length >= 8 ? (
                            <span className="text-emerald-600 text-xs font-sans font-medium bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100 uppercase tracking-normal">✓ Authentic format</span>
                          ) : (
                            <span className="text-amber-600 text-xs font-sans font-medium bg-amber-50 px-1.5 py-0.5 rounded border border-amber-100 uppercase tracking-normal">✗ Needs 8+ digits</span>
                          )
                        )}
                      </label>
                      {phoneVerified ? (
                        <span className="text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded font-hand text-sm flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={sendPhoneOtp}
                          disabled={phoneOtpLoading || !phone || phone.replace(/[\s\-\(\)\+]/g, "").length < 8}
                          className="text-[#F37021] hover:text-[#E05A10] disabled:text-gray-400 disabled:cursor-not-allowed font-hand text-base underline focus:outline-none cursor-pointer"
                        >
                          {phoneOtpLoading ? "Sending Code..." : phoneOtpSent ? "Resend Code" : "Send Verification Code"}
                        </button>
                      )}
                    </div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#979997]">
                        <Phone className="w-5 h-5 text-gray-400" />
                      </div>
                      <input
                        type="tel"
                        id="user-phone"
                        value={phone}
                        disabled={phoneVerified}
                        placeholder="e.g. +91 98765 43210"
                        onChange={(e) => {
                          setPhone(e.target.value);
                          if (phoneVerified) setPhoneVerified(false);
                        }}
                        required
                        className="w-full pl-10 pr-4 py-3 bg-[#FAF8F5] border border-ochre/25 focus:border-terracotta rounded font-hand text-lg text-espresso placeholder-gray-400 focus:outline-none transition-colors disabled:opacity-75"
                      />
                    </div>

                    {phoneOtpError && (
                      <p className="text-rose-600 font-hand text-sm mt-1">{phoneOtpError}</p>
                    )}

                    {/* Sim OTP Code Delivery Alert Box */}
                    {phoneOtpSent && !phoneVerified && (
                      <div className="bg-amber-50/70 border border-dashed border-[#F37021]/30 rounded-lg p-3.5 space-y-2.5 mt-2 animate-fadeIn">
                        <p className="font-hand text-[#5A5C5A] text-sm leading-tight">
                          📱 <span className="font-semibold text-espresso">Simulated SMS Dispatch:</span> We sent a 4-digit code to <span className="font-mono text-xs">{phone}</span>. Since this is a local preview, please use this code to authorize:
                        </p>
                        <div className="flex items-center gap-2">
                          <span className="px-3 py-1 bg-white border border-[#F37021]/30 font-mono text-sm font-bold text-[#F37021] rounded tracking-widest">
                            {simulatedPhoneOtp}
                          </span>
                          <span className="text-xs text-gray-400 font-hand">(Input this below to verify)</span>
                        </div>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            maxLength={4}
                            value={phoneOtpInput}
                            onChange={(e) => setPhoneOtpInput(e.target.value)}
                            placeholder="Enter 4-digit code"
                            className="bg-white border border-gray-300 rounded font-mono text-sm px-3 py-1.5 w-32 focus:outline-none focus:border-[#F37021] text-center"
                          />
                          <button
                            type="button"
                            onClick={verifyPhoneOtp}
                            className="px-4 py-1.5 bg-[#F37021] hover:bg-[#E05A10] text-white text-xs font-semibold rounded cursor-pointer"
                          >
                            Verify Code
                          </button>
                        </div>
                      </div>
                    )}
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
                  <div className="relative space-y-2">
                    <label className="font-amatic text-xl font-bold text-espresso uppercase tracking-wider block mb-1 flex items-center justify-between">
                      <span>Upload your CV / Resume</span>
                      <span className="text-xs font-hand text-sage italic">(Max 5MB • PDF, DOC, DOCX)</span>
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
                            ? "border-emerald-500 bg-emerald-50/10" 
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
                            Supports PDF, DOC, or DOCX formats up to 5MB
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

                    {cvError && (
                      <div className="bg-rose-50 border border-rose-100 rounded-lg p-3 text-rose-700 font-hand text-sm flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 mt-0.5 text-rose-600 flex-shrink-0" />
                        <span>{cvError}</span>
                      </div>
                    )}
                  </div>

                  {/* Supporting Portfolio Photos & Images */}
                  <div className="relative space-y-2">
                    <label className="font-amatic text-xl font-bold text-espresso uppercase tracking-wider block mb-1 flex items-center justify-between">
                      <span>Supporting Portfolio Photos / Images</span>
                      <span className="text-xs font-hand text-sage italic">(Max 4 photos • Up to 5MB each)</span>
                    </label>

                    <div
                      onDragEnter={handleImageDrag}
                      onDragOver={handleImageDrag}
                      onDragLeave={handleImageDrag}
                      onDrop={handleImageDrop}
                      className={`relative border-2 border-dashed rounded-lg p-5 flex flex-col items-center justify-center transition-all ${
                        imageDragActive 
                          ? "border-[#F37021] bg-amber-50/40" 
                          : imageFiles.length > 0 
                            ? "border-emerald-500 bg-emerald-50/10" 
                            : "border-ochre/25 hover:border-[#F37021]/50 bg-[#FAF8F5] cursor-pointer"
                      }`}
                    >
                      <input
                        type="file"
                        id="image-upload-input"
                        className="hidden"
                        onChange={handleImageChange}
                        accept="image/*"
                        multiple
                      />

                      {imageFiles.length < MAX_IMAGES_COUNT ? (
                        <label 
                          htmlFor="image-upload-input" 
                          className="flex flex-col items-center justify-center cursor-pointer text-center w-full py-2"
                        >
                          <div className="p-2.5 bg-amber-50 text-[#F37021] rounded-full mb-2 border border-[#F37021]/15">
                            <Image className="w-5 h-5" />
                          </div>
                          <p className="font-hand text-base text-espresso">
                            Drag & drop showcase images here, or <span className="text-[#F37021] hover:underline font-mono text-sm font-bold">browse</span>
                          </p>
                          <p className="font-hand text-xs text-[#7F817F] mt-0.5">
                            Supports PNG, JPG, JPEG, WEBP or GIF (max {MAX_IMAGES_COUNT} images)
                          </p>
                        </label>
                      ) : (
                        <div className="text-center py-2">
                          <p className="font-hand text-base text-[#5A5C5A] font-semibold">
                            ✓ Maximum supporting images reached ({imageFiles.length}/{MAX_IMAGES_COUNT})
                          </p>
                          <p className="font-hand text-xs text-sage italic mt-0.5">
                            Remove individual pictures below to attach alternatives
                          </p>
                        </div>
                      )}
                    </div>

                    {imageError && (
                      <div className="bg-rose-50 border border-rose-100 rounded-lg p-3 text-rose-700 font-hand text-sm flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 mt-0.5 text-rose-600 flex-shrink-0" />
                        <span>{imageError}</span>
                      </div>
                    )}

                    {/* Image thumbnails display grid */}
                    {imageFiles.length > 0 && (
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                        {imageFiles.map((file, idx) => {
                          const previewUrl = URL.createObjectURL(file);
                          return (
                            <div key={idx} className="relative group bg-white border border-[#DFDCDB] rounded-lg overflow-hidden shadow-sm aspect-video sm:aspect-square flex flex-col justify-between">
                              <img 
                                src={previewUrl} 
                                alt={file.name} 
                                className="w-full h-full object-cover"
                                referrerPolicy="no-referrer"
                              />
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <button
                                  type="button"
                                  onClick={() => removeImage(idx)}
                                  className="p-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-full transition-colors cursor-pointer"
                                  title="Delete attachment"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                              <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white px-2 py-0.5 text-[9px] font-mono truncate">
                                {(file.size / 1024 / 1024).toFixed(2)} MB
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {submitError && (
                    <div className="bg-red-50 text-rose-700 p-3 rounded-lg border border-red-200 text-center font-hand text-base">
                      {submitError}
                    </div>
                  )}

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
