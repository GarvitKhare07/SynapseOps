import { useRef, useState, type DragEvent } from "react";
import { motion } from "framer-motion";
import { UploadCloud } from "lucide-react";
import { cn } from "@/lib/utils";

const ACCEPT = ".pdf,.docx,.txt,.csv,.xlsx";

export function FileUploader({ onFiles }: { onFiles: (files: File[]) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [over, setOver] = useState(false);

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setOver(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length) onFiles(files);
  }

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setOver(true);
      }}
      onDragLeave={() => setOver(false)}
      onDrop={handleDrop}
      className={cn(
        "relative rounded-2xl border-2 border-dashed transition-all p-10 md:p-14 text-center",
        over
          ? "border-primary bg-primary/5"
          : "border-border bg-card/40 hover:border-primary/40",
      )}
    >
      <motion.div
        animate={{ y: over ? -4 : 0 }}
        className="mx-auto grid place-items-center w-14 h-14 rounded-2xl bg-primary/12 text-primary ring-1 ring-primary/25"
      >
        <UploadCloud className="w-6 h-6" />
      </motion.div>
      <h3 className="mt-5 text-base font-semibold">Drop files to ingest</h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Drag plant documents here, or click below to browse.
      </p>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="mt-5 inline-flex items-center gap-2 h-10 px-5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition shadow-soft"
      >
        Browse files
      </button>
      <p className="mt-4 text-[11px] uppercase tracking-wider text-muted-foreground">
        Supported: PDF · DOCX · TXT · CSV · XLSX
      </p>
      <input
        ref={inputRef}
        type="file"
        multiple
        accept={ACCEPT}
        className="hidden"
        onChange={(e) => {
          const files = Array.from(e.target.files ?? []);
          if (files.length) onFiles(files);
          e.target.value = "";
        }}
      />
    </div>
  );
}