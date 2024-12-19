"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useTranscriber } from "@/hooks/use-transcriber";

export interface TypewriterProps {
  typingSpeed?: number;
}

const emptyText =
  "Voice transcription will appear after you connect and start talking";

export function Typewriter({ typingSpeed = 50 }: TypewriterProps) {
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const { state, transcriptions } = useTranscriber();
  const [displayedText, setDisplayedText] = useState<string>("");
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const text = Object.values(transcriptions)
    .toSorted((a, b) => a.firstReceivedTime - b.firstReceivedTime)
    .map((t) => t.text)
    .join("\n");

  useEffect(() => {
    if (currentIndex < text.length) {
      if (!isTyping) {
        setIsTyping(true);
      }
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + text[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
      }, typingSpeed);
      return () => clearTimeout(timeout);
    } else {
      setIsTyping(false);
    }
  }, [currentIndex, text, typingSpeed, isTyping]);

  const emptyTextIntro = useMemo(() => {
    return emptyText.split("").map((word, index) => {
      return (
        <motion.span
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          transition={{
            duration: 0.2,
            delay: index * 0.015,
          }}
          key={index}
        >
          {word}
        </motion.span>
      );
    });
  }, []);

  return (
    <div className="h-full text-lg font-mono pl-4 relative">
      <div className="pointer-events-none h-1/4 absolute top-0 left-0 w-full bg-gradient-to-b from-groq-accent-bg to-transparent"></div>
      {state === "disconnected" && (
        <div className="text-white/40 h-full items-center pb-16 max-w-md flex">
          <p>{emptyTextIntro}</p>
        </div>
      )}
      {state !== "disconnected" && (
        <div className="h-1/2 overflow-hidden max-w-md flex items-end">
          <p>
            <motion.span
              className="mr-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
              {displayedText}
            </motion.span>
            <AnimatePresence>
              <motion.span
                key={isTyping ? "animate" : "static"}
                animate={!isTyping && { opacity: [1, 0, 1] }}
                transition={{ duration: 0.5, delay: 0.2, repeat: Infinity }}
                className="relative inline-block w-3 h-3 rounded-full bg-white"
              />
            </AnimatePresence>
          </p>
        </div>
      )}
    </div>
  );
}
