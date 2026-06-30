import { useState, useEffect, FormEvent } from "react";
import { Lock, Unlock, User, Sparkles, BookOpen, FileText, ClipboardList, Send, LogOut, CheckCircle2, AlertCircle, Plus, Trash2, Calendar, FileDown, PlusCircle, Mail, Paperclip, Eye, Share2, MessageSquare } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface NoticeItem {
  id: string;
  topic: string;
  content: string;
  postedBy: string;
  date: string;
  tag: "General" | "Urgent" | "Curriculum" | "Placement";
}

interface DialoguePlan {
  id: string;
  title: string;
  readingSource: string;
  dialoguePrompt: string;
  facilitator: string;
  durationMins: number;
}

interface PlacingCandidate {
  id: string;
  name: string;
  program: string;
  status: "Reviewing" | "Interview Scheduled" | "Approved" | "Assigned to Aranyaani" | "Assigned to Aarohi";
  notes: string;
}

export default function StaffPortalView() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [usernameInput, setUsernameInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentUser, setCurrentUser] = useState<string>("");

  // Dashboard Tab state
  const [dbTab, setDbTab] = useState<"notices" | "planner" | "placements" | "vault" | "enquiries" | "chatbot">("notices");

  // Load States
  const [notices, setNotices] = useState<NoticeItem[]>([]);
  const [plans, setPlans] = useState<DialoguePlan[]>([]);
  const [candidates, setCandidates] = useState<PlacingCandidate[]>([]);
  const [enquiries, setEnquiries] = useState<any[]>([]);
  const [isLoadingEnquiries, setIsLoadingEnquiries] = useState(false);
  const [chatbotSessions, setChatbotSessions] = useState<any[]>([]);
  const [isLoadingChatbot, setIsLoadingChatbot] = useState(false);
  const [selectedChatSession, setSelectedChatSession] = useState<any>(null);

  // Form State for creating a Notice
  const [newNoticeTopic, setNewNoticeTopic] = useState("");
  const [newNoticeContent, setNewNoticeContent] = useState("");
  const [newNoticeBy, setNewNoticeBy] = useState("thestream");
  const [newNoticeTag, setNewNoticeTag] = useState<"General" | "Urgent" | "Curriculum" | "Placement">("General");

  // Form State for Dialogue Planner
  const [planTitle, setPlanTitle] = useState("");
  const [planSource, setPlanSource] = useState("");
  const [planPrompt, setPlanPrompt] = useState("");
  const [planFacilitator, setPlanFacilitator] = useState("");
  const [planDuration, setPlanDuration] = useState(45);

  // Enquiry extra action states
  const [selectedEnquiry, setSelectedEnquiry] = useState<any>(null);
  const [forwardingEnquiry, setForwardingEnquiry] = useState<any>(null);
  const [forwardEmailInput, setForwardEmailInput] = useState("");
  const [actionStatus, setActionStatus] = useState("");

  const fetchEnquiries = async () => {
    setIsLoadingEnquiries(true);
    try {
      // 1. Get client-side submissions from localStorage
      const localEnqsStr = localStorage.getItem("stream_staff_enquiries");
      let localList: any[] = [];
      if (localEnqsStr) {
        try {
          localList = JSON.parse(localEnqsStr);
        } catch (e) {
          console.error("Error parsing local enquiries from localStorage", e);
        }
      }

      // 2. Fetch server-side list
      const response = await fetch("/api/staff/enquiries");
      let apiList: any[] = [];
      if (response.ok) {
        const data = await response.json();
        if (data.success && Array.isArray(data.enquiries)) {
          apiList = data.enquiries;
        }
      }

      // 3. Merge lists uniquely
      const mergedMap = new Map<string, any>();
      apiList.forEach((item) => {
        if (item && item.id) mergedMap.set(item.id, item);
      });
      localList.forEach((item) => {
        if (item && item.id) mergedMap.set(item.id, item);
      });

      // 4. Sort descending so latest items are on top
      const mergedList = Array.from(mergedMap.values()).sort((a, b) => {
        return b.id.localeCompare(a.id);
      });

      setEnquiries(mergedList);
    } catch (err) {
      console.error("Error fetching enquiries:", err);
      // Fallback fully to local if server API isn't answering
      const localEnqsStr = localStorage.getItem("stream_staff_enquiries");
      if (localEnqsStr) {
        try {
          setEnquiries(JSON.parse(localEnqsStr));
        } catch (e) {}
      }
    } finally {
      setIsLoadingEnquiries(false);
    }
  };

  const fetchChatbotSessions = async () => {
    setIsLoadingChatbot(true);
    try {
      const response = await fetch("/api/staff/chatbot/sessions");
      if (response.ok) {
        const data = await response.json();
        if (data.success && Array.isArray(data.sessions)) {
          setChatbotSessions(data.sessions);
        }
      }
    } catch (err) {
      console.error("Error fetching chatbot sessions:", err);
    } finally {
      setIsLoadingChatbot(false);
    }
  };

  const handleDeleteChatSession = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this chatbot transcript? This cannot be undone.")) {
      return;
    }
    try {
      const response = await fetch(`/api/staff/chatbot/sessions/${id}`, {
        method: "DELETE"
      });
      if (response.ok) {
        setActionStatus("Chat session log deleted.");
        setTimeout(() => setActionStatus(""), 4000);
        if (selectedChatSession && selectedChatSession.id === id) {
          setSelectedChatSession(null);
        }
        fetchChatbotSessions();
      }
    } catch (err) {
      console.error("Failed to delete chat session:", err);
    }
  };

  const handleClearAllChatSessions = async () => {
    if (!window.confirm("CRITICAL WARNING: Are you sure you want to CLEAR ALL CHATBOT LOGS? This clears everything and is permanent!")) {
      return;
    }
    try {
      const response = await fetch("/api/staff/chatbot/clear-all", {
        method: "POST"
      });
      if (response.ok) {
        setActionStatus("All chatbot logs successfully cleared.");
        setTimeout(() => setActionStatus(""), 4000);
        setSelectedChatSession(null);
        fetchChatbotSessions();
      }
    } catch (err) {
      console.error("Failed to clear chatbot sessions:", err);
    }
  };

  const handleDeleteEnquiry = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this enquiry? This action cannot be undone.")) {
      return;
    }
    try {
      // 1. Delete on the server
      const response = await fetch(`/api/staff/enquiries/${id}`, {
        method: "DELETE"
      });
      
      // 2. Clear from local storage list if present there
      const localEnqsStr = localStorage.getItem("stream_staff_enquiries");
      if (localEnqsStr) {
        try {
          const list = JSON.parse(localEnqsStr);
          const filtered = list.filter((item: any) => item.id !== id);
          localStorage.setItem("stream_staff_enquiries", JSON.stringify(filtered));
        } catch (e) {
          console.error("Local storage delete error:", e);
        }
      }
      
      // Clear detail modal if deleted enquiry was open
      if (selectedEnquiry && selectedEnquiry.id === id) {
        setSelectedEnquiry(null);
      }
      
      setActionStatus("Enquiry deleted successfully.");
      setTimeout(() => setActionStatus(""), 4000);
      
      // 3. Refresh list
      fetchEnquiries();
    } catch (err) {
      console.error("Failed to delete enquiry:", err);
      // Fallback local-only delete if server is offline
      const localEnqsStr = localStorage.getItem("stream_staff_enquiries");
      if (localEnqsStr) {
        try {
          const list = JSON.parse(localEnqsStr);
          const filtered = list.filter((item: any) => item.id !== id);
          localStorage.setItem("stream_staff_enquiries", JSON.stringify(filtered));
        } catch (e) {}
      }
      setActionStatus("Enquiry removed from local browser registry.");
      setTimeout(() => setActionStatus(""), 4000);
      
      if (selectedEnquiry && selectedEnquiry.id === id) {
        setSelectedEnquiry(null);
      }
      fetchEnquiries();
    }
  };

  const handleForwardEnquiry = async (id: string, forwardEmail: string) => {
    if (!forwardEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(forwardEmail.trim())) {
      alert("Please enter a valid, authentic target email address.");
      return;
    }
    try {
      const response = await fetch(`/api/staff/enquiries/${id}/forward`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ forwardEmail: forwardEmail.trim() })
      });
      
      if (response.ok) {
        setActionStatus(`Enquiry successfully forwarded to ${forwardEmail}.`);
        setForwardingEnquiry(null);
        setForwardEmailInput("");
        setTimeout(() => setActionStatus(""), 4000);
      } else {
        const data = await response.json();
        alert(data.error || "Could not forward the enquiry.");
      }
    } catch (e) {
      // Fallback for mock/local entries
      console.warn("Server forward fallback:", e);
      setActionStatus(`[Simulated] Enquiry forwarded to ${forwardEmail}.`);
      setForwardingEnquiry(null);
      setForwardEmailInput("");
      setTimeout(() => setActionStatus(""), 4000);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      if (dbTab === "chatbot") {
        fetchChatbotSessions();
      } else {
        fetchEnquiries();
      }
    }
  }, [isLoggedIn, dbTab]);

  // Check existing session on load
  useEffect(() => {
    const savedToken = sessionStorage.getItem("staff_token");
    const savedUser = sessionStorage.getItem("staff_user");
    if (savedToken && savedUser) {
      setIsLoggedIn(true);
      setCurrentUser(savedUser);
    }

    // Load initial mock-persistent data from localStorage or default ones
    const localNotices = localStorage.getItem("stream_staff_notices");
    if (localNotices) {
      setNotices(JSON.parse(localNotices));
    } else {
      const defaultNotices: NoticeItem[] = [
        {
          id: "n-1",
          topic: "Aranyaani School Placement Visit",
          content: "The coordinator Circle from Aranyaani Alternative School is visiting tomorrow at 10:00 AM to meet the senior TTP teacher batch. Please keep all reflection portfolios updated.",
          postedBy: "Srini",
          date: "2026-06-13",
          tag: "Placement"
        },
        {
          id: "n-2",
          topic: "Philosophical Dialogue prep: Krishnamurti",
          content: "This week's core module is on 'Freedom and Discipline' chapter from 'Letters to Schools'. Please run preparatory circles in batches.",
          postedBy: "NeeAr Circle",
          date: "2026-06-11",
          tag: "Curriculum"
        },
        {
          id: "n-3",
          topic: "Urgent: Infrastructure review",
          content: "Please ensure all interactive nature trail logs and earthy classroom portfolios are compiled for audit submissions.",
          postedBy: "System Helpdesk",
          date: "2026-06-14",
          tag: "Urgent"
        }
      ];
      setNotices(defaultNotices);
      localStorage.setItem("stream_staff_notices", JSON.stringify(defaultNotices));
    }

    const localPlans = localStorage.getItem("stream_staff_plans");
    if (localPlans) {
      setPlans(JSON.parse(localPlans));
    } else {
      const defaultPlans: DialoguePlan[] = [
        {
          id: "dp-1",
          title: "Inquiry into Comparison & Competition",
          readingSource: "Letters to Schools, Chapter 4",
          dialoguePrompt: "Why does the mind constantly seek validation by comparing itself to another? Can there be true alternative learning when metrics of performance persist?",
          facilitator: "Srini",
          durationMins: 60
        },
        {
          id: "dp-2",
          title: "Practical Forest Trails & Nature Dialogue",
          readingSource: "Education and the Significance of Life",
          dialoguePrompt: "During the 11:00 AM canopy trail, observe a single leaf without formulating word-concepts. How does memory interfere with direct sensory awareness?",
          facilitator: "Aranyaani Team",
          durationMins: 45
        }
      ];
      setPlans(defaultPlans);
      localStorage.setItem("stream_staff_plans", JSON.stringify(defaultPlans));
    }

    const localCandidates = localStorage.getItem("stream_staff_candidates");
    if (localCandidates) {
      setCandidates(JSON.parse(localCandidates));
    } else {
      const defaultCandidates: PlacingCandidate[] = [
        {
          id: "tc-1",
          name: "Devendra Swamy",
          program: "12-Month Alternative Educator Track",
          status: "Assigned to Aranyaani",
          notes: "Strong background in organic farming integration and holistic science dialogues."
        },
        {
          id: "tc-2",
          name: "Rupa Malini K.",
          program: "Co-learning Parent-Practitioner Track",
          status: "Approved",
          notes: "Focusing on child-led primary learning in alternative spaces in South Bangalore."
        },
        {
          id: "tc-3",
          name: "Ananya Iyer",
          program: "12-Month Alternative Educator Track",
          status: "Assigned to Aarohi",
          notes: "Completed internship modules; specializing in democratic dialogue facilitation and community arts."
        },
        {
          id: "tc-4",
          name: "Karan Johar Shastry",
          program: "Alternative Space Leadership Certification",
          status: "Reviewing",
          notes: "Awaiting final review of Krishnamurti philosophy essays on conditioning."
        }
      ];
      setCandidates(defaultCandidates);
      localStorage.setItem("stream_staff_candidates", JSON.stringify(defaultCandidates));
    }
  }, []);

  const handleLoginSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!usernameInput || !passwordInput) {
      setLoginError("Please enter both credentials.");
      return;
    }

    setLoginError("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/staff/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: usernameInput,
          password: passwordInput,
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        sessionStorage.setItem("staff_token", data.token);
        sessionStorage.setItem("staff_user", data.username);
        setIsLoggedIn(true);
        setCurrentUser(data.username);
        setUsernameInput("");
        setPasswordInput("");
      } else {
        setLoginError(data.error || "Incorrect staff username or security password.");
      }
    } catch (err: any) {
      console.error("Login request failed:", err);
      setLoginError("Could not reach secure auth server. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("staff_token");
    sessionStorage.removeItem("staff_user");
    setIsLoggedIn(false);
    setCurrentUser("");
  };

  // Add Notice Item
  const handleAddNotice = (e: FormEvent) => {
    e.preventDefault();
    if (!newNoticeTopic.trim() || !newNoticeContent.trim()) return;

    const newNotice: NoticeItem = {
      id: "n-" + Date.now(),
      topic: newNoticeTopic.trim(),
      content: newNoticeContent.trim(),
      postedBy: newNoticeBy.trim() || "Staff",
      date: new Date().toISOString().split("T")[0],
      tag: newNoticeTag
    };

    const updated = [newNotice, ...notices];
    setNotices(updated);
    localStorage.setItem("stream_staff_notices", JSON.stringify(updated));

    // Reset Form
    setNewNoticeTopic("");
    setNewNoticeContent("");
  };

  // Delete Notice Item
  const handleDeleteNotice = (id: string) => {
    const updated = notices.filter(item => item.id !== id);
    setNotices(updated);
    localStorage.setItem("stream_staff_notices", JSON.stringify(updated));
  };

  // Add Dialogue Plan
  const handleAddPlan = (e: FormEvent) => {
    e.preventDefault();
    if (!planTitle.trim() || !planPrompt.trim()) return;

    const newPlan: DialoguePlan = {
      id: "dp-" + Date.now(),
      title: planTitle.trim(),
      readingSource: planSource.trim() || "Independent Focus",
      dialoguePrompt: planPrompt.trim(),
      facilitator: planFacilitator.trim() || "Co-learning facilitator",
      durationMins: Number(planDuration) || 45
    };

    const updated = [newPlan, ...plans];
    setPlans(updated);
    localStorage.setItem("stream_staff_plans", JSON.stringify(updated));

    // Reset
    setPlanTitle("");
    setPlanSource("");
    setPlanPrompt("");
    setPlanFacilitator("");
  };

  // Delete Plan
  const handleDeletePlan = (id: string) => {
    const updated = plans.filter(p => p.id !== id);
    setPlans(updated);
    localStorage.setItem("stream_staff_plans", JSON.stringify(updated));
  };

  // Export Plan to Text File
  const handleExportPlan = (plan: DialoguePlan) => {
    const text = `================================================
CHALKSTREAM EDUCATORS | STAFF EDUCATOR DIALOGUE PLANNER
================================================
TITLE:         ${plan.title}
FACILITATOR:   ${plan.facilitator}
DURATION:      ${plan.durationMins} minutes
READING ANCHOR: ${plan.readingSource}
------------------------------------------------
CORE DIALOGUE PROMPTS & PHILOSOPHICAL INQUIRY:

${plan.dialoguePrompt}

------------------------------------------------
Notes: Ensure an open-circle formation without hierarchical lecterns.
Allow for silent pauses between responses. Focus on immediate self-observation.
===============================================`;

    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Stream_Dialogue_${plan.title.replace(/\s+/g, "_")}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Update Placement Status
  const handleUpdateStatus = (id: string, newStatus: PlacingCandidate["status"]) => {
    const updated = candidates.map(c => {
      if (c.id === id) {
        return { ...c, status: newStatus };
      }
      return c;
    });
    setCandidates(updated);
    localStorage.setItem("stream_staff_candidates", JSON.stringify(updated));
  };

  return (
    <div className="bg-canvas-bg min-h-screen py-10 px-4 sm:px-6 lg:px-8 font-hand">
      <div className="max-w-6xl mx-auto">
        
        <AnimatePresence mode="wait">
          {!isLoggedIn ? (
            /* ========================================================
               1. LOCK SCREEN / SECURE LOGIN INTERFACE
               ======================================================== */
            <motion.div
              key="login-screen"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="max-w-md mx-auto my-12"
            >
              <div className="bg-white rounded-xl border-2 border-[#1A1D1C] p-8 shadow-md relative overflow-hidden">
                {/* Visual Accent Corner Ribbon */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#F37021]/10 rounded-full filter blur-xl translate-x-12 -translate-y-12" />
                
                <div className="text-center mb-8 relative z-10">
                  <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-[#F37021]/30">
                    <Lock className="w-8 h-8 text-[#F37021]" />
                  </div>
                  <h3 className="font-sketch text-3xl text-espresso">
                    Staff Portal Login
                  </h3>
                  <span className="font-amatic text-sm uppercase tracking-wider text-[#5A5C5A] font-bold block mt-1">
                    Secure Facilitator Gate
                  </span>
                  <p className="text-sm text-[#5A5C5A] font-hand max-w-xs mx-auto mt-2">
                    Enter your staff credentials to access private notice boards, dialogue planners, candidate placement tables, and pedagogical tools.
                  </p>
                </div>

                <form onSubmit={handleLoginSubmit} className="space-y-5 relative z-10">
                  <div>
                    <label htmlFor="staff-username" className="block text-md font-semibold text-[#1A1D1C] mb-1.5">
                      Facilitator Username
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#5A5C5A]" />
                      <input
                        type="text"
                        id="staff-username"
                        autoComplete="username"
                        value={usernameInput}
                        onChange={(e) => setUsernameInput(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-white border-2 border-[#DDDCDA] focus:border-[#F37021] rounded-lg text-lg text-espresso placeholder-gray-400 focus:outline-none transition-colors"
                        placeholder="e.g. thestream"
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <label htmlFor="staff-password" className="text-md font-semibold text-[#1A1D1C]">
                        Security Passcode
                      </label>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#5A5C5A]" />
                      <input
                        type="password"
                        id="staff-password"
                        autoComplete="current-password"
                        value={passwordInput}
                        onChange={(e) => setPasswordInput(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-white border-2 border-[#DDDCDA] focus:border-[#F37021] rounded-lg text-lg text-espresso placeholder-gray-400 focus:outline-none transition-colors"
                        placeholder="••••••••••••"
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>

                  <AnimatePresence>
                    {loginError && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-red-50 text-red-650 p-3 rounded-md border border-red-200 flex items-start gap-2 text-sm text-center"
                      >
                        <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                        <span className="font-hand leading-relaxed">{loginError}</span>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 bg-[#F37021] hover:bg-[#E05A10] disabled:bg-[#F37021]/60 text-white font-sketch text-lg rounded-lg border border-[#1A1D1C] shadow transition-transform active:translate-y-[1px] flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? "Cryptographic verifying..." : "Authorize Access"}
                    <Sparkles className="w-5 h-5 text-amber-200 animate-pulse" />
                  </button>
                </form>

                <div className="mt-6 border-t border-dashed border-gray-200 pt-5 text-center">
                  <span className="text-xs text-slate-500 font-sans block">
                    Secured by SHA-256 Server Hash Decryption. No trace keys exposed to browser assets.
                  </span>
                </div>
              </div>
            </motion.div>
          ) : (
            /* ========================================================
               2. MAIN FACILITATOR STAFF DASHBOARD
               ======================================================== */
            <motion.div
              key="dashboard-screen"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="space-y-8"
            >
              {/* Dashboard Header Bar */}
              <div className="bg-white border-2 border-[#1A1D1C] rounded-xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-emerald-50 rounded-full flex items-center justify-center border border-emerald-500/30">
                    <Unlock className="w-7 h-7 text-emerald-600 animate-bounce" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="font-sketch text-3xl text-espresso">The Stream Staff Room</h2>
                      <span className="bg-[#F37021] text-white px-2 py-0.5 rounded text-xs font-sans font-bold">Admin Portal</span>
                    </div>
                    <span className="font-hand text-lg text-slate-500 block">
                      Welcome back, <strong className="text-espresso font-semibold">@{currentUser}</strong> • logged in securely.
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-slate-400 font-sans text-xs hidden sm:inline">
                    Session Key: Active (Automatic Clear)
                  </span>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-[#1A1D1C] font-sketch text-md rounded border border-[#1A1D1C] transition-all flex items-center gap-1.5"
                  >
                    <LogOut className="w-4 h-4 text-[#1A1D1C]" />
                    <span>Secure Sign Out</span>
                  </button>
                </div>
              </div>

              {/* Sub-navigation tabs */}
              <div className="flex flex-wrap border-b-2 border-espresso/10 gap-2">
                <button
                  onClick={() => setDbTab("notices")}
                  className={`px-5 py-3 rounded-t-lg font-sketch text-lg sm:text-xl border-x-2 border-t-2 border-transparent transition-all flex items-center gap-2 ${
                    dbTab === "notices"
                      ? "bg-white border-espresso/20 text-[#F37021] border-b-2 border-b-white -mb-[2px] font-bold"
                      : "text-slate-500 hover:text-[#1A1D1C]"
                  }`}
                >
                  <ClipboardList className="w-5 h-5 shrink-0" />
                  <span>Interactive Noticeboard</span>
                </button>
                <button
                  onClick={() => setDbTab("planner")}
                  className={`px-5 py-3 rounded-t-lg font-sketch text-lg sm:text-xl border-x-2 border-t-2 border-transparent transition-all flex items-center gap-2 ${
                    dbTab === "planner"
                      ? "bg-white border-espresso/20 text-[#F37021] border-b-2 border-b-white -mb-[2px] font-bold"
                      : "text-slate-500 hover:text-[#1A1D1C]"
                  }`}
                >
                  <BookOpen className="w-5 h-5 shrink-0" />
                  <span>Pedagogical Dialogue Planner</span>
                </button>
                <button
                  onClick={() => setDbTab("placements")}
                  className={`px-5 py-3 rounded-t-lg font-sketch text-lg sm:text-xl border-x-2 border-t-2 border-transparent transition-all flex items-center gap-2 ${
                    dbTab === "placements"
                      ? "bg-white border-espresso/20 text-[#F37021] border-b-2 border-b-white -mb-[2px] font-bold"
                      : "text-slate-500 hover:text-[#1A1D1C]"
                  }`}
                >
                  <User className="w-5 h-5 shrink-0" />
                  <span>Placement & Teacher Roster</span>
                </button>
                <button
                  onClick={() => setDbTab("vault")}
                  className={`px-5 py-3 rounded-t-lg font-sketch text-lg sm:text-xl border-x-2 border-t-2 border-transparent transition-all flex items-center gap-2 ${
                    dbTab === "vault"
                      ? "bg-white border-espresso/20 text-[#F37021] border-b-2 border-b-white -mb-[2px] font-bold"
                      : "text-slate-500 hover:text-[#1A1D1C]"
                  }`}
                >
                  <FileText className="w-5 h-5 shrink-0" />
                  <span>Resource Key Locker</span>
                </button>
                <button
                  onClick={() => setDbTab("enquiries")}
                  className={`px-5 py-3 rounded-t-lg font-sketch text-lg sm:text-xl border-x-2 border-t-2 border-transparent transition-all flex items-center gap-2 ${
                    dbTab === "enquiries"
                      ? "bg-white border-espresso/20 text-[#F37021] border-b-2 border-b-white -mb-[2px] font-bold"
                      : "text-slate-500 hover:text-[#1A1D1C]"
                  }`}
                >
                  <Mail className="w-5 h-5 shrink-0" />
                  <span>Admissions Enquiries ({enquiries.length})</span>
                </button>
                <button
                  onClick={() => setDbTab("chatbot")}
                  className={`px-5 py-3 rounded-t-lg font-sketch text-lg sm:text-xl border-x-2 border-t-2 border-transparent transition-all flex items-center gap-2 ${
                    dbTab === "chatbot"
                      ? "bg-white border-espresso/20 text-[#F37021] border-b-2 border-b-white -mb-[2px] font-bold"
                      : "text-slate-500 hover:text-[#1A1D1C]"
                  }`}
                >
                  <MessageSquare className="w-5 h-5 shrink-0 text-[#F37021]" />
                  <span>Chatbot Logs & Backups ({chatbotSessions.length})</span>
                </button>
              </div>

              {/* Primary Content Container */}
              <div className="bg-white border-2 border-[#1A1D1C] rounded-xl p-6 sm:p-8 min-h-[450px]">
                
                {/* PAGE 1: INTERACTIVE NOTICE BOARD */}
                {dbTab === "notices" && (
                  <div className="space-y-8 animate-fadeIn">
                    <div className="border-b border-gray-150 pb-4">
                      <h3 className="font-sketch text-2xl text-espresso flex items-center gap-2">
                        Common Room Bulletin Notice Board
                      </h3>
                      <p className="text-[#5A5C5A] text-md font-hand">
                        Facilitators can post notices, coordinate classroom schedules, or leave pedagogical notes here. Update elements instantly.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                      {/* Left: Notices Wall (7 columns) */}
                      <div className="lg:col-span-7 space-y-4">
                        <AnimatePresence>
                          {notices.map((item) => (
                            <motion.div
                              key={item.id}
                              initial={{ opacity: 0, x: -15 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, scale: 0.9 }}
                              transition={{ duration: 0.25 }}
                              className={`p-5 rounded-lg border-2 border-[#1A1D1C] relative shadow-sm transition-all ${
                                item.tag === "Urgent"
                                  ? "bg-red-50 border-red-400"
                                  : item.tag === "Curriculum"
                                  ? "bg-amber-50 border-amber-300"
                                  : item.tag === "Placement"
                                  ? "bg-emerald-50 border-emerald-300"
                                  : "bg-[#FAF9F6] border-[#DDDCDA]"
                              }`}
                            >
                              <div className="flex justify-between items-start gap-4 mb-2">
                                <span className={`text-[11px] font-bold font-sans uppercase tracking-widest px-2 py-0.5 rounded border border-current ${
                                  item.tag === "Urgent"
                                    ? "text-red-700 bg-red-100"
                                    : item.tag === "Curriculum"
                                    ? "text-amber-700 bg-amber-100"
                                    : item.tag === "Placement"
                                    ? "text-emerald-700 bg-emerald-100"
                                    : "text-indigo-700 bg-indigo-100"
                                }`}>
                                  {item.tag}
                                </span>
                                
                                <button
                                  onClick={() => handleDeleteNotice(item.id)}
                                  className="text-[#5A5C5A] hover:text-red-650 transition-colors"
                                  title="Delete Notice Bulletin"
                                >
                                  <Trash2 className="w-5 h-5" />
                                </button>
                              </div>

                              <h4 className="font-sketch text-lg text-espresso mb-1">
                                {item.topic}
                              </h4>
                              
                              <p className="font-hand text-md text-[#5A5C5A] leading-relaxed mb-4">
                                {item.content}
                              </p>

                              <div className="flex justify-between items-center text-xs text-slate-400 pt-2 border-t border-espresso/5 font-sans">
                                <span>Author: <strong className="text-slate-650">@{item.postedBy}</strong></span>
                                <span>Date: {item.date}</span>
                              </div>
                            </motion.div>
                          ))}
                        </AnimatePresence>
                      </div>

                      {/* Right: Post New Notice form (5 columns) */}
                      <form onSubmit={handleAddNotice} className="lg:col-span-5 bg-[#FAF9F6] rounded-lg border border-[#1A1D1C] p-6 space-y-4">
                        <h4 className="font-sketch text-xl text-[#F37021] pb-2 border-b border-espresso/10">
                          Pin a Board Member Notice
                        </h4>

                        <div>
                          <label className="block text-md font-semibold text-espresso mb-1">
                            Bulletin Topic
                          </label>
                          <input
                            type="text"
                            required
                            value={newNoticeTopic}
                            onChange={(e) => setNewNoticeTopic(e.target.value)}
                            className="w-full px-3 py-2 bg-white border-2 border-slate-200 focus:border-[#F37021] rounded font-hand text-md focus:outline-none placeholder-slate-350"
                            placeholder="e.g. Dialogue Circle Timing Change"
                          />
                        </div>

                        <div>
                          <label className="block text-md font-semibold text-espresso mb-1">
                            Tag / Priority
                          </label>
                          <select
                            value={newNoticeTag}
                            onChange={(e) => setNewNoticeTag(e.target.value as any)}
                            className="w-full px-3 py-2 bg-white border-2 border-slate-200 focus:border-[#F37021] rounded font-hand text-md focus:outline-none"
                          >
                            <option value="General">General</option>
                            <option value="Urgent">Urgent Warning</option>
                            <option value="Curriculum">Curriculum / Class</option>
                            <option value="Placement">Teacher Placement</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-md font-semibold text-espresso mb-1">
                            Notice Post Description
                          </label>
                          <textarea
                            rows={4}
                            required
                            value={newNoticeContent}
                            onChange={(e) => setNewNoticeContent(e.target.value)}
                            className="w-full px-3 py-2 bg-white border-2 border-slate-200 focus:border-[#F37021] rounded font-hand text-md focus:outline-none placeholder-slate-350 resize-y"
                            placeholder="Type notice guidelines here..."
                          />
                        </div>

                        <div>
                          <label className="block text-md font-semibold text-espresso mb-1">
                            Display Signature
                          </label>
                          <input
                            type="text"
                            value={newNoticeBy}
                            onChange={(e) => setNewNoticeBy(e.target.value)}
                            className="w-full px-3 py-2 bg-white border-2 border-slate-200 focus:border-[#F37021] rounded font-hand text-md focus:outline-none"
                            placeholder="e.g. Srini"
                          />
                        </div>

                        <button
                          type="submit"
                          className="w-full py-2.5 bg-[#F37021] hover:bg-[#E05A10] text-white font-sketch text-lg rounded border border-[#1A1D1C] shadow-sm flex items-center justify-center gap-2 transition-transform active:translate-y-[0.5px]"
                        >
                          <Send className="w-4 h-4 text-white" />
                          Pin Bulletin to Wall
                        </button>
                      </form>
                    </div>
                  </div>
                )}

                {/* PAGE 2: PEDAGOGICAL DIALOGUE PLANNER */}
                {dbTab === "planner" && (
                  <div className="space-y-8 animate-fadeIn">
                    <div className="border-b border-gray-150 pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div>
                        <h3 className="font-sketch text-2xl text-espresso flex items-center gap-2">
                          Weekly Educational Dialogue Circle Planner
                        </h3>
                        <p className="text-[#5A5C5A] text-md font-hand max-w-2xl">
                          Draft interactive learning scripts, philosopher modules (e.g. J. Krishnamurti passages), and active observation prompts. Export them instantly as clean offline files!
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                      {/* Left Side: Creation Form (5 columns) */}
                      <form onSubmit={handleAddPlan} className="lg:col-span-5 bg-[#FAF9F6] p-6 rounded-lg border border-[#1A1D1C] space-y-4">
                        <h4 className="font-sketch text-xl text-[#F37021] border-b border-espresso/10 pb-2">
                          Create Dialogue Session Plan
                        </h4>

                        <div>
                          <label className="block text-md font-semibold text-espresso mb-1">
                            Dialogue Theme / Topic
                          </label>
                          <input
                            type="text"
                            required
                            value={planTitle}
                            onChange={(e) => setPlanTitle(e.target.value)}
                            className="w-full px-3 py-2 bg-white border-2 border-slate-200 focus:border-[#F37021] rounded font-hand text-md focus:outline-none placeholder-slate-350"
                            placeholder="e.g. On Fear and the Inward Conflict"
                          />
                        </div>

                        <div>
                          <label className="block text-md font-semibold text-espresso mb-1">
                            Reading Anchor Source
                          </label>
                          <input
                            type="text"
                            value={planSource}
                            onChange={(e) => setPlanSource(e.target.value)}
                            className="w-full px-3 py-2 bg-white border-2 border-slate-200 focus:border-[#F37021] rounded font-hand text-md focus:outline-none placeholder-slate-350"
                            placeholder="e.g. Letters to Schools chapters"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-md font-semibold text-espresso mb-1">
                              Duration (Mins)
                            </label>
                            <input
                              type="number"
                              min={10}
                              max={180}
                              value={planDuration}
                              onChange={(e) => setPlanDuration(Number(e.target.value))}
                              className="w-full px-3 py-2 bg-white border-2 border-slate-200 focus:border-[#F37021] rounded font-hand text-md focus:outline-none"
                            />
                          </div>

                          <div>
                            <label className="block text-md font-semibold text-espresso mb-1">
                              Facilitator Sign
                            </label>
                            <input
                              type="text"
                              value={planFacilitator}
                              onChange={(e) => setPlanFacilitator(e.target.value)}
                              className="w-full px-3 py-2 bg-white border-2 border-slate-200 focus:border-[#F37021] rounded font-hand text-md focus:outline-none"
                              placeholder="e.g. Srini"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-md font-semibold text-espresso mb-1">
                            Inquiry Prompt / Core Questions
                          </label>
                          <textarea
                            rows={4}
                            required
                            value={planPrompt}
                            onChange={(e) => setPlanPrompt(e.target.value)}
                            className="w-full px-3 py-2 bg-white border-2 border-slate-200 focus:border-[#F37021] rounded font-hand text-md focus:outline-none placeholder-slate-350 resize-y"
                            placeholder="Draft key self-observation questions to trigger circle interaction..."
                          />
                        </div>

                        <button
                          type="submit"
                          className="w-full py-2.5 bg-[#F37021] hover:bg-[#E05A10] text-white font-sketch text-lg rounded border border-[#1A1D1C] flex items-center justify-center gap-2 shadow-sm transition-transform active:translate-y-[0.5px]"
                        >
                          <PlusCircle className="w-5 h-5 text-white" />
                          Save Session Plan
                        </button>
                      </form>

                      {/* Right Side: Saved Plans Gallery (7 columns) */}
                      <div className="lg:col-span-7 space-y-4">
                        <h4 className="font-sketch text-xl text-espresso border-b border-gray-100 pb-2">
                          Structured Sessions Library ({plans.length})
                        </h4>

                        <AnimatePresence>
                          {plans.map((p) => (
                            <motion.div
                              key={p.id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              className="p-5 rounded-lg border-2 border-[#1A1D1C] bg-white relative shadow-sm"
                            >
                              <div className="flex justify-between items-start gap-4 mb-3">
                                <div>
                                  <h4 className="font-sketch text-lg text-[#F37021]">
                                    {p.title}
                                  </h4>
                                  <span className="text-xs bg-slate-100 text-[#5A5C5A] px-2 py-0.5 rounded font-sans inline-block mt-1">
                                    Source: {p.readingSource}
                                  </span>
                                </div>

                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() => handleExportPlan(p)}
                                    className="p-1.5 text-slate-500 hover:text-[#F37021] bg-slate-50 hover:bg-amber-50 rounded border border-gray-250 transition-colors"
                                    title="Export dialogue plan as TXT file"
                                  >
                                    <FileDown className="w-4 h-4 text-emerald-650" />
                                  </button>
                                  
                                  <button
                                    onClick={() => handleDeletePlan(p.id)}
                                    className="p-1.5 text-[#5A5C5A] hover:text-red-650 hover:bg-red-50 rounded border border-gray-250 transition-colors"
                                    title="Delete session plan"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>

                              <div className="bg-[#FAF9F6] p-4 rounded border border-dashed border-gray-250 font-hand text-md text-[#5A5C5A] italic leading-relaxed mb-4">
                                "{p.dialoguePrompt}"
                              </div>

                              <div className="flex flex-wrap justify-between items-center text-xs text-slate-400 gap-2 pt-2 border-t border-espresso/5 font-sans">
                                <div className="flex items-center gap-1">
                                  <Calendar className="w-3.5 h-3.5" />
                                  <span>Facilitator: <strong>{p.facilitator}</strong></span>
                                </div>
                                <span className="font-semibold text-[#F37021]">{p.durationMins} minutes dialogue duration</span>
                              </div>
                            </motion.div>
                          ))}
                        </AnimatePresence>
                      </div>
                    </div>
                  </div>
                )}

                {/* PAGE 3: PLACEMENT & TEACHER ROSTER MANAGEMENT */}
                {dbTab === "placements" && (
                  <div className="space-y-8 animate-fadeIn">
                    <div className="border-b border-gray-150 pb-4">
                      <h3 className="font-sketch text-2xl text-espresso flex items-center gap-2">
                        Alternative Teacher Placement Roster & Recruitment
                      </h3>
                      <p className="text-[#5A5C5A] text-md font-hand col-span-2">
                        Track upcoming educators certificates profiles, and coordinate candidate assignments dynamically for partner schools like Aranyaani and Aarohi learning circles.
                      </p>
                    </div>

                    <div className="overflow-x-auto rounded-lg border-2 border-[#1A1D1C]">
                      <table className="w-full text-left font-hand border-collapse text-md bg-white">
                        <thead>
                          <tr className="bg-[#FAF9F6] border-b border-espresso/20 text-espresso font-sketch md:text-lg">
                            <th className="py-4 px-4 font-bold">Candidate Name</th>
                            <th className="py-4 px-4 font-bold">Training Program</th>
                            <th className="py-4 px-4 font-bold">Coordination Status</th>
                            <th className="py-4 px-4 font-bold">Active Facilitator Notes</th>
                            <th className="py-2 px-4 text-center font-bold">Re-assign Position</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-150">
                          {candidates.map((c) => (
                            <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                              <td className="py-4 px-4 font-semibold text-espresso">
                                {c.name}
                              </td>
                              <td className="py-4 px-4 text-[#5A5C5A] text-sm font-sans">
                                {c.program}
                              </td>
                              <td className="py-4 px-4 text-sm font-sans">
                                <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${
                                  c.status === "Assigned to Aranyaani"
                                    ? "bg-amber-100 text-amber-800 border border-amber-300"
                                    : c.status === "Assigned to Aarohi"
                                    ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                                    : c.status === "Approved"
                                    ? "bg-blue-100 text-blue-800 border border-blue-300"
                                    : "bg-gray-100 text-gray-800 border border-gray-300"
                                }`}>
                                  {c.status}
                                </span>
                              </td>
                              <td className="py-4 px-4 text-[#5C5C5C] max-w-xs truncate leading-relaxed">
                                {c.notes}
                              </td>
                              <td className="py-4 px-4 select-wrapper text-right">
                                <select
                                  value={c.status}
                                  onChange={(e) => handleUpdateStatus(c.id, e.target.value as any)}
                                  className="px-2 py-1 bg-[#FAF9F6] border-2 border-dashed border-[#F37021]/60 focus:border-[#F37021] text-xs font-semibold text-espresso rounded focus:outline-none"
                                >
                                  <option value="Reviewing">Reviewing</option>
                                  <option value="Interview Scheduled">Interview Scheduled</option>
                                  <option value="Approved">Approved Status</option>
                                  <option value="Assigned to Aranyaani">Assigned: Aranyaani</option>
                                  <option value="Assigned to Aarohi">Assigned: Aarohi</option>
                                </select>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* PAGE 4: PRIVATE RESOURCE KEY LOCKER */}
                {dbTab === "vault" && (
                  <div className="space-y-8 animate-fadeIn">
                    <div className="border-b border-gray-150 pb-4">
                      <h3 className="font-sketch text-2xl text-espresso flex items-center gap-2">
                        Direct Curriculum Resource Vault Links
                      </h3>
                      <p className="text-[#5A5C5A] text-md font-hand max-w-2xl">
                        Fast access links for coordinators to manage files, curriculum spreadsheets, and parent circles.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
                      
                      {/* Document Item 1 */}
                      <div className="p-5 rounded-lg border-2 border-[#1A1D1C] bg-[#FAF9F6] shadow-sm hover:-translate-y-[1px] transition-transform space-y-4">
                        <div className="flex justify-between items-start">
                          <div className="w-10 h-10 rounded bg-amber-50 flex items-center justify-center text-[#F37021] font-bold border border-amber-300/40">
                            <ClipboardList className="w-5 h-5 text-[#F37021]" />
                          </div>
                          <span className="text-xs bg-slate-205 text-[#5A5C5A] px-2 py-0.5 rounded font-sans">
                            Spreadsheet (.xlsx)
                          </span>
                        </div>
                        <div>
                          <h4 className="font-sketch text-lg text-espresso mb-1">
                            Student Cohort Registration & Attendance
                          </h4>
                          <p className="text-sm text-[#5A5C5A] font-hand max-w-xs leading-relaxed">
                            Private file to review admissions records of current 12-month teacher training cohort, candidate details & addresses.
                          </p>
                        </div>
                        <a
                          href="https://onedrive.live.com/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 bg-emerald-550 border border-emerald-650 hover:bg-emerald-600 font-sketch text-xs text-white rounded inline-flex items-center gap-1.5 transition-all w-2/3 shadow-sm hover:shadow"
                          style={{ backgroundColor: "rgb(16, 124, 65)" }}
                        >
                          <FileText className="w-3.5 h-3.5" />
                          Open OneDrive Database
                        </a>
                      </div>

                      {/* Document Item 2 */}
                      <div className="p-5 rounded-lg border-2 border-[#1A1D1C] bg-[#FAF9F6] shadow-sm hover:-translate-y-[1px] transition-transform space-y-4">
                        <div className="flex justify-between items-start">
                          <div className="w-10 h-10 rounded bg-amber-50 flex items-center justify-center text-[#F37021] font-bold border border-amber-300/40">
                            <BookOpen className="w-5 h-5 text-[#F37021]" />
                          </div>
                          <span className="text-xs bg-slate-205 text-[#5A5C5A] px-2 py-0.5 rounded font-sans">
                            Word Folder (.docx)
                          </span>
                        </div>
                        <div>
                          <h4 className="font-sketch text-lg text-espresso mb-1">
                            Master Syllabus & Pedagogy Guidelines
                          </h4>
                          <p className="text-sm text-[#5A5C5A] font-hand max-w-xs leading-relaxed">
                            Alternative educational philosophy archives: Jiddu Krishnamurti, Montessori, and Summerhill democratic school models logs.
                          </p>
                        </div>
                        <a
                          href="https://onedrive.live.com/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 bg-blue-550 border border-blue-650 hover:bg-blue-600 font-sketch text-xs text-white rounded inline-flex items-center gap-1.5 transition-all w-2/3 shadow-sm hover:shadow"
                          style={{ backgroundColor: "rgb(43, 87, 154)" }}
                        >
                          <BookOpen className="w-3.5 h-3.5" />
                          Access Syllabus Folders
                        </a>
                      </div>

                    </div>
                  </div>
                )}

                {/* PAGE 5: ADMISSIONS ENQUIRIES VIEW */}
                {dbTab === "enquiries" && (
                  <div className="space-y-8 animate-fadeIn">
                    <div className="border-b border-gray-150 pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div>
                        <h3 className="font-sketch text-2xl text-espresso flex items-center gap-2">
                          Active Admission & Reflection Journey Submissions
                        </h3>
                        <p className="text-[#5A5C5A] text-md font-hand max-w-2xl font-semibold">
                          Review candidate reflections, track their submitted interest, and contact coordinates. These submissions are stored server-side.
                        </p>
                      </div>
                      <button
                        onClick={fetchEnquiries}
                        disabled={isLoadingEnquiries}
                        className="px-4 py-2 bg-[#FAF9F6] border-2 border-dashed border-[#F37021]/60 hover:bg-[#F37021]/10 text-xs font-semibold text-espresso rounded transition-colors"
                      >
                        {isLoadingEnquiries ? "Refreshing..." : "Refresh Submissions"}
                      </button>
                    </div>

                    {/* Action success notify bar */}
                    {actionStatus && (
                      <div className="bg-emerald-50 border-2 border-emerald-500/30 text-emerald-800 font-hand text-lg p-3 rounded-lg flex items-center gap-2 animate-fadeIn uppercase">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                        {actionStatus}
                      </div>
                    )}

                    {enquiries.length === 0 ? (
                      <div className="text-center py-16 bg-[#FAF9F6] rounded-lg border-2 border-dashed border-gray-200">
                        <Mail className="w-12 h-12 text-[#979997] mx-auto mb-4 animate-pulse" />
                        <h4 className="font-sketch text-xl text-espresso">No submissions received yet</h4>
                        <p className="font-hand text-[#5A5C5A] max-w-xs mx-auto mt-1">
                          When visitors fill out the reflection journey enquiry form, their details will stream directly here.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {enquiries.map((enq) => (
                          <div
                            key={enq.id}
                            className="bg-[#FAF9F6] border-2 border-[#1A1D1C] p-6 rounded-xl shadow-sm relative overflow-hidden flex flex-col justify-between hover:border-[#F37021] transition-colors"
                          >
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#DDD9CE] pb-3 mb-3">
                              <div>
                                <h4 className="font-sketch text-2xl text-[#F37021]">
                                  {enq.name}
                                </h4>
                                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-1">
                                  <a
                                    href={`mailto:${enq.email}`}
                                    className="text-sm font-mono text-[#5A5C5A] hover:text-[#F37021] underline"
                                  >
                                    ✉ {enq.email}
                                  </a>
                                  {enq.phone && (
                                    <span className="text-sm font-mono text-[#5A5C5A]">
                                      📞 {enq.phone}
                                    </span>
                                  )}
                                </div>
                              </div>
                              <div className="flex items-center gap-3 self-start sm:self-center font-sans text-xs text-[#7F817F]">
                                {enq.cvName && (
                                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-550 border border-emerald-650 hover:bg-blue-600 font-sketch text-xs text-white rounded truncate max-w-[240px]">
                                    <Paperclip className="w-3.5 h-3.5 text-white" />
                                    {enq.cvName}
                                  </span>
                                )}
                                <span className="bg-[#1A1D1C]/5 px-2.5 py-1 rounded">
                                  Submitted: {enq.date}
                                </span>
                              </div>
                            </div>

                            <div className="text-espresso font-hand text-lg leading-relaxed whitespace-pre-wrap bg-white border border-dashed border-gray-200 rounded-lg p-5 mb-4 line-clamp-3">
                              "{enq.journeyText}"
                            </div>

                            {/* Action Control Row */}
                            <div className="border-t border-gray-150 pt-3 flex flex-wrap gap-2 items-center">
                              <button
                                type="button"
                                onClick={() => setSelectedEnquiry(enq)}
                                className="px-3.5 py-1.5 bg-[#F37021]/10 hover:bg-[#F37021]/20 text-xs font-semibold text-[#F37021] rounded border border-[#F37021]/25 flex items-center gap-1.5 cursor-pointer transition-colors"
                              >
                                <Eye className="w-3.5 h-3.5" /> Open / View File
                              </button>
                              
                              <button
                                type="button"
                                onClick={() => {
                                  setForwardingEnquiry(forwardingEnquiry?.id === enq.id ? null : enq);
                                  setForwardEmailInput("");
                                }}
                                className="px-3.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-xs font-semibold text-blue-700 rounded border border-blue-200 flex items-center gap-1.5 cursor-pointer transition-colors"
                              >
                                <Share2 className="w-3.5 h-3.5" /> Fwd
                              </button>

                              <button
                                type="button"
                                onClick={() => handleDeleteEnquiry(enq.id)}
                                className="px-3.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-xs font-semibold text-rose-700 rounded border border-rose-200 flex items-center gap-1.5 cursor-pointer transition-colors ml-auto"
                              >
                                <Trash2 className="w-3.5 h-3.5" /> Delete
                              </button>
                            </div>

                            {/* Inline Forward Panel */}
                            {forwardingEnquiry?.id === enq.id && (
                              <div className="bg-blue-50/50 rounded-lg border border-dashed border-blue-200 p-4 mt-3 space-y-3 animate-fadeIn">
                                <p className="font-hand text-sm text-[#5A5C5A]">
                                  Forward candidate's dynamic reflection journey to standard alternative school coordinators or customized collaborators:
                                </p>
                                <div className="flex gap-2">
                                  <input
                                    type="email"
                                    placeholder="Enter recipient email address"
                                    value={forwardEmailInput}
                                    onChange={(e) => setForwardEmailInput(e.target.value)}
                                    className="bg-white border border-gray-300 rounded font-mono text-sm px-3 py-1.5 flex-1 focus:outline-none focus:border-blue-500"
                                  />
                                  <button
                                    onClick={() => handleForwardEnquiry(enq.id, forwardEmailInput)}
                                    className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded cursor-pointer flex items-center gap-1.5"
                                  >
                                    <Send className="w-3.5 h-3.5" /> Send
                                  </button>
                                  <button
                                    onClick={() => setForwardingEnquiry(null)}
                                    className="px-3 py-1.5 bg-gray-200 hover:bg-gray-300 text-gray-700 text-xs font-semibold rounded cursor-pointer"
                                  >
                                    Cancel
                                  </button>
                                </div>
                                <div className="flex flex-wrap gap-2 pt-1.5 items-center">
                                  <span className="text-xs text-gray-500 font-hand">Preset Coordinates:</span>
                                  <button
                                    type="button"
                                    onClick={() => setForwardEmailInput("info@thestream.co.in")}
                                    className="bg-white hover:bg-gray-100 border border-gray-200 text-xs px-2.5 py-1 rounded font-mono cursor-pointer"
                                  >
                                    info@thestream.co.in
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setForwardEmailInput("aranyaani.edu@outlook.com")}
                                    className="bg-white hover:bg-gray-100 border border-gray-200 text-xs px-2.5 py-1 rounded font-mono cursor-pointer"
                                  >
                                    aranyaani.edu@outlook.com
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setForwardEmailInput("contact@aarohilife.org")}
                                    className="bg-white hover:bg-gray-100 border border-gray-200 text-xs px-2.5 py-1 rounded font-mono cursor-pointer"
                                  >
                                    contact@aarohilife.org
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* DETAILED ENQUIRY MODAL OVERLAY */}
                {selectedEnquiry && (
                  <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
                    <div className="bg-[#FAF9F6] border-2 border-[#1A1D1C] rounded-2xl max-w-2xl w-full p-6 md:p-8 shadow-2xl relative space-y-6 animate-scaleIn">
                      
                      {/* Modal Close Button */}
                      <button
                        onClick={() => setSelectedEnquiry(null)}
                        className="absolute top-4 right-4 bg-gray-200 hover:bg-gray-300 rounded-full p-1.5 transition-colors cursor-pointer"
                      >
                        <span className="font-sans font-bold text-gray-800 text-sm flex justify-center items-center w-4 h-4">✕</span>
                      </button>

                      <div>
                        <span className="bg-[#F37021]/15 text-[#F37021] text-xs font-mono px-2.5 py-1 rounded uppercase tracking-wider font-semibold">
                          Alternative Candidate File
                        </span>
                        <h3 className="font-sketch text-4xl text-espresso mt-3">
                          {selectedEnquiry.name}
                        </h3>
                        <p className="font-mono text-xs text-gray-500 mt-1">
                          Enquiry ID: {selectedEnquiry.id} • Submitted: {selectedEnquiry.date}
                        </p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white border border-gray-150 p-4 rounded-xl">
                        <div>
                          <span className="font-sans text-xs text-[#7F817F] uppercase tracking-wider block font-semibold">Email Address</span>
                          <a
                            href={`mailto:${selectedEnquiry.email}`}
                            className="font-mono text-base text-espresso hover:text-[#F37021] underline"
                          >
                            ✉ {selectedEnquiry.email}
                          </a>
                        </div>
                        <div>
                          <span className="font-sans text-xs text-[#7F817F] uppercase tracking-wider block font-semibold">Phone Number</span>
                          <span className="font-mono text-base text-espresso block">
                            📞 {selectedEnquiry.phone || "Not specified"}
                          </span>
                        </div>
                        {selectedEnquiry.cvName && (
                          <div className="sm:col-span-2 pt-2 border-t border-gray-100 flex items-center justify-between">
                            <div>
                              <span className="font-sans text-xs text-[#7F817F] uppercase tracking-wider block font-semibold">Curriculum Vitae File</span>
                              <span className="text-sm font-sans text-espresso font-semibold flex items-center gap-1.5 mt-0.5">
                                <Paperclip className="w-4 h-4 text-[#F37021]" />
                                {selectedEnquiry.cvName}
                              </span>
                            </div>
                            <a
                              href={selectedEnquiry.cvBase64 || "#"}
                              download={selectedEnquiry.cvName}
                              onClick={(e) => { 
                                if (!selectedEnquiry.cvBase64) {
                                  e.preventDefault(); 
                                  alert("Preparing sandbox download request for candidate resume (historical entry): " + selectedEnquiry.cvName); 
                                }
                              }}
                              className="px-3 py-1.5 bg-[#F37021]/10 hover:bg-[#F37021]/20 text-[#F37021] font-sketch text-xs rounded border border-[#F37021]/20 flex items-center gap-1 cursor-pointer transition-colors"
                            >
                              <FileDown className="w-3.5 h-3.5" /> Download CV
                            </a>
                          </div>
                        )}

                        {/* Candidate uploaded supporting gallery images */}
                        {selectedEnquiry.images && selectedEnquiry.images.length > 0 && (
                          <div className="sm:col-span-2 pt-3 border-t border-gray-100 space-y-2">
                            <span className="font-sans text-xs text-[#7F817F] uppercase tracking-wider block font-semibold">
                              Candidate Attached Supporting Images / Gallery ({selectedEnquiry.images.length})
                            </span>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                              {selectedEnquiry.images.map((img: any, idx: number) => (
                                <div key={idx} className="relative group bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm aspect-video sm:aspect-square flex flex-col justify-end">
                                  <img 
                                    src={img.base64} 
                                    alt={img.name} 
                                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-200 cursor-pointer"
                                    onClick={() => {
                                      const w = window.open();
                                      if (w) {
                                        w.document.write(`<img src="${img.base64}" style="max-width:100%; max-height:100vh; display:block; margin:auto;"/>`);
                                      } else {
                                        alert(`Viewing image "${img.name}". Please enable popups to zoom in. `);
                                      }
                                    }}
                                    referrerPolicy="no-referrer"
                                  />
                                  <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white px-2 py-0.5 text-[9px] font-mono truncate">
                                    {img.name}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="space-y-2">
                        <span className="font-sans text-xs text-[#7F817F] uppercase tracking-wider block font-semibold">
                          Candidate Reflection Essay & Journey Alignment Note
                        </span>
                        <div className="bg-white border-2 border-[#1A1D1C]/25 text-espresso font-hand text-xl leading-relaxed rounded-xl p-6 shadow-inner whitespace-pre-wrap max-h-72 overflow-y-auto">
                          "{selectedEnquiry.journeyText}"
                        </div>
                      </div>

                      {/* Modal Action tray */}
                      <div className="border-t border-gray-200 pt-5 flex flex-wrap gap-3 items-center justify-between">
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setForwardingEnquiry(forwardingEnquiry?.id === selectedEnquiry.id ? null : selectedEnquiry);
                              setForwardEmailInput("");
                            }}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 shadow cursor-pointer"
                          >
                            <Share2 className="w-4 h-4" /> Forward Candidate
                          </button>
                          <button
                            onClick={() => handleDeleteEnquiry(selectedEnquiry.id)}
                            className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-[#E11D48] border border-rose-200 text-xs font-semibold rounded-lg flex items-center gap-1.5 cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" /> Delete Records
                          </button>
                        </div>
                        <button
                          onClick={() => setSelectedEnquiry(null)}
                          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 text-xs font-semibold rounded-lg cursor-pointer"
                        >
                          Close File
                        </button>
                      </div>

                      {/* Embedded forward form inside modal if triggered */}
                      {forwardingEnquiry?.id === selectedEnquiry.id && (
                        <div className="bg-blue-50/70 rounded-xl border border-dashed border-blue-200 p-4 space-y-3 animate-fadeIn mt-3">
                          <p className="font-hand text-sm text-[#5A5C5A]">
                            Forward candidate file to alternative schools / coordinates:
                          </p>
                          <div className="flex gap-2">
                            <input
                              type="email"
                              placeholder="Enter target coordinator email"
                              value={forwardEmailInput}
                              onChange={(e) => setForwardEmailInput(e.target.value)}
                              className="bg-white border border-gray-300 rounded font-mono text-sm px-3 py-1.5 flex-1 focus:outline-none"
                            />
                            <button
                              type="button"
                              onClick={() => handleForwardEnquiry(selectedEnquiry.id, forwardEmailInput)}
                              className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded cursor-pointer text-center"
                            >
                              Send Now
                            </button>
                          </div>
                        </div>
                      )}

                    </div>
                  </div>
                )}

                {/* PAGE 6: CHATBOT MANAGER VIEW */}
                {dbTab === "chatbot" && (
                  <div className="space-y-8 animate-fadeIn">
                    <div className="border-b border-gray-150 pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div>
                        <h3 className="font-sketch text-2xl text-espresso flex items-center gap-2">
                          Conversational Chatbot Dialogue & Offline Backup Records
                        </h3>
                        <p className="text-[#5A5C5A] text-md font-hand max-w-2xl font-semibold">
                          Live tracking of learner chats. Enquiries outside 10:00 AM - 4:00 PM are automatically backed up as offline messages for coordination.
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={fetchChatbotSessions}
                          disabled={isLoadingChatbot}
                          className="px-4 py-2 bg-[#FAF9F6] border-2 border-dashed border-[#F37021]/60 hover:bg-[#F37021]/10 text-xs font-semibold text-espresso rounded transition-colors"
                        >
                          {isLoadingChatbot ? "Refreshing..." : "Refresh Logs"}
                        </button>
                        <a
                          href="/api/staff/chatbot/download-backup"
                          download="the_stream_chatbot_backup.json"
                          className="px-4 py-2 bg-espresso text-stone-100 text-xs font-semibold rounded hover:bg-espresso/90 flex items-center gap-1 transition-all"
                        >
                          <FileDown className="w-4 h-4 text-[#F37021]" />
                          Download Backup (JSON)
                        </a>
                        <button
                          onClick={handleClearAllChatSessions}
                          className="px-4 py-2 bg-rose-50 text-[#E11D48] border border-rose-200 text-xs font-semibold rounded hover:bg-rose-100 transition-colors"
                        >
                          Clear All Logs
                        </button>
                      </div>
                    </div>

                    {/* Action success notify bar */}
                    {actionStatus && (
                      <div className="bg-emerald-50 border-2 border-emerald-500/30 text-emerald-800 font-hand text-lg p-3 rounded-lg flex items-center gap-2 animate-fadeIn uppercase">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                        {actionStatus}
                      </div>
                    )}

                    {chatbotSessions.length === 0 ? (
                      <div className="text-center py-12 bg-[#FAF9F6] border-2 border-dashed border-espresso/15 rounded-xl">
                        <MessageSquare className="w-12 h-12 text-[#F37021]/40 mx-auto mb-2" />
                        <h4 className="font-sketch text-xl text-espresso">No Dialogues Stored Yet</h4>
                        <p className="text-[#7F817F] font-hand text-lg mt-1">
                          When visitors chat with The Stream's advisor, transcripts will populate here in real-time.
                        </p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        {/* List of Chat Sessions (Left Column) */}
                        <div className="lg:col-span-5 space-y-4 max-h-[600px] overflow-y-auto pr-2">
                          <h4 className="font-sketch text-lg text-espresso border-b pb-1">
                            Recorded Conversations ({chatbotSessions.length})
                          </h4>
                          {chatbotSessions.map((session) => (
                            <div
                              key={session.id}
                              onClick={() => setSelectedChatSession(session)}
                              className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                                selectedChatSession?.id === session.id
                                  ? "border-[#F37021] bg-[#F37021]/5 shadow-sm"
                                  : "border-[#1A1D1C]/15 bg-white hover:border-[#F37021]/40"
                              }`}
                            >
                              <div className="flex justify-between items-start gap-2">
                                <div className="space-y-1">
                                  <div className="font-bold text-espresso text-sm flex items-center gap-1.5">
                                    <span className="w-2 h-2 rounded-full bg-[#F37021]" />
                                    {session.userName}
                                  </div>
                                  <div className="text-xs text-stone-500 font-mono truncate max-w-[200px]">
                                    {session.userEmail}
                                  </div>
                                </div>
                                <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase ${
                                  session.status === "active" 
                                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200" 
                                    : "bg-amber-50 text-amber-700 border border-amber-200"
                                }`}>
                                  {session.status === "active" ? "Live Dialog" : "Offline Msg"}
                                </span>
                              </div>

                              <div className="mt-3 pt-3 border-t border-dashed border-stone-100 flex justify-between items-center text-[10px] text-stone-500">
                                <span>Started: {new Date(session.startedAt).toLocaleDateString()}</span>
                                <span className="font-mono text-[9px] bg-stone-100 px-1.5 py-0.5 rounded text-stone-600">
                                  {session.timingChecked}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Dialogue Transcript Panel (Right Column) */}
                        <div className="lg:col-span-7">
                          {selectedChatSession ? (
                            <div className="border-2 border-[#1A1D1C] rounded-xl overflow-hidden bg-[#FAF9F6] flex flex-col h-[550px]">
                              {/* Header */}
                              <div className="bg-espresso text-stone-100 p-4 border-b border-espresso flex justify-between items-center">
                                <div>
                                  <div className="font-sketch text-lg text-[#F37021]">
                                    Dialogue with {selectedChatSession.userName}
                                  </div>
                                  <div className="text-[10px] text-stone-300 font-mono">
                                    Session ID: {selectedChatSession.id}
                                  </div>
                                </div>
                                <button
                                  onClick={() => handleDeleteChatSession(selectedChatSession.id)}
                                  className="p-1.5 hover:bg-rose-500/20 text-rose-400 hover:text-rose-500 rounded transition-all"
                                  title="Delete this chat transcript"
                                >
                                  <Trash2 className="w-4.5 h-4.5" />
                                </button>
                              </div>

                              {/* Message History */}
                              <div className="flex-grow p-4 space-y-4 overflow-y-auto">
                                {selectedChatSession.messages && selectedChatSession.messages.map((m: any, index: number) => (
                                  <div
                                    key={index}
                                    className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                                  >
                                    <div
                                      className={`max-w-[85%] rounded-lg px-4 py-2 text-sm ${
                                        m.role === "user"
                                          ? "bg-[#F37021] text-white rounded-br-none"
                                          : "bg-white text-espresso border border-stone-200 shadow-sm rounded-bl-none"
                                      }`}
                                    >
                                      <p className={m.role === "model" ? "font-hand text-md text-[#333333] leading-relaxed" : "leading-relaxed"}>
                                        {m.content}
                                      </p>
                                      <span className="text-[9px] opacity-60 block mt-1 text-right">
                                        {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                      </span>
                                    </div>
                                  </div>
                                ))}
                              </div>

                              {/* Metadata Panel */}
                              <div className="bg-stone-100 p-3 border-t border-stone-200 text-xs space-y-1 font-mono text-stone-600">
                                <div><strong className="text-espresso">Email:</strong> {selectedChatSession.userEmail}</div>
                                <div><strong className="text-espresso">Started:</strong> {new Date(selectedChatSession.startedAt).toLocaleString()}</div>
                                <div><strong className="text-espresso">Last Active:</strong> {new Date(selectedChatSession.lastActive).toLocaleString()}</div>
                                <div><strong className="text-espresso">Captured Timing:</strong> {selectedChatSession.timingChecked}</div>
                              </div>
                            </div>
                          ) : (
                            <div className="border-2 border-dashed border-[#1A1D1C]/20 rounded-xl h-[550px] flex flex-col justify-center items-center text-center p-8 bg-white">
                              <Sparkles className="w-10 h-10 text-[#F37021]/30 mb-2 animate-pulse" />
                              <h4 className="font-sketch text-lg text-espresso">Select a recorded dialogue</h4>
                              <p className="text-stone-500 font-hand text-md mt-1">
                                Click any chat session on the left to inspect transcripts, user metadata, and captured contact leads.
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}

              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
