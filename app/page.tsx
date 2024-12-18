"use client";

import Image from "next/image";

import { RoomComponent } from "@/components/room";
import { ConnectionProvider } from "@/hooks/use-connection";

export default function Home() {
  return (
    <ConnectionProvider>
      <div className="grid grid-rows-[64px_1fr_20px] min-h-screen p-8 pb-20 gap-16 sm:p-20">
        <header className="flex items-center justify-between">
          <a href="https://console.groq.io" target="_blank">
            <Image width={122.667} height={64} src="/images/groq-logomark.svg" alt="Groq logo" className="h-16" />
          </a>
          <a href="https://docs.livekit.io/agents" target="_blank">
            Built with <Image width={104.667} height={24} src="/images/livekit-logomark.svg" alt="LiveKit logo" className="h-6" />
          </a>
        </header>
        <RoomComponent />
        <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        </footer>
      </div>
    </ConnectionProvider>
  );
}

