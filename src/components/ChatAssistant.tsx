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
    href: string;
  };
}

const initialMessages: Message[] = [
  {
    id: "welcome",
    sender: "ai",
    text: "Hi! I'm the **ReLaunch AI Assistant**. How can I help you scale your business today?",
    time: "Just now",
  },
];

const quickPrompts = [
  "What services do you provide?",
  "How does pricing work?",
  "Book a strategy session",
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

  const generateAnswer = (query: string): { text: string; action?: { label: string; href: string } } => {
    const q = query.toLowerCase();

    if (q.includes("service") || q.includes("offer") || q.includes("provide") || q.includes("what do you do") || q.includes("capabilities")) {
      return {
        text: "ReLaunch provides 4 core disciplines:\n\n• **Brand Strategy & Visual Identity**: Market positioning, logos, typography, and design systems.\n• **Web Architecture & Custom Software**: High-speed Next.js platforms, client portals, and SaaS tools.\n• **AI Engineering & Automation**: 24/7 intake agents, autonomous workflows, and CRM synchronization.\n• **Performance Media & Search**: High-ROI Google/Meta advertising and local map-pack dominance.",
        action: { label: "Explore All Services", href: "#services" },
      };
    }

    if (q.includes("cost") || q.includes("price") || q.includes("pricing") || q.includes("rate") || q.includes("fee") || q.includes("how much")) {
      return {
        text: "Our pricing is modular and transparent with zero bloated agency retainers:\n\n• **Starter Services**: Starting from $297/mo\n• **Growth & Performance Retainers**: $790 – $1,200/mo\n• **Custom Software & AI Sprints**: Tailored to scope\n\nBundling multiple disciplines qualifies for 10% to 20% discounts with no long-term lock-in.",
        action: { label: "View Pricing Details", href: "#pricing" },
      };
    }

    if (q.includes("book") || q.includes("call") || q.includes("strategy") || q.includes("contact") || q.includes("phone") || q.includes("email") || q.includes("talk") || q.includes("session")) {
      return {
        text: "We'd love to partner with you! You can book a complimentary 15-minute strategy consultation directly:\n\n📞 **Phone**: (480) 779-9875\n✉️ **Email**: care@relaunch.us\n📍 **Studio**: Phoenix, Arizona (Operating since 2004)",
        action: { label: "Book Strategy Session", href: "#contact" },
      };
    }

    if (q.includes("software") || q.includes("custom") || q.includes("portal") || q.includes("app")) {
      return {
        text: "Yes! We engineer bespoke web apps, secure client dashboards, and custom database integrations using modern Next.js, React, and TypeScript architecture.",
        action: { label: "Browse Case Studies", href: "#work" },
      };
    }

    return {
      text: "Thanks for reaching out! ReLaunch is a Phoenix-based digital evolution studio (Est. 2004) specializing in high-speed web architecture, AI systems, and performance marketing. How can we help your business lead?",
      action: { label: "Book a Strategy Session", href: "#contact" },
    };
  };

  const handleSend = (textToSend?: string) => {
    const text = (textToSend || inputValue).trim();
    if (!text) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      sender: "user",
      text,
      time: "Just now",
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    setTimeout(() => {
      const response = generateAnswer(text);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: "ai",
        text: response.text,
        time: "Just now",
        action: response.action,
      };

      setMessages((prev) => [...prev, aiMessage]);
      setIsTyping(false);
    }, 600);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSend();
    }
  };

  const resetChat = () => {
    setMessages(initialMessages);
  };

  return (
    <>
      {/* Floating Toggle Launcher Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            key="chat-launcher-btn"
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            style={{
              willChange: "transform, opacity",
              transform: "translateZ(0)",
              marginBottom: "max(0px, env(safe-area-inset-bottom, 0px))",
              marginRight: "max(0px, env(safe-area-inset-right, 0px))",
            }}
            className="fixed bottom-10 right-6 sm:bottom-12 sm:right-8 z-50"
          >
            <button
              onClick={() => setIsOpen(true)}
              aria-label="Open ReLaunch AI Assistant"
              className="group relative flex items-center gap-2 sm:gap-2.5 px-4 py-2.5 sm:px-5 sm:py-3 bg-white hover:bg-orange-50/80 text-slate-900 rounded-full shadow-xl hover:shadow-[0_4px_20px_rgba(255,103,0,0.2)] border border-slate-200/90 hover:border-orange-300 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
            >
              {/* Clean Status Dot */}
              <span className="relative flex h-2 sm:h-2.5 w-2 sm:w-2.5 ml-0.5">
                <span className="relative inline-flex rounded-full h-2 sm:h-2.5 w-2 sm:w-2.5 bg-[#FF6700]" />
              </span>

              <Bot className="w-4 h-4 sm:w-5 sm:h-5 text-[#FF6700] ml-0.5" />
              <span className="font-heading font-black text-[11px] sm:text-xs uppercase tracking-wider pr-0.5 sm:pr-1 ml-0.5 text-slate-900">
                ReLaunch AI
              </span>

              {hasUnread && (
                <span className="absolute -top-1 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-[#FF6700] text-[9px] font-black text-white shadow-xs">
                  1
                </span>
              )}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Expanded Chat Assistant Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="chat-assistant-window"
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            style={{
              willChange: "transform, opacity",
              transform: "translateZ(0)",
              marginBottom: "max(0px, env(safe-area-inset-bottom, 0px))",
              marginRight: "max(0px, env(safe-area-inset-right, 0px))",
            }}
            className="fixed bottom-10 right-4 sm:bottom-12 sm:right-8 z-50 w-[calc(100vw-2rem)] sm:w-[400px] h-[560px] max-h-[82vh] bg-white text-slate-900 rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden mr-1 sm:mr-0"
            data-lenis-prevent="true"
            onWheel={(e) => e.stopPropagation()}
            onTouchMove={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#FF6700] flex items-center justify-center shadow-xs">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-heading font-black text-sm text-slate-900">
                    ReLaunch Assistant
                  </h3>
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-orange-50 text-[#FF6700] border border-orange-200/80">
                    AI Active
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Phoenix, AZ · Instant Answers
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={resetChat}
                title="Reset conversation"
                className="p-2 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-200/60 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <button
                onClick={() => setIsOpen(false)}
                title="Close chat"
                className="p-2 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-200/60 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Feed */}
          <div
            data-lenis-prevent="true"
            onWheel={(e) => e.stopPropagation()}
            onTouchMove={(e) => e.stopPropagation()}
            className="flex-1 p-4 overflow-y-auto space-y-3.5 text-xs overscroll-contain touch-pan-y bg-white"
          >
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {msg.sender === "ai" && (
                  <div className="w-7 h-7 rounded-lg bg-[#FF6700] text-white flex items-center justify-center shrink-0 mt-0.5">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                )}

                <div
                  className={`max-w-[82%] p-3.5 rounded-2xl ${
                    msg.sender === "user"
                      ? "bg-[#FF6700] text-white font-medium rounded-tr-none"
                      : "bg-slate-50 border border-slate-200/80 text-slate-800 rounded-tl-none shadow-xs"
                  }`}
                >
                  <div className="whitespace-pre-line leading-relaxed">
                    {msg.text}
                  </div>

                  {msg.action && (
                    <button
                      type="button"
                      onClick={() => {
                        setIsOpen(false);
                        if (msg.action?.href === "#contact") {
                          openContactModal({ intent: "strategy-session" });
                        } else if (msg.action?.href === "#ai-audit") {
                          openContactModal({ intent: "ai-audit" });
                        } else if (msg.action?.href === "#start-project") {
                          openContactModal({ intent: "start-project" });
                        } else if (msg.action?.href.startsWith("#")) {
                          const id = msg.action.href.replace("#", "");
                          const el = document.getElementById(id);
                          if (el) {
                            el.scrollIntoView({ behavior: "smooth" });
                          }
                        }
                      }}
                      className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-[#FF6700] text-slate-800 hover:text-white font-heading font-bold text-[11px] uppercase tracking-wider transition-colors border border-slate-200 hover:border-[#FF6700] text-center shadow-xs cursor-pointer"
                    >
                      <span>{msg.action.label}</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </button>
                  )}
                </div>

                {msg.sender === "user" && (
                  <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center shrink-0 mt-0.5">
                    <User className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-2.5 justify-start">
                <div className="w-7 h-7 rounded-lg bg-[#FF6700] text-white flex items-center justify-center shrink-0 mt-0.5">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-400 rounded-tl-none flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF6700] animate-bounce" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF6700] animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF6700] animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts Carousel */}
          <div className="px-3 py-2 bg-slate-50 border-t border-slate-100 overflow-x-auto flex gap-1.5 scrollbar-none">
            {quickPrompts.map((prompt) => (
              <button
                key={prompt}
                onClick={() => handleSend(prompt)}
                className="px-2.5 py-1 rounded-lg bg-white hover:bg-[#FF6700] text-slate-700 hover:text-white border border-slate-200 hover:border-[#FF6700] text-[10px] font-semibold whitespace-nowrap transition-colors cursor-pointer shrink-0 shadow-xs"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input Bar */}
          <div className="p-3 bg-slate-50 border-t border-slate-100">
            <div className="relative flex items-center">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about bundles, pricing, services..."
                className="w-full py-2.5 pl-3.5 pr-11 bg-white text-slate-900 placeholder-slate-400 rounded-xl text-xs border border-slate-200 focus:outline-none focus:border-[#FF6700] transition-colors"
              />
              <button
                onClick={() => handleSend()}
                disabled={!inputValue.trim()}
                className={`absolute right-1.5 p-1.5 rounded-lg transition-all ${
                  inputValue.trim()
                    ? "bg-[#FF6700] text-white hover:bg-[#E55C00] cursor-pointer"
                    : "text-slate-300 cursor-not-allowed"
                }`}
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </>
  );
}
