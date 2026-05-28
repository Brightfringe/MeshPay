// Mirrors backend DTOs from perryvegehan/UPI_Without_Internet (Spring Boot)

export interface Account {
  vpa: string;
  holderName: string;
  balance: number;
  version: number;
}

export type TransactionStatus = "SETTLED" | "REJECTED";

export interface Transaction {
  id: number;
  packetHash: string;
  senderVpa: string;
  receiverVpa: string;
  amount: number;
  signedAt: string;
  settledAt: string;
  bridgeNodeId: string;
  hopCount: number;
  status: TransactionStatus;
  reason?: string | null;
}

export interface VirtualDevice {
  deviceId: string;
  hasInternet: boolean;
  packetCount: number;
  packetIds: string[];
}

export interface MeshState {
  devices: VirtualDevice[];
  idempotencyCacheSize: number;
}

export interface GossipResult {
  transfers: Array<{ from: string; to: string; packetId: string }>;
  deviceCounts: Record<string, number>;
}

export interface FlushResultItem {
  bridgeNode: string;
  packetId: string;
  outcome: "SETTLED" | "DUPLICATE" | "REJECTED" | string;
  reason: string;
  transactionId: number;
}

export interface FlushResult {
  uploadsAttempted: number;
  results: FlushResultItem[];
}

export interface ServerKeyInfo {
  publicKey: string;
  algorithm: string;
  hybridScheme: string;
}

export interface DemoSendRequest {
  senderVpa: string;
  receiverVpa: string;
  amount: number;
  pin: string;
  ttl?: number;
  startDevice?: string;
}

export interface DemoSendResponse {
  packetId: string;
  ciphertextPreview: string;
  ttl: number;
  injectedAt: string;
}
