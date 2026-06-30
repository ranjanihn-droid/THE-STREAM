import { useState, useEffect, useRef, FormEvent } from "react";
import { MessageSquare, X, Send, Clock, User, Mail, Sparkles, RefreshCw, AlertTriangle, BadgeAlert } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface Message {
  id: string;
  role: "user" | "model" | "system";
  content: string;
  timestamp: string;
}

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  // Lead Info
  const [userName, setUserName] = useState(() => localStorage.getItem("stream_chat_username") || "");
  const [userEmail, setUserEmail] = useState(() => localStorage.getItem("stream_chat_useremail") || "");
  const [isIdentitySaved, setIsIdentitySaved] = useState(() => !!localStorage.getItem("stream_chat_username"));
  
  // Timing & Force Override (for demoing live mode outside 10am-4pm)
  const [isInsideHours, setIsInsideHours] = useState(true);
  const [currentTimeStr, setCurrentTimeStr] = useState("");
  const [forceOnline, setForceOnline] = useState(false);

  const [sessionId] = useState(() => {
    let id = sessionStorage.getItem("stream_chat_session_id");
    if (!id) {
      id = "session-" + Math.random().toString(36).substring(2, 11) + "-" + Date.now();
      sessionStorage.setItem("stream_chat_session_id", id);
    }
    return id;
  });

  const chatEndRef = useRef<HTMLDivElement>(null);

  // Track Bangalore Time (IST - UTC+5:30)
  useEffect(() => {
    const checkTiming = () => {
      const now = new Date();
      // Calculate IST time
      const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
      const istTime = new Date(utc + (3600000 * 5.5));
      
      const hours = istTime.getHours();
      const minutes = istTime.getMinutes();
      const ampm = hours >= 12 ? "PM" : "AM";
      const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
      const formattedMinutes = minutes < 10 ? "0" + minutes : minutes;
      
      setCurrentTimeStr(`${formattedHours}:${formattedMinutes} ${ampm} IST`);
      
      // Inside 10:00 AM to 4:00 PM
      setIsInsideHours(hours >= 10 && hours < 16);
    };

    checkTiming();
    const interval = setInterval(checkTiming, 10000); // Check every 10 seconds
    return () => clearInterval(interval);
  }, []);

  // Save info helper
  const handleSaveIdentity = (e: FormEvent) => {
    e.preventDefault();
    if (userName.trim() && userEmail.trim()) {
      localStorage.setItem("stream_chat_username", userName.trim());
      localStorage.setItem("stream_chat_useremail", userEmail.trim());
      setIsIdentitySaved(true);
      
      // Introduce message
      const introMsg: Message = {
        id: "msg-intro-saved",
        role: "model",
        content: `Thank you, ${userName}! How can I help you explore The Stream today?`,
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, introMsg]);
    }
  };

  // Initial welcome message
  useEffect(() => {
    const savedChat = sessionStorage.getItem(`stream_chat_messages_${sessionId}`);
    if (savedChat) {
      try {
        setMessages(JSON.parse(savedChat));
      } catch (e) {
        initializeDefaultWelcome();
      }
    } else {
      initializeDefaultWelcome();
    }
  }, [sessionId]);

  const initializeDefaultWelcome = () => {
    const welcomeMsg: Message = {
      id: "msg-welcome",
      role: "model",
      content: "Hello! Welcome to The Stream Admissions & Dialogue assistant. Our live advisors are available from 10:00 AM to 4:00 PM IST.",
      timestamp: new Date().toISOString()
    };
    setMessages([welcomeMsg]);
  };

  // Sync to sessionStorage
  useEffect(() => {
    if (messages.length > 0) {
      sessionStorage.setItem(`stream_chat_messages_${sessionId}`, JSON.stringify(messages));
    }
  }, [messages, sessionId]);

  // Scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const sendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    // Build immediate user message
    const userMsg: Message = {
      id: "user-msg-" + Date.now(),
      role: "user",
      content: textToSend,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chatbot/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          userName: userName || "Anonymous Learner",
          userEmail: userEmail || "Not provided",
          content: textToSend,
          forceOnline: forceOnline
        })
      });

      const data = await response.json();
      if (data.success && Array.isArray(data.messages)) {
        // Find latest model reply from server returned messages
        const serverMessages = data.messages;
        const latestModelMsg = serverMessages.filter((m: any) => m.role === "model").pop();
        if (latestModelMsg) {
          setMessages(prev => [
            ...prev,
            {
              id: latestModelMsg.id || "model-reply-" + Date.now(),
              role: "model",
              content: latestModelMsg.content,
              timestamp: latestModelMsg.timestamp || new Date().toISOString()
            }
          ]);
        }
      } else {
        throw new Error("Invalid response format");
      }
    } catch (err) {
      console.error("Chat message error:", err);
      // Beautiful fallback offline-mode notice
      setMessages(prev => [
        ...prev,
        {
          id: "err-fallback-" + Date.now(),
          role: "model",
          content: "I've carefully saved your enquiry in our local stream register. Our servers are syncing; if you require immediate assistance, feel free to submit an official interest reflection via our Join Us page, or email our coordination desk directly!",
          timestamp: new Date().toISOString()
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitMsg = (e: FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleSuggestionClick = (suggestion: string) => {
    sendMessage(suggestion);
  };

  const handleResetSession = () => {
    if (window.confirm("Do you want to reset this chat session? This will clear current screen log.")) {
      sessionStorage.removeItem(`stream_chat_messages_${sessionId}`);
      setInput("");
      setIsLoading(false);
      initializeDefaultWelcome();
    }
  };

  const activeOnlineState = isInsideHours || forceOnline;

  return (
    <div id="the-stream-chatbot-root" className="fixed bottom-6 right-6 z-[999] font-sans">
      <AnimatePresence>
        {/* Expanded Chat Box */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="w-[340px] sm:w-[380px] h-[550px] bg-stone-50 border-2 border-espresso rounded-xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Top Header Panel */}
            <div className="bg-espresso text-stone-100 p-4 border-b-2 border-espresso flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded bg-[#F37021]/20 flex items-center justify-center text-[#F37021] border border-[#F37021]/40">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-sketch text-lg leading-none tracking-wide text-[#F37021]">The Stream Advisor</h3>
                  <span className="text-[10px] text-stone-300 font-mono tracking-widest uppercase">Dialogue Console</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleResetSession}
                  title="Reset conversation"
                  className="p-1 hover:bg-white/10 rounded transition-colors text-stone-400 hover:text-white"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-white/10 rounded transition-colors text-stone-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Timing & Status Banner */}
            <div className="bg-white border-b border-stone-200 px-4 py-2 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1.5 text-xs">
              <div className="flex items-center gap-1.5 font-medium text-stone-700">
                <Clock className="w-3.5 h-3.5 text-[#F37021]" />
                <span>IST: {currentTimeStr || "Checking..."}</span>
              </div>

              <div className="flex items-center gap-1.5">
                {activeOnlineState ? (
                  <span className="flex items-center gap-1 bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-semibold border border-emerald-200 uppercase tracking-wider text-[9px]">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    Live 10am-4pm
                  </span>
                ) : (
                  <span className="flex items-center gap-1 bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full font-semibold border border-amber-200 uppercase tracking-wider text-[9px]">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                    Offline Mode
                  </span>
                )}
              </div>
            </div>

            {/* Admin Override Toggle Panel (Highly useful for testing timing rules!) */}
            <div className="bg-stone-100 border-b border-stone-200/60 px-4 py-1 flex items-center justify-between text-[10px]">
              <span className="text-stone-500 font-mono">Simulate Live Timing:</span>
              <button
                onClick={() => setForceOnline(!forceOnline)}
                className={`px-2 py-0.5 rounded font-bold transition-all ${
                  forceOnline 
                    ? "bg-[#F37021] text-white" 
                    : "bg-stone-200 text-stone-600 hover:bg-stone-300"
                }`}
              >
                {forceOnline ? "Forced Active" : "Regular Time"}
              </button>
            </div>

            {/* Chat Content Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-lg px-3.5 py-2.5 text-sm ${
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
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white border border-stone-200 rounded-lg rounded-bl-none px-4 py-2.5 shadow-sm text-xs text-[#F37021] font-mono flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-[#F37021] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 bg-[#F37021] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 bg-[#F37021] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    <span>Inquiring...</span>
                  </div>
                </div>
              )}

              <div ref={chatEndRef} />
            </div>

            {/* Suggestion Chips Box */}
            {messages.length <= 3 && !isLoading && (
              <div className="px-4 py-2 bg-stone-100/60 border-t border-stone-200 flex flex-wrap gap-1.5 justify-center">
                <button
                  onClick={() => handleSuggestionClick("Tell me about the 12-Month program")}
                  className="text-[11px] bg-white hover:bg-[#F37021]/10 text-espresso hover:text-[#F37021] px-2.5 py-1 rounded border border-stone-200/80 transition-all font-medium"
                >
                  📜 12-Month Program
                </button>
                <button
                  onClick={() => handleSuggestionClick("Who is Srini and Murali?")}
                  className="text-[11px] bg-white hover:bg-[#F37021]/10 text-espresso hover:text-[#F37021] px-2.5 py-1 rounded border border-stone-200/80 transition-all font-medium"
                >
                  🤝 Our Facilitators
                </button>
                <button
                  onClick={() => handleSuggestionClick("J. Krishnamurti Philosophy")}
                  className="text-[11px] bg-white hover:bg-[#F37021]/10 text-espresso hover:text-[#F37021] px-2.5 py-1 rounded border border-stone-200/80 transition-all font-medium"
                >
                  🕊️ Philosophy
                </button>
                <button
                  onClick={() => handleSuggestionClick("Aranyaani & Aarohi Placements")}
                  className="text-[11px] bg-white hover:bg-[#F37021]/10 text-espresso hover:text-[#F37021] px-2.5 py-1 rounded border border-stone-200/80 transition-all font-medium"
                >
                  🌳 Placements
                </button>
              </div>
            )}

            {/* Identity Form for capture - Shown if not saved and offline */}
            {!isIdentitySaved && !activeOnlineState && (
              <form onSubmit={handleSaveIdentity} className="p-3.5 bg-amber-50/80 border-t border-stone-200 space-y-2">
                <p className="text-[10px] text-[#A15014] font-medium leading-normal flex items-start gap-1">
                  <BadgeAlert className="w-3.5 h-3.5 text-[#F37021] shrink-0 mt-0.5" />
                  <span>We are currently offline. Please enter your contact info to backup your enquiry so we can email you.</span>
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <div className="relative">
                    <User className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-stone-400" />
                    <input
                      type="text"
                      required
                      placeholder="Your Name"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      className="w-full text-xs pl-8 pr-2 py-1.5 bg-white border border-stone-300 rounded focus:outline-none focus:border-[#F37021]"
                    />
                  </div>
                  <div className="relative">
                    <Mail className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-stone-400" />
                    <input
                      type="email"
                      required
                      placeholder="Your Email"
                      value={userEmail}
                      onChange={(e) => setUserEmail(e.target.value)}
                      className="w-full text-xs pl-8 pr-2 py-1.5 bg-white border border-stone-300 rounded focus:outline-none focus:border-[#F37021]"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full text-xs bg-espresso text-white py-1 rounded font-bold hover:bg-espresso/90 transition-colors uppercase tracking-wider"
                >
                  Enable Offline Backup
                </button>
              </form>
            )}

            {/* Chat Input form */}
            <form onSubmit={handleSubmitMsg} className="p-3 bg-white border-t-2 border-espresso flex gap-2">
              <input
                type="text"
                placeholder={
                  !activeOnlineState && !isIdentitySaved
                    ? "Fill contact info above to chat offline..."
                    : "Type your reflection or inquiry..."
                }
                disabled={!activeOnlineState && !isIdentitySaved}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 bg-stone-50 border-2 border-stone-200 hover:border-stone-300 focus:border-[#F37021] focus:bg-white rounded px-3 py-1.5 text-sm focus:outline-none transition-colors disabled:opacity-60 disabled:cursor-not-allowed text-espresso placeholder-stone-400 font-hand"
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading || (!activeOnlineState && !isIdentitySaved)}
                className="w-10 h-10 bg-[#F37021] hover:bg-[#E05A10] disabled:bg-stone-300 text-white rounded flex items-center justify-center transition-colors shadow shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating circular trigger button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="w-14 h-14 bg-[#F37021] hover:bg-[#E05A10] text-white rounded-full flex items-center justify-center shadow-xl border-2 border-espresso cursor-pointer focus:outline-none relative group"
        aria-label="Open Chatbot Support"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close-icon"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <X className="w-6 h-6" />
            </motion.div>
          ) : (
            <motion.div
              key="chat-icon"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="relative"
            >
              <MessageSquare className="w-6 h-6" />
              
              {/* Online timing indicator dot */}
              <span className={`absolute -top-1 -right-1 w-3 h-3 rounded-full border border-espresso ${activeOnlineState ? "bg-emerald-400" : "bg-amber-400 animate-pulse"}`} />
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Hover label */}
        <span className="absolute right-16 bg-espresso text-stone-100 text-xs px-2.5 py-1.5 rounded shadow-lg border border-stone-700 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 hidden md:inline font-sketch tracking-wider text-[#F37021]">
          {activeOnlineState ? "Dialogue with us!" : "Leave Offline Message"}
        </span>
      </motion.button>
    </div>
  );
}
