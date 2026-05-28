import axios, { type AxiosInstance } from "axios";
import type {
  Account,
  DemoSendRequest,
  DemoSendResponse,
  FlushResult,
  GossipResult,
  MeshState,
  ServerKeyInfo,
  Transaction,
} from "./types";

const STORAGE_KEY = "meshpay.api.config.v2";

export interface ApiConfig {
  baseUrl: string;
}

export const DEFAULT_CONFIG: ApiConfig = {
  baseUrl:
    (typeof import.meta !== "undefined" &&
      (import.meta as { env?: Record<string, string> }).env?.VITE_API_BASE_URL) ||
    "http://localhost:8080",
};

export function loadConfig(): ApiConfig {
  if (typeof window === "undefined") return DEFAULT_CONFIG;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_CONFIG;
    return { ...DEFAULT_CONFIG, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_CONFIG;
  }
}

export function saveConfig(cfg: ApiConfig) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cfg));
}

function makeClient(baseUrl: string): AxiosInstance {
  return axios.create({
    baseURL: baseUrl.replace(/\/$/, ""),
    timeout: 10000,
    headers: { "Content-Type": "application/json" },
  });
}

function unwrapError(err: unknown): Error {
  if (axios.isAxiosError(err)) {
    const status = err.response?.status;
    const data = err.response?.data as { message?: string; error?: string } | string | undefined;
    const msg =
      (typeof data === "string" && data) ||
      (data && typeof data === "object" && (data.message || data.error)) ||
      err.message;
    return new Error(status ? `${status} · ${msg}` : msg);
  }
  return err instanceof Error ? err : new Error(String(err));
}

export function createApi(cfg: ApiConfig) {
  const client = makeClient(cfg.baseUrl);

  async function call<T>(fn: () => Promise<{ data: T }>): Promise<T> {
    try {
      const { data } = await fn();
      return data;
    } catch (err) {
      throw unwrapError(err);
    }
  }

  return {
    config: cfg,
    getAccounts: (): Promise<Account[]> => call(() => client.get("/api/accounts")),
    getTransactions: (): Promise<Transaction[]> => call(() => client.get("/api/transactions")),
    getServerKey: (): Promise<ServerKeyInfo> => call(() => client.get("/api/server-key")),
    getMeshState: (): Promise<MeshState> => call(() => client.get("/api/mesh/state")),
    gossip: (): Promise<GossipResult> => call(() => client.post("/api/mesh/gossip")),
    flush: (): Promise<FlushResult> => call(() => client.post("/api/mesh/flush")),
    reset: (): Promise<{ status: string }> => call(() => client.post("/api/mesh/reset")),
    demoSend: (req: DemoSendRequest): Promise<DemoSendResponse> =>
      call(() => client.post("/api/demo/send", req)),
  };
}

export type Api = ReturnType<typeof createApi>;
