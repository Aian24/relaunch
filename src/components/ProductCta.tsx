"use client";

import React from "react";
import { ArrowUpRight } from "lucide-react";
import { useContactModal } from "@/context/ContactModalContext";
import type { ProductLink } from "@/data/productLinks";

/**
 * Main call-to-action for a product page.
 * Links to the product's own site when it is live; otherwise opens the strategy-call form.
 */
export default function ProductCta({
  link,
  className = "",
  style,
}: {
  link: ProductLink;
  className?: string;
  style?: React.CSSProperties;
}) {
  const { openContactModal } = useContactModal();

  if (link.liveUrl) {
    return (
      <a href={link.liveUrl} target="_blank" rel="noopener" className={className} style={style}>
        <span>{link.liveLabel}</span>
        <ArrowUpRight className="w-4 h-4" />
      </a>
    );
  }

  return (
    <button
      type="button"
      onClick={() => openContactModal({ intent: "strategy-session", serviceInterest: link.formTopic })}
      className={`${className} cursor-pointer`}
      style={style}
    >
      <span>{link.pendingLabel}</span>
      <ArrowUpRight className="w-4 h-4" />
    </button>
  );
}
