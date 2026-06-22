import type {
  Asset,
  AssetDetails,
  ChatMessage,
  DashboardMetrics,
  PlantDocument,
} from "@/types";

export const mockDocuments: PlantDocument[] = [
  {
    id: "doc-1",
    name: "P-201_Maintenance_Manual.pdf",
    size: 2_457_600,
    mimeType: "application/pdf",
    status: "Indexed",
    uploadedAt: "2025-06-18T09:14:00Z",
  },
  {
    id: "doc-2",
    name: "Boiler_B-12_Incident_Report.docx",
    size: 845_120,
    mimeType:
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    status: "Indexed",
    uploadedAt: "2025-06-19T13:22:00Z",
  },
  {
    id: "doc-3",
    name: "Safety_SOP_v4.pdf",
    size: 1_204_800,
    mimeType: "application/pdf",
    status: "Processing",
    progress: 62,
    uploadedAt: "2025-06-22T08:01:00Z",
  },
  {
    id: "doc-4",
    name: "Compressor_C-07_Logs.csv",
    size: 92_340,
    mimeType: "text/csv",
    status: "Failed",
    uploadedAt: "2025-06-21T17:48:00Z",
    errorMessage: "Could not parse CSV header",
  },
];

export const mockAssets: Asset[] = [
  {
    id: "asset-p201",
    name: "Centrifugal Pump P-201",
    type: "Pump",
    location: "Unit 4 — North",
    documentCount: 12,
    status: "warning",
    tags: ["rotating", "critical-path"],
  },
  {
    id: "asset-b12",
    name: "Steam Boiler B-12",
    type: "Boiler",
    location: "Utility Block",
    documentCount: 9,
    status: "operational",
    tags: ["pressure-vessel"],
  },
  {
    id: "asset-c07",
    name: "Air Compressor C-07",
    type: "Compressor",
    location: "Unit 2",
    documentCount: 6,
    status: "critical",
    tags: ["rotating"],
  },
  {
    id: "asset-v34",
    name: "Pressure Vessel V-34",
    type: "Vessel",
    location: "Unit 1",
    documentCount: 4,
    status: "operational",
  },
  {
    id: "asset-hx9",
    name: "Heat Exchanger HX-9",
    type: "Heat Exchanger",
    location: "Unit 3",
    documentCount: 7,
    status: "operational",
  },
  {
    id: "asset-t21",
    name: "Storage Tank T-21",
    type: "Tank",
    location: "Tank Farm",
    documentCount: 3,
    status: "operational",
  },
];

export const mockAssetDetails: Record<string, AssetDetails> = Object.fromEntries(
  mockAssets.map((a) => [
    a.id,
    {
      ...a,
      description: `${a.type} located at ${a.location ?? "—"}. All knowledge below is derived from indexed plant documents.`,
      relatedDocuments: mockDocuments
        .filter((d) => d.status === "Indexed")
        .slice(0, 3)
        .map((d) => ({ id: d.id, name: d.name, type: d.mimeType })),
      relatedChunks: [
        {
          id: `${a.id}-c1`,
          documentId: "doc-1",
          documentName: "P-201_Maintenance_Manual.pdf",
          page: 14,
          text: `Recommended inspection interval for ${a.name} is 90 days under nominal load. Vibration thresholds must remain below 4.5 mm/s RMS.`,
        },
        {
          id: `${a.id}-c2`,
          documentId: "doc-2",
          documentName: "Boiler_B-12_Incident_Report.docx",
          page: 3,
          text: `Cross-reference: prior failure event on ${a.name} was traced to bearing wear and inadequate lubrication scheduling.`,
        },
      ],
    },
  ]),
);

export const mockDashboard: DashboardMetrics = {
  documentsIndexed: 128,
  aiQueriesRun: 412,
  assetsDetected: 47,
};

export function mockAssistantReply(prompt: string): ChatMessage {
  return {
    id: `m-${Date.now()}`,
    role: "assistant",
    createdAt: new Date().toISOString(),
    content: `Based on the indexed plant knowledge base, here is what I found regarding **${prompt.slice(0, 80)}**:\n\n- The most recent inspection on Pump P-201 noted elevated vibration on the drive-end bearing.\n- Maintenance log entries from the past 90 days reference two unscheduled stops.\n- Recommended next step: schedule a bearing replacement and review the lubrication SOP.\n\nThis answer was synthesized from 3 source documents.`,
    confidence: 0.86,
    relatedAssetIds: ["asset-p201"],
    citations: [
      {
        id: "cit-1",
        documentId: "doc-1",
        documentName: "P-201_Maintenance_Manual.pdf",
        page: 14,
        snippet:
          "Vibration thresholds must remain below 4.5 mm/s RMS. Exceeding this threshold requires immediate bearing inspection.",
        confidence: 0.92,
      },
      {
        id: "cit-2",
        documentId: "doc-2",
        documentName: "Boiler_B-12_Incident_Report.docx",
        page: 3,
        snippet:
          "Prior failure event traced to bearing wear and inadequate lubrication scheduling on adjacent rotating equipment.",
        confidence: 0.81,
      },
      {
        id: "cit-3",
        documentId: "doc-1",
        documentName: "P-201_Maintenance_Manual.pdf",
        page: 22,
        snippet:
          "Recommended inspection interval is 90 days under nominal load. Reduce to 45 days when vibration trends upward.",
        confidence: 0.78,
      },
    ],
  };
}