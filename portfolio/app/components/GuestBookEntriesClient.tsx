"use client";

import { Badge } from "@/components/ui/badge";
import { Calendar } from "lucide-react";
import { MessageActions } from "./MessageActions";
import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";

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

export function GuestBookEntriesClient({ entries: initialEntries }: GuestBookEntriesClientProps) {
  const [entries, setEntries] = useState<GuestBookEntry[]>(initialEntries);
  const [currentUserId, setCurrentUserId] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchEntries = async () => {
    try {
      const response = await fetch("/api/guestbook");
      if (response.ok) {
        const data = await response.json();
        setEntries(data);
      }
    } catch (error) {
      console.error("Error fetching entries:", error);
    }
  };

  const checkAuth = async () => {
    try {
      const response = await fetch("/api/guestbook/user-info");
      if (response.ok) {
        const userData = await response.json();
        setCurrentUserId(userData.id);
        await fetchEntries();
      }
    } catch (error) {
      console.error("Error checking auth:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshData = async () => {
    setIsRefreshing(true);
    await Promise.all([fetchEntries(), checkAuth()]);
    setIsRefreshing(false);
  };

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    const handleFocus = () => {
      refreshData();
    };

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        refreshData();
      }
    };

    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex items-start space-x-4 p-4 border rounded-lg">
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
        <p className="text-muted-foreground">Be the first to leave a message in the guestbook!</p>
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
        <div key={item.id} className="flex items-start space-x-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
          <img
            src={item.user?.profileimage || "/default.png"}
            alt={`${item.user?.username}'s profile`}
            className="w-12 h-12 rounded-full object-cover flex-shrink-0 border-2 border-muted"
          />
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-semibold text-foreground">
                {item.user?.username || 'Anonymous'}
              </span>
              <Badge variant="secondary" className="text-xs">
                <Calendar className="h-3 w-3 mr-1" />
                {new Date(item.createdAt).toLocaleDateString()}
              </Badge>
            </div>
            <p className="text-muted-foreground leading-relaxed">
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
