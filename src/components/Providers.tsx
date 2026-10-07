"use client";

import React from "react";
import { ContactModalProvider } from "@/context/ContactModalContext";
import SmoothScrollProvider from "@/components/SmoothScrollProvider";
import ContactModal from "@/components/ContactModal";
import ChatAssistant from "@/components/ChatAssistant";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ContactModalProvider>
      <SmoothScrollProvider>
        {children}
        <ChatAssistant />
        <ContactModal />
      </SmoothScrollProvider>
    </ContactModalProvider>
  );
}
