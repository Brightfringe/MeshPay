import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Outlet, Link, createRootRouteWithContext, useRouter } from "@tanstack/react-router";
import { Toaster } from "@/components/ui/sonner";
import { AppConfigProvider } from "@/context/app-config";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="glass max-w-md rounded-2xl p-10 text-center shadow-card">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
          404 - packet lost in the mesh
        </p>
        <h1 className="mt-4 font-display text-3xl font-semibold">Off the network</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          This route never reached a bridge node.
        </p>
        <Link to="/" className="mt-6 inline-flex items-center justify-center rounded-full bg-gradient-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-glow">
          Back to landing
        </Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="glass max-w-md rounded-2xl p-10 text-center shadow-card">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-destructive">
          Settlement failed
        </p>
        <h1 className="mt-4 font-display text-2xl font-semibold">This page did not load</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Something went wrong. Try again or head home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button onClick={() => { router.invalidate(); reset(); }} className="inline-flex items-center justify-center rounded-full bg-gradient-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-glow">
            Try again
          </button>
          <a href="/" className="inline-flex items-center justify-center rounded-full border border-border bg-card/40 px-5 py-2.5 text-sm font-medium hover:bg-card/70">
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <AppConfigProvider>
        <Outlet />
        <Toaster
          theme="dark"
          position="top-right"
          toastOptions={{ classNames: { toast: "glass !border-border !text-foreground" } }}
        />
      </AppConfigProvider>
    </QueryClientProvider>
  );
}