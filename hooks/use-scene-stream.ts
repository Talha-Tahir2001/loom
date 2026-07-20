
"use client";

import { useCallback, useRef, useState } from "react";
import type { AgentName, AgentStatus } from "@/lib/types";

type AgentEventMap = Partial<Record<AgentName, { status: AgentStatus; summary?: string }>>;

interface FinalEvent {
    type: "final";
    sceneId: string;
    status: "complete" | "flagged";
    continuityFlags: Array<{ id: string; description: string; flagType: string }>;
    totalTokens?: number;
}

interface UseSceneStreamResult {
    content: string;
    agentEvents: AgentEventMap;
    final: FinalEvent | null;
    isStreaming: boolean;
    error: string | null;
    start: (episodeId: string, choice?: string) => Promise<void>;
    reset: () => void;
}

export function useSceneStream(): UseSceneStreamResult {
    const [content, setContent] = useState("");
    const [agentEvents, setAgentEvents] = useState<AgentEventMap>({});
    const [final, setFinal] = useState<FinalEvent | null>(null);
    const [isStreaming, setIsStreaming] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const lineBufferRef = useRef("");
    // Synchronous guard against double-fire (e.g. a fast double-click before
    // React re-renders the button's disabled state).
    const isStreamingRef = useRef(false);

    const start = useCallback(async (episodeId: string, choice?: string) => {
        if (isStreamingRef.current) return;
        isStreamingRef.current = true;

        setContent("");
        setAgentEvents({});
        setFinal(null);
        setError(null);
        setIsStreaming(true);
        lineBufferRef.current = "";

        try {
            const res = await fetch(`/api/episodes/${episodeId}/generate`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ choice: choice ?? null }),
            });
            if (!res.body) throw new Error("No response stream from server");

            const reader = res.body.getReader();
            const decoder = new TextDecoder();

            for (; ;) {
                const { done, value } = await reader.read();
                if (done) break;

                lineBufferRef.current += decoder.decode(value, { stream: true });
                const lines = lineBufferRef.current.split("\n");
                // Last entry may be a partial line still arriving — keep it buffered.
                lineBufferRef.current = lines.pop() ?? "";

                for (const line of lines) {
                    if (!line.trim()) continue;

                    let event: Record<string, unknown>;
                    try {
                        event = JSON.parse(line);
                    } catch {
                        continue; // skip a malformed line rather than aborting the stream
                    }

                    switch (event.type) {
                        case "prose":
                            setContent((prev) => prev + String(event.text ?? ""));
                            break;
                        case "status":
                            setAgentEvents((prev) => ({
                                ...prev,
                                [event.agent as AgentName]: {
                                    status: event.status as AgentStatus,
                                    summary: event.summary as string | undefined,
                                },
                            }));
                            break;
                        case "final":
                            setFinal(event as unknown as FinalEvent);
                            break;
                        case "error":
                            setError(String(event.message ?? "Generation failed"));
                            break;
                    }
                }
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "Streaming failed");
        } finally {
            setIsStreaming(false);
            isStreamingRef.current = false;
        }
    }, []);

    const reset = useCallback(() => {
        setContent("");
        setAgentEvents({});
        setFinal(null);
        setError(null);
    }, []);

    return { content, agentEvents, final, isStreaming, error, start, reset };
}