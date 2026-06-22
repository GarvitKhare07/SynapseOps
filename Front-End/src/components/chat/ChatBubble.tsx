import { motion } from "framer-motion";
import { Sparkles, User } from "lucide-react";
import type { ChatMessage } from "@/types";
import { cn } from "@/lib/utils";

function renderMarkdown(text: string) {
  // tiny safe-ish markdown: bold, lists, line breaks
  const lines = text.split("\n");
  return lines.map((line, i) => {
    if (line.startsWith("- ")) {
      return (
        <li key={i} className="ml-5 list-disc marker:text-primary">
          {boldify(line.slice(2))}
        </li>
      );
    }
    if (!line.trim()) return <div key={i} className="h-2" />;
    return (
      <p key={i} className="leading-relaxed">
        {boldify(line)}
      </p>
    );
  });
}
function boldify(s: string) {
  const parts = s.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((p, i) =>
    p.startsWith("**") && p.endsWith("**") ? (
      <strong key={i} className="font-semibold text-foreground">
        {p.slice(2, -2)}
      </strong>
    ) : (
      <span key={i}>{p}</span>
    ),
  );
}

export function ChatBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user";
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={cn("flex gap-3", isUser && "flex-row-reverse")}
    >
      <div
        className={cn(
          "shrink-0 grid place-items-center w-8 h-8 rounded-lg ring-1",
          isUser
            ? "bg-secondary text-foreground ring-border"
            : "bg-primary/15 text-primary ring-primary/30",
        )}
      >
        {isUser ? <User className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
      </div>
      <div
        className={cn(
          "max-w-2xl rounded-2xl px-4 py-3 text-sm",
          isUser
            ? "bg-primary text-primary-foreground rounded-tr-sm"
            : "bg-card border border-border rounded-tl-sm",
        )}
      >
        <div className="space-y-1">{renderMarkdown(message.content)}</div>
        {!isUser && message.confidence != null && (
          <div className="mt-3 pt-3 border-t border-border flex items-center gap-3 text-[11px] text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-success" />
              Confidence {(message.confidence * 100).toFixed(0)}%
            </span>
            {message.citations && (
              <span>· {message.citations.length} sources</span>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}

export function TypingBubble() {
  return (
    <div className="flex gap-3">
      <div className="shrink-0 grid place-items-center w-8 h-8 rounded-lg bg-primary/15 text-primary ring-1 ring-primary/30">
        <Sparkles className="w-4 h-4" />
      </div>
      <div className="bg-card border border-border rounded-2xl rounded-tl-sm px-4 py-3.5">
        <div className="flex items-center gap-1">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-muted-foreground"
              animate={{ opacity: [0.3, 1, 0.3], y: [0, -2, 0] }}
              transition={{ duration: 1, repeat: Infinity, delay: i * 0.15 }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}