"use client";

import { useEffect, useMemo } from "react";
import {
  useConnectionState,
  useLocalParticipant,
  useTracks,
} from "@livekit/components-react";
import { AnimatePresence, motion } from "framer-motion";
import { ConnectionState, LocalParticipant, Track } from "livekit-client";

import { Button, LoadingSVG } from "@/components/ui/button";
import { MicrophoneButton } from "@/components/microphone-button";
import { useMultibandTrackVolume } from "@/hooks/use-track-volume";
import { Typewriter } from "./typewriter";

export interface PlaygroundProps {
  onConnect: (connect: boolean) => void;
}

export function Playground({ onConnect }: PlaygroundProps) {
  const { localParticipant } = useLocalParticipant();

  const roomState = useConnectionState();
  const tracks = useTracks();

  useEffect(() => {
    if (roomState === ConnectionState.Connected) {
      localParticipant.setMicrophoneEnabled(true);
    }
  }, [localParticipant, roomState]);

  const localTracks = tracks.filter(
    ({ participant }) => participant instanceof LocalParticipant,
  );

  const localMicTrack = localTracks.find(
    ({ source }) => source === Track.Source.Microphone,
  );

  const localMultibandVolume = useMultibandTrackVolume(
    localMicTrack?.publication.track,
    9,
  );

  const audioTileContent = useMemo(() => {
    const isLoading = roomState === ConnectionState.Connecting;
    const isActive = roomState !== ConnectionState.Disconnected;

    const conversationToolbar = (
      <div
        className="fixed z-50 md:absolute left-1/2 bottom-4 md:bottom-auto md:top-1/2 -translate-y-1/2 -translate-x-1/2"
        style={{
          filter: "drop-shadow(0 8px 10px rgba(0, 0, 0, 0.1))",
        }}
      >
        <motion.div
          className="flex gap-3"
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 25 }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 20,
          }}
        >
          <MicrophoneButton
            localMultibandVolume={localMultibandVolume}
            isSpaceBarEnabled={true}
          />
          <Button
            state="destructive"
            className="flex items-center justify-center px-3 rounded-[4px]"
            size="medium"
            onClick={() =>
              onConnect(roomState === ConnectionState.Disconnected)
            }
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
            >
              <path
                d="M3.33325 3.3335L12.6666 12.6668M12.6666 3.3335L3.33325 12.6668"
                stroke="#FF887A"
                strokeWidth="2"
                strokeLinecap="square"
              />
            </svg>
          </Button>
        </motion.div>
      </div>
    );

    const startConversationButton = (
      <div className="fixed bottom-2 md:bottom-auto md:absolute left-1/2 md:top-1/2 -translate-y-1/2 -translate-x-1/2 w-11/12 md:w-auto text-center">
        <motion.div
          className="flex gap-3"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 20,
          }}
        >
          <Button
            state="primary"
            size="large"
            className={`relative w-full text-base text-black ${isLoading ? "pointer-events-none" : ""
              }`}
            onClick={() =>
              onConnect(roomState === ConnectionState.Disconnected)
            }
          >
            <div
              className={`w-full ${isLoading ? "opacity-0" : "opacity-100"}`}
            >
              Begin transcription
            </div>
            <div
              className={`absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 ${isLoading ? "opacity-100" : "opacity-0"
                }`}
            >
              <LoadingSVG diameter={24} strokeWidth={4} />
            </div>
          </Button>
        </motion.div>
      </div>
    );

    const visualizerContent = (
      <div className="flex flex-col items-center justify-space-between h-full w-full pb-12">
        <div className="h-full flex items-center"></div>
        <div className="min-h-20 w-full relative">
          <AnimatePresence>
            {!isActive ? startConversationButton : null}
          </AnimatePresence>
          <AnimatePresence>
            {isActive ? conversationToolbar : null}
          </AnimatePresence>
        </div>
      </div>
    );

    return visualizerContent;
  }, [localMultibandVolume, roomState, onConnect]);

  return (
    <>
      <div className="flex grow w-full">
        <div className="flex-col grow basis-1/2 gap-4 h-full md:flex">
          <Typewriter typingSpeed={25} />
          {audioTileContent}
        </div>
      </div>
    </>
  );
}
