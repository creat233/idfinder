import React from "react";

interface Props {
  text: string;
  isCurrentUser?: boolean;
}

// Detect URLs, emails and phone numbers to make them tappable inside messages.
const PATTERN =
  /(https?:\/\/[^\s<>"']+|www\.[^\s<>"']+|[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}|\+?\d[\d\s().-]{7,}\d)/gi;

export const LinkifiedText: React.FC<Props> = ({ text, isCurrentUser }) => {
  const parts = text.split(PATTERN);
  const linkClass = `underline underline-offset-2 font-medium ${
    isCurrentUser ? "text-white/90 hover:text-white" : "text-blue-600 hover:text-blue-700"
  }`;

  return (
    <p className="text-[15px] leading-[1.4] break-words whitespace-pre-wrap">
      {parts.map((part, i) => {
        if (!part) return null;
        const isUrl = /^(https?:\/\/|www\.)/i.test(part);
        const isEmail = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(part);
        const isPhone = /^\+?\d[\d\s().-]{7,}\d$/.test(part);

        if (isUrl) {
          const href = part.startsWith("http") ? part : `https://${part}`;
          return (
            <a key={i} href={href} target="_blank" rel="noopener noreferrer" className={linkClass}>
              {part}
            </a>
          );
        }
        if (isEmail) {
          return (
            <a key={i} href={`mailto:${part}`} className={linkClass}>
              {part}
            </a>
          );
        }
        if (isPhone) {
          return (
            <a key={i} href={`tel:${part.replace(/[^\d+]/g, "")}`} className={linkClass}>
              {part}
            </a>
          );
        }
        return <React.Fragment key={i}>{part}</React.Fragment>;
      })}
    </p>
  );
};
