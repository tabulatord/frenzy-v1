"use client";

import { FormEvent, useEffect, useRef, useState } from "react";

type Message = { role: "user" | "assistant"; content: string };

const LANGUAGES = [
  { code: undefined, label: "Auto" },
  { code: "English", label: "EN" },
  { code: "French", label: "FR" },
  { code: "Spanish", label: "ES" },
] as const;

const GREETING: Message = {
  role: "assistant",
  content:
    "Hi! I'm here to help with questions about FPWC pre-registration — the Road to Paris 2027. What would you like to know?",
};

export default function AssistantWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([GREETING]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [language, setLanguage] = useState<string | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, sending]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || sending) return;

    const nextMessages: Message[] = [...messages, { role: "user", content: text }];
    setMessages(nextMessages);
    setInput("");
    setSending(true);
    setError(null);

    try {
      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: nextMessages.slice(-12),
          language_override: language,
        }),
      });

      if (!res.ok) throw new Error("request failed");
      const body = await res.json();
      setMessages((prev) => [...prev, { role: "assistant", content: body.reply }]);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSending(false);
    }
  }

  return (
    <>
      {open && (
        <div className="fixed bottom-24 right-4 z-40 flex h-[70vh] max-h-[560px] w-[calc(100vw-2rem)] max-w-sm flex-col overflow-hidden rounded-2xl border-2 border-black bg-white shadow-2xl sm:bottom-24 sm:right-6">
          <div className="flex items-center justify-between border-b border-black/10 px-4 py-3">
            <div>
              <p className="text-sm font-black tracking-tight">FPWC Assistant</p>
              <p className="text-xs text-black/50">Questions about pre-registration</p>
            </div>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close chat"
              className="rounded-full p-1 text-black/50 hover:bg-black/5 hover:text-black"
            >
              ✕
            </button>
          </div>

          <div className="flex items-center gap-1.5 border-b border-black/10 px-4 py-2">
            {LANGUAGES.map((l) => (
              <button
                key={l.label}
                onClick={() => setLanguage(l.code)}
                className={`rounded-full px-2.5 py-1 text-xs font-bold transition ${
                  language === l.code
                    ? "bg-black text-accent"
                    : "bg-black/5 text-black/60 hover:bg-black/10"
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>

          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${
                  m.role === "user"
                    ? "ml-auto bg-black text-white"
                    : "mr-auto bg-black/[0.04] text-black"
                }`}
              >
                {m.content}
              </div>
            ))}
            {sending && (
              <div className="mr-auto max-w-[85%] rounded-2xl bg-black/[0.04] px-3 py-2 text-sm text-black/40">
                Typing…
              </div>
            )}
            {error && <p className="text-xs font-semibold text-red-600">{error}</p>}
          </div>

          <form onSubmit={handleSubmit} className="flex gap-2 border-t border-black/10 p-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question…"
              className="flex-1 rounded-full border border-black/15 px-3.5 py-2 text-sm outline-none focus:border-black"
              maxLength={2000}
            />
            <button
              type="submit"
              disabled={sending || !input.trim()}
              className="rounded-full bg-black px-4 py-2 text-sm font-bold text-accent disabled:opacity-40"
            >
              Send
            </button>
          </form>
        </div>
      )}

      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close assistant" : "Open assistant"}
        className="fixed bottom-20 right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-black text-2xl text-accent shadow-lg transition hover:-translate-y-0.5 sm:bottom-6 sm:right-6"
      >
        {open ? "✕" : "💬"}
      </button>
    </>
  );
}
