export type DocumentStatus = "Uploading" | "Processing" | "Indexed" | "Failed";

export interface PlantDocument {
  id: string;
  name: string;
  size: number;
  mimeType: string;
  status: DocumentStatus;
  progress?: number;
  uploadedAt: string;
  errorMessage?: string;
}

export interface Asset {
  id: string;
  name: string;
  type: string;
  location?: string;
  documentCount: number;
  status?: "operational" | "warning" | "critical" | "unknown";
  tags?: string[];
}

export interface AssetDetails extends Asset {
  description?: string;
  relatedDocuments: Array<{ id: string; name: string; type: string }>;
  relatedChunks: Array<{
    id: string;
    documentId: string;
    documentName: string;
    page?: number;
    text: string;
  }>;
}

export interface Citation {
  id: string;
  documentId: string;
  documentName: string;
  page?: number;
  snippet: string;
  confidence?: number;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
  citations?: Citation[];
  confidence?: number;
  relatedAssetIds?: string[];
  streaming?: boolean;
}

export interface DashboardMetrics {
  documentsIndexed: number;
  aiQueriesRun: number;
  assetsDetected: number;
}

/** Defined for backend contract compatibility — not rendered in this prototype phase. */
export interface GraphNode {
  id: string;
  label: string;
  type: "Asset" | "Document" | "Incident" | "Maintenance" | "Technician" | "SOP";
}
export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
}
export interface Report {
  id: string;
  title: string;
  createdAt: string;
  assetId?: string;
  status: "ready" | "generating" | "failed";
}
export interface Incident {
  id: string;
  title: string;
  date: string;
  severity: "low" | "medium" | "high";
}