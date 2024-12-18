import { useEffect, useState } from "react";
import {
  useMaybeRoomContext,
  useVoiceAssistant,
} from "@livekit/components-react";
import {
  Participant,
  RoomEvent,
  TrackPublication,
  TranscriptionSegment,
} from "livekit-client";

export function useTranscriber() {
  const { state } = useVoiceAssistant();
  const room = useMaybeRoomContext();
  const [transcriptions, setTranscriptions] = useState<{
    [id: string]: TranscriptionSegment;
  }>({});

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
