"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useTranscriber } from "@/hooks/use-transcriber";

export interface TypewriterProps {
	typingSpeed?: number;
}

export function Typewriter({ typingSpeed = 50 }: TypewriterProps) {
	const [isTyping, setIsTyping] = useState<boolean>(false);
	const { state, transcriptions } = useTranscriber();
	const [displayedText, setDisplayedText] = useState<string>("");
	const [currentIndex, setCurrentIndex] = useState<number>(0);

	const text = Object.values(transcriptions).map((t) => t.text).join("\n");

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

	return (
		<p className="text-lg font-mono">
			<motion.span
				style={{ whiteSpace: "pre" }}
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ duration: 0.2 }}
			>
				{displayedText}
			</motion.span>
			<AnimatePresence>
				{state !== "disconnected" && (
					<motion.span
						key={isTyping ? "animate" : "static"}
						animate={!isTyping && { opacity: [1, 0, 1] }}
						transition={{ duration: 0.5, delay: 0.2, repeat: Infinity }}
						className="relative top-1 inline-block w-[1ch] h-[2ch] bg-white"
					/>
				)}
			</AnimatePresence>
		</p>
	);
};

