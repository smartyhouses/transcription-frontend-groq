"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import {
  LiveKitRoom,
  useVoiceAssistant,
  RoomAudioRenderer,
  useMaybeRoomContext,
} from "@livekit/components-react";
import { MediaDeviceFailure, Participant, RoomEvent, TrackPublication, TranscriptionSegment } from "livekit-client";
import type { ConnectionDetails } from "./api/token/route";

export default function Home() {
  const [connectionDetails, updateConnectionDetails] = useState<ConnectionDetails | null>(null);

  const onConnectButtonClicked = useCallback(async () => {
    const url = new URL("/api/token", window.location.origin);
    const response = await fetch(url);
    const connectionDetailsData = await response.json();
    updateConnectionDetails(connectionDetailsData);
  }, []);

  return (
    <div className="grid grid-rows-[20px_1fr_20px] min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <header className="flex items-center justify-between">
        <Image width={122.667} height={64} src="/images/groq-logomark.svg" alt="Groq logo" className="h-16" />
        <p>
          Built with <Image width={104.667} height={24} src="/images/livekit-logomark.svg" alt="LiveKit logo" className="h-6" />
        </p>
      </header>
      <main className="flex flex-col gap-8 row-start-2 items-stretch">
        <LiveKitRoom
          token={connectionDetails?.participantToken}
          serverUrl={connectionDetails?.serverUrl}
          connect={connectionDetails !== undefined}
          audio={true}
          video={false}
          onMediaDeviceFailure={onDeviceFailure}
          onDisconnected={() => updateConnectionDetails(null)}
          className="grow"
        >
          <RoomAudioRenderer />
          <Typewriter typingSpeed={40} onConnectButtonClicked={onConnectButtonClicked} />
        </LiveKitRoom>
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
      </footer>
    </div>
  );
}

function useTranscriber() {
  const { state } = useVoiceAssistant();
  const room = useMaybeRoomContext();
  const [transcriptions, setTranscriptions] = useState<{ [id: string]: TranscriptionSegment }>({});

  useEffect(() => {
    if (!room) {
      return;
    }

    const updateTranscriptions = (
      segments: TranscriptionSegment[],
      participant?: Participant,
      publication?: TrackPublication,
    ) => {
      void participant;
      void publication;

      setTranscriptions((prev) => {
        const newTranscriptions = { ...prev };
        for (const segment of segments) {
          newTranscriptions[segment.id] = segment;
        }
        return newTranscriptions;
      });
    };

    room.on(RoomEvent.TranscriptionReceived, updateTranscriptions);
    return () => {
      room.off(RoomEvent.TranscriptionReceived, updateTranscriptions);
    };
  }, [room]);

  return { state, transcriptions };
}

interface TypewriterProps {
  typingSpeed?: number;
  onConnectButtonClicked: () => void;
}

function Typewriter({ onConnectButtonClicked, typingSpeed = 50 }: TypewriterProps) {
  const { state, transcriptions } = useTranscriber();
  const [displayedText, setDisplayedText] = useState<string>("");
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const text = Object.values(transcriptions).map((t) => t.text).join("\n");

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + text[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
      }, typingSpeed);
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, text, typingSpeed]);

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
        {state === "disconnected" && (
          <motion.button
            initial={{ scale: 1, x: 0 }}
            whileTap={{ scale: 0.95 }}
            exit={{ width: 0, height: "2ch" }}
            transition={{ duration: 0.2 }}
            className={`absolute text-clip whitespace-nowrap uppercase font-mono font-bold px-4 py-2 bg-white text-[var(--background)] rounded-none`}
            onClick={() => onConnectButtonClicked()}
          >
            Begin transcription
          </motion.button>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {state !== "disconnected" && (
          <motion.span
            animate={{ opacity: [1, 0, 1] }}
            transition={{ duration: 0.8, repeat: Infinity }}
          >
            {"█"}
          </motion.span>
        )}
      </AnimatePresence>
    </p>
  );
};


function onDeviceFailure(error?: MediaDeviceFailure) {
  console.error(error);
  alert(
    "Error acquiring camera or microphone permissions. Please make sure you grant the necessary permissions in your browser and reload the tab"
  );
}

