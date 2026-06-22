import type { PlantDocument } from "@/types";
import { MOCK_MODE, apiFetch, delay } from "./api";
import { mockDocuments } from "./mock-data";

let memoryDocs: PlantDocument[] = [...mockDocuments];

export async function listDocuments(): Promise<PlantDocument[]> {
  if (MOCK_MODE) {
    await delay(400);
    return [...memoryDocs];
  }
  return apiFetch<PlantDocument[]>("/documents");
}

export async function uploadDocument(file: File): Promise<PlantDocument> {
  if (MOCK_MODE) {
    const doc: PlantDocument = {
      id: `doc-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      name: file.name,
      size: file.size,
      mimeType: file.type || "application/octet-stream",
      status: "Uploading",
      progress: 0,
      uploadedAt: new Date().toISOString(),
    };
    memoryDocs = [doc, ...memoryDocs];
    // Simulate backend lifecycle
    void simulateLifecycle(doc.id);
    return doc;
  }
  const fd = new FormData();
  fd.append("file", file);
  const res = await fetch(`/upload`, { method: "POST", body: fd });
  if (!res.ok) throw new Error("Upload failed");
  return (await res.json()) as PlantDocument;
}

export async function removeDocument(id: string): Promise<void> {
  if (MOCK_MODE) {
    memoryDocs = memoryDocs.filter((d) => d.id !== id);
    return;
  }
  await apiFetch(`/documents/${id}`, { method: "DELETE" });
}

async function simulateLifecycle(id: string) {
  // Uploading → Processing → Indexed
  for (let p = 10; p <= 100; p += 20) {
    await delay(350);
    memoryDocs = memoryDocs.map((d) =>
      d.id === id ? { ...d, status: "Uploading", progress: p } : d,
    );
  }
  await delay(400);
  memoryDocs = memoryDocs.map((d) =>
    d.id === id ? { ...d, status: "Processing", progress: 30 } : d,
  );
  for (let p = 40; p <= 100; p += 20) {
    await delay(450);
    memoryDocs = memoryDocs.map((d) =>
      d.id === id ? { ...d, status: "Processing", progress: p } : d,
    );
  }
  await delay(500);
  memoryDocs = memoryDocs.map((d) =>
    d.id === id ? { ...d, status: "Indexed", progress: 100 } : d,
  );
}