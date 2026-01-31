import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="h-[80vh] w-full flex flex-col items-center justify-center gap-4 text-center px-4">
      <div className="relative">
        <h1 className="text-9xl font-bold text-gray-200 dark:text-gray-800">404</h1>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-semibold text-gray-900 dark:text-white">Page Not Found</span>
        </div>
      </div>
      <p className="text-muted-foreground max-w-lg mb-4">
        Oops! The page you are looking for seems to have wandered off into the digital void.
      </p>
      <div className="flex gap-4">
        <Button asChild variant="default">
          <Link href="/">Back to Home</Link>
        </Button>
      </div>
    </div>
  );
}
