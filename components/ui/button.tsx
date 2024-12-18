import React, { ButtonHTMLAttributes, ReactNode } from "react";

export type ButtonProps = {
  children: ReactNode;
  className?: string;
  disabled?: boolean;
  state?: "primary" | "secondary" | "dropdown" | "destructive";
  size?: "small" | "medium" | "large";
} & ButtonHTMLAttributes<HTMLButtonElement>;

export function Button({
  children,
  className,
  disabled,
  state = "primary",
  size = "small",
  ...allProps
}: ButtonProps) {
  let buttonStyles;
  switch (state) {
    case "secondary":
      buttonStyles =
        "bg-transparent text-groq-control-text hover:text-groq-accent-text-active";
      break;

    case "dropdown":
      buttonStyles =
        "bg-white rounded-sm text-groq-accent-text hover:text-groq-accent-text-active";
      break;

    case "destructive":
      buttonStyles = "bg-[#FFF] text-groq-action-text";
      break;

    default:
      buttonStyles =
        "bg-groq-button-bg hover:bg-groq-button-bg/90 text-groq-button-text hover:border-groq-action-text rounded-[6px] border-[1px]";
      break;
  }

  let sizeStyles;
  switch (size) {
    case "large":
      sizeStyles = "text-[16px] px-6 py-2 font-regular";
      break;

    case "medium":
      sizeStyles = "text-sm px-2 py-2";
      break;

    default: //small
      sizeStyles = "text-xs px-2 py-[6px]";
      break;
  }

  return (
    <button
      className={`active:translate-y-[2px] active:scale-[0.99] hover:-translate-y-[2px] flex flex-row ${
        disabled ? "pointer-events-none" : ""
      } ${size} ${buttonStyles} ${sizeStyles} transition-all ease-out duration-250 ${className}`}
      {...allProps}
    >
      {children}
    </button>
  );
}

export function LoadingSVG({
  diameter = 20,
  strokeWidth = 4,
}: {
  diameter?: number;
  strokeWidth?: number;
}) {
  return (
    <svg
      className="animate-spin"
      fill="none"
      viewBox="0 0 24 24"
      style={{
        width: `${diameter}px`,
        height: `${diameter}px`,
      }}
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth={strokeWidth}
      ></circle>
      <path
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  );
}
