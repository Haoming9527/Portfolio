"use client";

import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "lucide-react";
import { MessageActions } from "./MessageActions";
import { useState, useEffect, useCallback } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "../lib/auth";

interface GuestBookEntry {
  id: string;
  message: string;
  createdAt: Date;
  userId: string;
  user: {
    username: string | null;
    profileimage: string | null;
  };
}

interface GuestBookEntriesClientProps {
  entries: GuestBookEntry[];
}

export function GuestBookEntriesClient({
  entries: initialEntries,
}: GuestBookEntriesClientProps) {
  const [entries, setEntries] = useState<GuestBookEntry[]>(initialEntries);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { user, isLoading } = useAuth();
  const currentUserId = user?.id;

  const refreshData = useCallback(async () => {
    setIsRefreshing(true);
    try {
      // Only fetch entries on refresh - user info rarely changes
      const entriesResponse = await fetch("/api/guestbook");
      if (entriesResponse.ok) {
        const entriesData = await entriesResponse.json();
        setEntries(entriesData);
      }
    } catch (error) {
      console.error("Error refreshing data:", error);
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    let refreshTimeout: NodeJS.Timeout;

    const handleFocus = () => {
      // Only refresh if we're not in the initial loading state
      if (!isLoading) {
        clearTimeout(refreshTimeout);
        refreshTimeout = setTimeout(() => {
          refreshData();
        }, 1000);
      }
    };

    const handleVisibilityChange = () => {
      if (!document.hidden && !isLoading) {
        clearTimeout(refreshTimeout);
        refreshTimeout = setTimeout(() => {
          refreshData();
        }, 1000);
      }
    };

    const handleGuestbookUpdate = () => {
      // Refresh immediately when a new entry is added
      refreshData();
    };

    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("guestbook-updated", handleGuestbookUpdate);

    return () => {
      clearTimeout(refreshTimeout);
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("guestbook-updated", handleGuestbookUpdate);
    };
  }, [refreshData, isLoading]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="flex items-start space-x-4 p-4 border rounded-lg"
          >
            <Skeleton className="w-12 h-12 rounded-full flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-3 w-32" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div className="text-center py-12">
        <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">No messages yet</h3>
        <p className="text-muted-foreground">
          Be the first to leave a message in the guestbook!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {isRefreshing && (
        <div className="text-center py-2 text-sm text-muted-foreground">
          Refreshing messages...
        </div>
      )}
      {entries.map((item) => (
        <div
          key={item.id}
          className="flex items-start space-x-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
        >
          <Image
            src={item.user?.profileimage || "/default.png"}
            alt={`${item.user?.username}'s profile`}
            width={48}
            height={48}
            className="w-12 h-12 rounded-full object-cover flex-shrink-0 border-2 border-muted"
          />

          <div className="flex-1 min-w-0 overflow-hidden">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-semibold text-foreground">
                {item.user?.username || "Anonymous"}
              </span>
              <Badge variant="secondary" className="text-xs">
                <Calendar className="h-3 w-3 mr-1" />
                {new Date(item.createdAt).toLocaleDateString()}
              </Badge>
            </div>
            <p className="text-muted-foreground leading-relaxed break-words whitespace-pre-wrap overflow-wrap-anywhere">
              {item.message}
            </p>

            <MessageActions
              messageId={item.id}
              messageText={item.message}
              userId={item.userId}
              currentUserId={currentUserId}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
