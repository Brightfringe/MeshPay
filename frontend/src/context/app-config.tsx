import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { type ApiConfig, createApi, DEFAULT_CONFIG, loadConfig, saveConfig, type Api } from "@/lib/api";

interface AppConfigCtx {
  config: ApiConfig;
  api: Api;
  setConfig: (next: Partial<ApiConfig>) => void;
  theme: "dark" | "light";
  toggleTheme: () => void;
  activeVpa: string | null;
  setActiveVpa: (vpa: string) => void;
}

const Ctx = createContext<AppConfigCtx | null>(null);

const THEME_KEY = "meshpay.theme.v1";
const VPA_KEY = "meshpay.active-vpa.v1";

export function AppConfigProvider({ children }: { children: React.ReactNode }) {
  const [config, setConfigState] = useState<ApiConfig>(DEFAULT_CONFIG);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [activeVpa, setActiveVpaState] = useState<string | null>(null);

  // Hydrate from localStorage on client
  useEffect(() => {
    setConfigState(loadConfig());
    const t = (typeof window !== "undefined" && window.localStorage.getItem(THEME_KEY)) as
      | "dark"
      | "light"
      | null;
    if (t === "light") setTheme("light");
    const v = typeof window !== "undefined" && window.localStorage.getItem(VPA_KEY);
    if (v) setActiveVpaState(v);
  }, []);

  // Apply theme class
  useEffect(() => {
    if (typeof document === "undefined") return;
    const html = document.documentElement;
    html.classList.toggle("light", theme === "light");
    html.classList.toggle("dark", theme === "dark");
    window.localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  const api = useMemo(() => createApi(config), [config]);

  const value: AppConfigCtx = {
    config,
    api,
    setConfig: (next) => {
      const merged = { ...config, ...next };
      setConfigState(merged);
      saveConfig(merged);
    },
    theme,
    toggleTheme: () => setTheme((t) => (t === "dark" ? "light" : "dark")),
    activeVpa,
    setActiveVpa: (vpa) => {
      setActiveVpaState(vpa);
      if (typeof window !== "undefined") window.localStorage.setItem(VPA_KEY, vpa);
    },
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAppConfig() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAppConfig must be used within AppConfigProvider");
  return ctx;
}
