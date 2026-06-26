import React from "react";
import { Loader2 } from "lucide-react";

interface FullScreenLoaderProps {
  isLoading: boolean;
  message?: string;
}

export function FullScreenLoader({ isLoading, message = "Connecting to workspace..." }: FullScreenLoaderProps) {
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0B0F19]/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="flex flex-col items-center gap-4 p-6 rounded-2xl border border-white/5 bg-[#10162A]/90 shadow-2xl max-w-xs text-center">
    
        <Loader2 className="h-8 w-8 text-indigo-400 animate-spin" />
        
        {message && (
          <p className="text-sm font-medium tracking-wide text-white/80 animate-pulse">
            {message}
          </p>
        )}
      </div>
    </div>
  );
}