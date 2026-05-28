import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAppConfig } from "@/context/app-config";
import type { DemoSendRequest } from "@/lib/types";

export function useAccounts() {
  const { api, config } = useAppConfig();
  return useQuery({
    queryKey: ["accounts", config.baseUrl],
    queryFn: () => api.getAccounts(),
    staleTime: 10_000,
    refetchInterval: 8_000,
    retry: 1,
  });
}

export function useTransactions() {
  const { api, config } = useAppConfig();
  return useQuery({
    queryKey: ["transactions", config.baseUrl],
    queryFn: () => api.getTransactions(),
    staleTime: 5_000,
    refetchInterval: 6_000,
    retry: 1,
  });
}

export function useMeshState() {
  const { api, config } = useAppConfig();
  return useQuery({
    queryKey: ["mesh", config.baseUrl],
    queryFn: () => api.getMeshState(),
    refetchInterval: 4_000,
    staleTime: 2_000,
    retry: 1,
  });
}

export function useServerKey() {
  const { api, config } = useAppConfig();
  return useQuery({
    queryKey: ["server-key", config.baseUrl],
    queryFn: () => api.getServerKey(),
    staleTime: 60_000,
    retry: 1,
  });
}

export function useGossip() {
  const { api } = useAppConfig();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => api.gossip(),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["mesh"] });
    },
  });
}

export function useFlush() {
  const { api } = useAppConfig();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => api.flush(),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["mesh"] });
      qc.invalidateQueries({ queryKey: ["transactions"] });
      qc.invalidateQueries({ queryKey: ["accounts"] });
    },
  });
}

export function useReset() {
  const { api } = useAppConfig();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => api.reset(),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["mesh"] }),
  });
}

export function useSendPayment() {
  const { api } = useAppConfig();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (req: DemoSendRequest) => api.demoSend(req),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["mesh"] });
      qc.invalidateQueries({ queryKey: ["transactions"] });
      qc.invalidateQueries({ queryKey: ["accounts"] });
    },
  });
}
