"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";

export type ContactIntent =
  | "strategy-session"
  | "ai-audit"
  | "start-project"
  | "bundle-inquiry"
  | "enterprise-inquiry"
  | "general-message";

interface ContactModalOptions {
  intent?: ContactIntent;
  serviceInterest?: string;
  notes?: string;
}

interface ContactModalContextType {
  isOpen: boolean;
  options: ContactModalOptions;
  openContactModal: (options?: ContactModalOptions) => void;
  closeContactModal: () => void;
}

const ContactModalContext = createContext<ContactModalContextType | undefined>(
  undefined
);

export function ContactModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<ContactModalOptions>({
    intent: "strategy-session",
    serviceInterest: "Not sure yet",
  });

  const openContactModal = useCallback((newOptions?: ContactModalOptions) => {
    if (newOptions) {
      setOptions((prev) => ({ ...prev, ...newOptions }));
    }
    setIsOpen(true);
  }, []);

  const closeContactModal = useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <ContactModalContext.Provider
      value={{ isOpen, options, openContactModal, closeContactModal }}
    >
      {children}
    </ContactModalContext.Provider>
  );
}

export function useContactModal() {
  const context = useContext(ContactModalContext);
  if (!context) {
    throw new Error(
      "useContactModal must be used within a ContactModalProvider"
    );
  }
  return context;
}
