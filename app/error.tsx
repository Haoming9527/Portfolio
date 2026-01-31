"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="h-[80vh] w-full flex flex-col items-center justify-center gap-6 text-center px-4">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
          Something went wrong!
        </h2>
        <p className="text-gray-500 dark:text-gray-400 max-w-[500px]">
          We apologize for the inconvenience. An unexpected error has occurred.
        </p>
      </div>
      
      <div className="flex items-center gap-4">
        <Button
          onClick={() => reset()}
          className="flex items-center gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          Try again
        </Button>
      </div>

      {process.env.NODE_ENV === "development" && (
        <div className="mt-8 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg max-w-2xl text-left overflow-auto text-sm font-mono">
           <p className="font-bold mb-2">Error Digest: {error.digest}</p>
           <p>{error.message}</p>
        </div>
      )}
    </div>
  );
}
