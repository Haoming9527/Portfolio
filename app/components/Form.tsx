"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2, Mail, CheckCircle } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import {
  LoginLink,
  RegisterLink,
} from "@kinde-oss/kinde-auth-nextjs/components";
import { useAuth } from "../lib/auth";

export function Form() {
  const formRef = useRef<HTMLFormElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const isSubmittingRef = useRef(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string>("");

  const { user, isAuthenticated, isLoading } = useAuth();

  // Auto-resize textarea based on content
  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [message]);

  // Handle window resize for responsive height adjustment
  useEffect(() => {
    const handleResize = () => {
      adjustTextareaHeight();
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = async () => {
    try {
      window.location.href = "/api/auth/logout";
    } catch (error) {
      console.error("Logout error:", error);
      window.location.href = "/api/auth/logout";
    }
  };

  const handleSubmit = async () => {
    // Prevent double submission
    if (isSubmittingRef.current) {
      return;
    }

    isSubmittingRef.current = true;
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/guestbook", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      });

      if (response.ok) {
        formRef.current?.reset();
        setMessage("");
        // Instead of reloading, dispatch a custom event to refresh guestbook
        window.dispatchEvent(new CustomEvent("guestbook-updated"));
      } else if (response.status === 401) {
        window.location.href = "/api/auth/login";
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Failed to post message");
      }
    } catch (error) {
      console.error("Error posting message:", error);
      setError("Failed to post message");
    } finally {
      isSubmittingRef.current = false;
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Skeleton className="w-5 h-5 rounded" />
            <Skeleton className="w-40 h-6 rounded" />
          </CardTitle>
          <CardDescription>
            <Skeleton className="w-64 h-4 rounded" />
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 w-full md:w-auto">
            <Skeleton className="w-24 h-10 rounded-lg" />
            <Skeleton className="w-20 h-10 rounded-lg" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!isAuthenticated) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Sign the Guestbook
          </CardTitle>
          <CardDescription>
            Sign in to leave a message in the guestbook
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 w-full md:w-auto">
            <RegisterLink>
              <Button
                variant="outline"
                className="w-full md:w-auto hover:bg-gray-100 dark:hover:bg-gray-800 hover:scale-105 transition-all duration-200"
              >
                Sign up
              </Button>
            </RegisterLink>
            <LoginLink>
              <Button className="w-full md:w-auto hover:scale-105 transition-all duration-200">
                Sign in
              </Button>
            </LoginLink>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-green-600" />
          Welcome, {user?.username || "User"}!
        </CardTitle>
        <CardDescription>
          Welcome! You can now leave a message in the guestbook.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form ref={formRef} action={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="message" className="mb-1">
              Message
            </Label>
            <Textarea
              ref={textareaRef}
              id="message"
              name="message"
              placeholder="Your Message..."
              required
              className="resize-none break-words whitespace-pre-wrap overflow-wrap-anywhere min-h-[80px] overflow-hidden mt-2"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <div className="text-xs text-muted-foreground text-right">
              {message.length}/500 characters
            </div>
            {error && <div className="text-sm text-red-600">{error}</div>}
          </div>

          <div className="flex justify-end">
            <SubmitButton isSubmitting={isSubmitting} />
          </div>
        </form>

        <div className="flex justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="hover:bg-red-50 dark:hover:bg-red-950/20 hover:text-red-600 dark:hover:text-red-400 hover:border-red-300 dark:hover:border-red-700 hover:scale-105 transition-all duration-200"
          >
            Sign Out
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function SubmitButton({ isSubmitting }: { isSubmitting: boolean }) {
  return (
    <>
      {isSubmitting ? (
        <Button disabled>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Please Wait
        </Button>
      ) : (
        <Button
          type="submit"
          className="w-full md:w-auto"
          disabled={isSubmitting}
        >
          Sign Guestbook
        </Button>
      )}
    </>
  );
}
