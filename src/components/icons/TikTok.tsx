
import React from "react";

export const TikTok = ({
  className,
  ...props
}: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <path d="M9 12a4 4 0 1 0 0 8 4 4 0 0 0 0-8z" />
      <path d="M16 8v8" />
      <path d="M12 16v-8" />
      <path d="M20 8h-4" />
      <path d="M8 8v4" />
      <path d="M8 12h4" />
      <path d="M16 12h0" />
    </svg>
  );
};
