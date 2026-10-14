"use client";

import { useState, useRef, useEffect } from "react";
import { useContactModal } from "@/context/ContactModalContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  Bot,
  RotateCcw,
  ArrowUpRight,
  User,
  Zap,
} from "lucide-react";

interface Message {
  id: string;
  sender: "ai" | "user";
  text: string;
  time: string;
  action?: {
    label: string;
    href?: string;
    isModal?: boolean;
    serviceInterest?: string;
  };
}

const initialMessages: Message[] = [
  {
    id: "welcome",
    sender: "ai",
    text: "Hi! I'm the **ReLaunch Assistant**. We help small businesses get found, get chosen, and get more customers. How can I help you today?",
    time: "Just now",
  },
];

const quickPrompts = [
  "What do you do?",
  "How does pricing work?",
  "Tell me about ReLaunch Studio",
  "Book a strategy call",
];

export default function ChatAssistant() {
  const { openContactModal } = useContactModal();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setHasUnread(false);
    }
  }, [isOpen, messages, isTyping]);

  const generateAnswer = (query: string): { text: string; action?: { label: string; href?: string; isModal?: boolean; serviceInterest?: string } } => {
    const q = query.toLowerCase();

    if (q.includes("service") || q.includes("offer") || q.includes("provide") || q.includes("what do you do") || q.includes("how we help")) {
      return {
        text: "ReLaunch collapses marketing bloat into **four outcome groups**:\n\n1. **Get Found**: Show up on Google, Maps, and in ChatGPT recommendations.\n2. **Get Chosen**: Turn visitors into calls with websites and done-for-you weekly social media.\n3. **Get More Customers**: Managed Google & Meta ads, weekly AI video ads, and instant lead follow-up.\n4. **Build Something Custom**: Web apps, client portals, and integrations you fully own.\n\nEverything is month-to-month, and you own 100% of the work.",
        action: { label: "Explore Services", href: "/services" },
      };
    }

    if (q.includes("studio") || q.includes("video") || q.includes("tiktok") || q.includes("meta ad")) {
      return {
        text: "**ReLaunch Studio** delivers fresh AI video ads for Meta and TikTok every single week, continuously improved from performance data. It ends ad fatigue so your customer acquisition costs stay low.",
        action: { label: "Learn About ReLaunch Studio", href: "/studio" },
      };
    }

    if (q.includes("social") || q.includes("post") || q.includes("instagram")) {
      return {
        text: "**ReLaunch Social** is done-for-you weekly social media. We create your posts, you approve them once a month in about 30 minutes, and we publish them to Instagram, Facebook, LinkedIn, TikTok and Google Business.\n\nPlans start at $297/mo (you send photos) or $597/mo (we create everything).",
        action: { label: "View ReLaunch Social Plans", href: "/social" },
      };
    }

    if (q.includes("audit") || q.includes("score") || q.includes("free score")) {
      return {
        text: "The **ReLaunch Social Audit** is our free front-door diagnostic. It scores your marketing message, customer journey, persuasion, and consistency in 2 minutes to show where sales are slipping away.",
        action: { label: "Get Your Free Score", href: "/audit" },
      };
    }

    if (q.includes("ai recommendation") || q.includes("chatgpt") || q.includes("gemini") || q.includes("claude") || q.includes("aeo") || q.includes("geo")) {
      return {
        text: "**ReLaunch AI Recommendations** gets your business named when prospective customers ask ChatGPT, Gemini, or Claude for the best business like yours in your area.",
        action: { label: "See AI Recommendations", href: "/ai-recommendations" },
      };
    }

    if (q.includes("cost") || q.includes("price") || q.includes("pricing") || q.includes("rate") || q.includes("bundle") || q.includes("how much")) {
      return {
        text: "All our core services are transparent and month-to-month with no long contracts:\n\n• **Starting Rates**: Simple modular monthly subscriptions.\n• **Multi-Service Bundle Discounts**: 2–3 services save 10% · 4–5 save 15% · 6 or more save 20%.\n• **Asset Ownership**: You own all websites, code, creative, and accounts from day one.",
        action: { label: "View Pricing & Bundle Discounts", href: "/pricing" },
      };
    }

    if (q.includes("book") || q.includes("call") || q.includes("strategy") || q.includes("contact") || q.includes("phone") || q.includes("email") || q.includes("bobby")) {
      return {
        text: "You can book a free 30-minute strategy call with Bobby Clark:\n\n📞 **Phone**: (480) 779-9875\n✉️ **Email**: care@relaunch.us\n🏢 **Home Base**: Phoenix, AZ (Serving clients across U.S., Canada, UK & Australia since 2008)",
        action: { label: "Book a Strategy Call", isModal: true },
      };
    }

    if (q.includes("software") || q.includes("custom") || q.includes("app") || q.includes("portal") || q.includes("enterprise")) {
      return {
        text: "When off-the-shelf software doesn't fit, we build custom web apps, client portals, mobile apps, and systems integrations on a fixed plan with set milestone dates. You own every line of code.",
        action: { label: "See Custom Software", href: "/custom-software" },
      };
    }

    return {
      text: "Thanks for asking! ReLaunch provides marketing strategically designed to sell. We help businesses get found, get chosen, and get paid. Would you like to review our outcome groups or book a strategy call?",
      action: { label: "Book a Strategy Call", isModal: true },
    };
  };

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const userText = inputValue;
    const userMsg: Message = {
      id: Date.now().toString(),
      sender: "user",
      text: userText,
      time: "Just now",
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setIsTyping(true);

    setTimeout(() => {
      const { text, action } = generateAnswer(userText);
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: "ai",
        text,
        time: "Just now",
        action,
      };
      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 600);
  };

  const handlePromptClick = (prompt: string) => {
    setInputValue(prompt);
  };

  return (
    <>
      {/* Floating Chat Trigger Button */}
      <div className="fixed bottom-6 right-6 z-40 select-none">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle AI assistant chat"
          className="relative p-4 rounded-full bg-[#7F48ED] hover:bg-[#6C34DE] text-white shadow-[0_8px_30px_rgba(127,72,237,0.4)] border border-white/[0.2] transition-all hover:scale-105 active:scale-95 cursor-pointer flex items-center justify-center group"
        >
          {isOpen ? (
            <X className="w-6 h-6 text-white" />
          ) : (
            <>
              <MessageSquare className="w-6 h-6 text-white group-hover:rotate-6 transition-transform" />
              {hasUnread && (
                <span className="absolute top-0 right-0 w-3.5 h-3.5 rounded-full bg-[#FF6700] border-2 border-[#7F48ED] animate-pulse" />
              )}
            </>
          )}
        </button>
      </div>

      {/* Chat Window Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-4 sm:right-6 w-[calc(100vw-2rem)] sm:w-[400px] h-[520px] max-h-[80vh] rounded-3xl bg-[#0D111A]/95 backdrop-blur-2xl border border-white/[0.15] shadow-2xl flex flex-col overflow-hidden z-50 text-white"
          >
            {/* Header */}
            <div className="p-4 bg-white/[0.04] border-b border-white/[0.08] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-orange-500/20 border border-orange-500/30 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-[#FF6700]" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-xs uppercase tracking-wider text-white">
                    ReLaunch Assistant
                  </h3>
                  <span className="text-[10px] text-[#A78BFA] font-mono flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#7F48ED]" />
                    Online · Ask anything
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.08] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Messages Scroll Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${
                    msg.sender === "user" ? "items-end" : "items-start"
                  }`}
                >
                  <div
                    className={`p-3.5 rounded-2xl max-w-[85%] leading-relaxed ${
                      msg.sender === "user"
                        ? "bg-[#FF6700] text-white rounded-br-xs"
                        : "bg-white/[0.07] border border-white/[0.08] text-slate-200 rounded-bl-xs"
                    }`}
                  >
                    <p className="whitespace-pre-line font-normal">{msg.text}</p>

                    {msg.action && (
                      <div className="mt-3 pt-2.5 border-t border-white/[0.1]">
                        {msg.action.isModal ? (
                          <button
                            type="button"
                            onClick={() => {
                              setIsOpen(false);
                              openContactModal({ intent: "strategy-session", serviceInterest: msg.action?.serviceInterest });
                            }}
                            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#FF6700] hover:underline"
                          >
                            <span>{msg.action.label}</span>
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          </button>
                        ) : (
                          <a
                            href={msg.action.href}
                            onClick={() => setIsOpen(false)}
                            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#FF6700] hover:underline"
                          >
                            <span>{msg.action.label}</span>
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono mt-1 px-1">
                    {msg.time}
                  </span>
                </div>
              ))}

              {isTyping && (
                <div className="flex items-center gap-1.5 p-3 rounded-2xl bg-white/[0.07] w-16">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" />
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce delay-150" />
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce delay-300" />
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Prompts */}
            <div className="px-3 py-2 border-t border-white/[0.06] flex items-center gap-1.5 overflow-x-auto">
              {quickPrompts.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => handlePromptClick(prompt)}
                  className="px-2.5 py-1 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08] text-[10px] text-slate-300 hover:text-white whitespace-nowrap cursor-pointer transition-colors"
                >
                  {prompt}
                </button>
              ))}
            </div>

            {/* Input Bar */}
            <div className="p-3 bg-white/[0.04] border-t border-white/[0.08] flex items-center gap-2">
              <input
                type="text"
                placeholder="Ask about services, pricing, or Bobby..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                className="flex-1 px-3.5 py-2.5 rounded-xl bg-white/[0.06] border border-white/[0.1] text-xs text-white placeholder-slate-400 focus:outline-none focus:border-[#FF6700]"
              />
              <button
                type="button"
                onClick={handleSend}
                className="p-2.5 rounded-xl bg-[#FF6700] hover:bg-[#E55C00] text-white transition-colors cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
