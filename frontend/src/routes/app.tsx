import { createFileRoute, Outlet } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";

export const Route = createFileRoute("/app")({
  head: () => ({
    meta: [
      { title: "Console · MeshPay" },
      { name: "description", content: "Operator console for the MeshPay offline UPI mesh." },
    ],
  }),
  component: AppLayout,
});

function AppLayout() {
  return (
    <AppShell>
      <Outlet />
    </AppShell>
  );
}
