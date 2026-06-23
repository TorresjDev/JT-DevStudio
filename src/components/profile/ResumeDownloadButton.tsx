"use client";

import { useState } from "react";
import { FileText, Download, Loader2, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useAuth } from "@/context/AuthContext";

export function ResumeDownloadButton() {
  const { user, loading, hasMounted } = useAuth();
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isLoggedIn = hasMounted && !loading && !!user;

  const handleDownload = async () => {
    if (!isLoggedIn) return;
    setDownloading(true);
    setError(null);

    try {
      const res = await fetch("/api/resume/download");
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Download failed");
      }
      const { url } = await res.json();

      // Trigger download without navigating away
      const a = document.createElement("a");
      a.href = url;
      a.download = "Resume_JesusTorres.pdf";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setDownloading(false);
    }
  };

  // While auth is loading, show a neutral disabled state
  if (!hasMounted || loading) {
    return (
      <Button
        disabled
        size="sm"
        className="bg-[#DAA520] hover:bg-[#DAA520]/80 text-black font-bold h-10 px-4 rounded-xl opacity-60"
      >
        <FileText className="w-4 h-4 mr-2" />
        Resume
      </Button>
    );
  }

  // Logged out — disabled button with tooltip
  if (!isLoggedIn) {
    return (
      <TooltipProvider delayDuration={200}>
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="inline-block cursor-not-allowed">
              <Button
                disabled
                size="sm"
                className="bg-[#DAA520]/40 text-black/60 font-bold h-10 px-4 rounded-xl pointer-events-none"
              >
                <Lock className="w-4 h-4 mr-2" />
                Resume
              </Button>
            </span>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="text-xs">
            Sign in to download resume
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  // Logged in — active download button
  return (
    <div className="flex flex-col items-start gap-1">
      <Button
        onClick={handleDownload}
        disabled={downloading}
        size="sm"
        className="bg-[#DAA520] hover:bg-[#DAA520]/80 text-black font-bold h-10 px-4 rounded-xl"
      >
        {downloading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Downloading...
          </>
        ) : (
          <>
            <Download className="w-4 h-4 mr-2" />
            Resume
          </>
        )}
      </Button>
      {error && (
        <p className="text-xs text-red-500">{error}</p>
      )}
    </div>
  );
}
