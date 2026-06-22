import { createFileRoute } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ArrowUp, Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { ChatBubble, TypingBubble } from "@/components/chat/ChatBubble";
import { CitationPanel } from "@/components/chat/CitationPanel";
import { sendChat } from "@/services/chat";
import type { ChatMessage, Citation } from "@/types";

export const Route = createFileRoute("/chat")({
  head: () => ({
    meta: [
      { title: "AI Assistant — PlantMind AI" },
      {
        name: "description",
        content:
          "Ask PlantMind AI questions about your plant operations and get source-cited answers grounded in your indexed documents.",
      },
      { property: "og:title", content: "AI Assistant — PlantMind AI" },
      {
        property: "og:description",
        content: "Cited, source-grounded answers from your plant knowledge base.",
      },
    ],
  }),
  component: ChatPage,
});

const SUGGESTIONS = [
  "What caused Pump P-201 failure?",
  "Show maintenance history for Boiler B-12",
  "Find the safety SOP for confined-space entry",
  "Generate an RCA for Compressor C-07",
];

function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [activeCitations, setActiveCitations] = useState<Citation[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  const ask = useMutation({
    mutationFn: sendChat,
    onSuccess: (reply) => {
      setMessages((prev) => [...prev, reply]);
      if (reply.citations) setActiveCitations(reply.citations);
    },
  });

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, ask.isPending]);

  function submit(text: string) {
    const t = text.trim();
    if (!t || ask.isPending) return;
    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: "user",
      content: t,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    ask.mutate(t);
  }

  return (
    <AppShell
      title="AI Assistant"
      subtitle="Ask your plant knowledge base — answers are grounded in indexed documents"
    >
      <div className="h-[calc(100vh-4rem)] grid grid-cols-1 lg:grid-cols-[1fr_360px] xl:grid-cols-[1fr_420px]">
        {/* Conversation column */}
        <div className="flex flex-col min-h-0 border-r border-border">
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto scrollbar-thin px-6 py-8"
          >
            <div className="max-w-3xl mx-auto space-y-6">
              {messages.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="py-10 text-center"
                >
                  <div className="mx-auto grid place-items-center w-14 h-14 rounded-2xl bg-primary/12 text-primary ring-1 ring-primary/25">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <h2 className="mt-5 text-xl font-semibold tracking-tight">
                    What do you need to know?
                  </h2>
                  <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto">
                    Every answer cites the source passage from your indexed plant
                    documents. Start with a prompt below or write your own.
                  </p>
                  <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-w-2xl mx-auto">
                    {SUGGESTIONS.map((s, i) => (
                      <motion.button
                        key={s}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 + i * 0.05 }}
                        type="button"
                        onClick={() => submit(s)}
                        className="text-left px-4 py-3 rounded-xl border border-border bg-card/60 hover:border-primary/40 hover:bg-card transition text-sm"
                      >
                        {s}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}

              {messages.map((m) => (
                <ChatBubble key={m.id} message={m} />
              ))}
              {ask.isPending && <TypingBubble />}
            </div>
          </div>

          {/* Composer */}
          <div className="border-t border-border bg-background/70 backdrop-blur-xl px-6 py-4">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                submit(input);
              }}
              className="max-w-3xl mx-auto"
            >
              <div className="relative rounded-2xl border border-border bg-card focus-within:border-primary/50 transition">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      submit(input);
                    }
                  }}
                  rows={1}
                  placeholder="Ask PlantMind anything about your plant…"
                  className="w-full resize-none bg-transparent px-4 py-3.5 pr-14 text-sm placeholder:text-muted-foreground focus:outline-none max-h-40"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || ask.isPending}
                  className="absolute right-2 bottom-2 grid place-items-center w-9 h-9 rounded-lg bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition"
                  aria-label="Send"
                >
                  <ArrowUp className="w-4 h-4" />
                </button>
              </div>
              <p className="mt-2 text-[11px] text-muted-foreground text-center">
                Answers are generated from your indexed documents and may require
                expert review.
              </p>
            </form>
          </div>
        </div>

        {/* Citations column */}
        <aside className="hidden lg:block bg-surface/40 min-h-0">
          <CitationPanel citations={activeCitations} />
        </aside>
      </div>
    </AppShell>
  );
}