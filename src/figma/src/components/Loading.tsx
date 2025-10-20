import { Loader2 } from "lucide-react";

export function Loading() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="text-center space-y-6">
        <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto" />
        <div className="space-y-2">
          <p className="text-xl" style={{ fontWeight: 600 }}>
            Building your plan…
          </p>
          <p className="text-muted-foreground">
            Analyzing your financial situation
          </p>
        </div>
      </div>
    </div>
  );
}
