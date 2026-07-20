// lib/qwen.ts
import { ChatOpenAI } from "@langchain/openai";

// Qwen Cloud exposes an OpenAI-compatible endpoint, so ChatOpenAI works
// unmodified — just point it at Qwen's base URL and use a Qwen API key
// instead of an OpenAI one.
export function createQwenModel(options?: { temperature?: number; model?: string }) {
    return new ChatOpenAI({
        model: options?.model ?? process.env.QWEN_MODEL ?? "qwen-max",
        apiKey: process.env.QWEN_API_KEY,
        temperature: options?.temperature ?? 0.8,
        configuration: {
            baseURL: "https://dashscope-intl.aliyuncs.com/compatible-mode/v1",
        },
    });
}