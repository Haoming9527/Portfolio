"use client";

import { Badge } from "@/components/ui/badge";
import { Calendar } from "lucide-react";
import { MessageActions } from "./MessageActions";
import { useState, useEffect, useCallback, useRef } from "react";
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

/**
 * GuestBookEntriesClient - Main component for displaying guestbook messages
 * 
 * Features:
 * - Displays guestbook entries with user profiles and timestamps
 * - Handles user authentication and permission-based actions
 * - Provides real-time updates on focus/visibility changes
 * - Optimized with memoization and debounced API calls
 * - Includes loading states and error handling
 * 
 * @param entries - Initial guestbook entries from server-side rendering
 */
export function GuestBookEntriesClient({ entries: initialEntries }: GuestBookEntriesClientProps) {
  const [entries, setEntries] = useState<GuestBookEntry[]>(initialEntries);
  const [currentUserId, setCurrentUserId] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const refreshTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  /**
   * Checks user authentication status and fetches user info
   * After successful auth, automatically fetches entries to ensure user permissions are applied
   * Sets loading state to false when complete (success or failure)
   */
  const checkAuth = useCallback(async () => {
    try {
      const response = await fetch("/api/guestbook/user-info");
      if (response.ok) {
        const userData = await response.json();
        setCurrentUserId(userData.id);
        // Fetch entries after auth is complete
        const entriesResponse = await fetch("/api/guestbook");
        if (entriesResponse.ok) {
          const entriesData = await entriesResponse.json();
          setEntries(entriesData);
        }
      }
    } catch (error) {
      console.error("Error checking auth:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Refreshes both authentication and entries data with debouncing
   * Prevents excessive API calls by debouncing requests with 300ms delay
   * Uses parallel execution for refreshes since auth is already established
   */
  const refreshData = useCallback(async () => {
    if (refreshTimeoutRef.current) {
      clearTimeout(refreshTimeoutRef.current);
    }

    refreshTimeoutRef.current = setTimeout(async () => {
      setIsRefreshing(true);
      await checkAuth();
      setIsRefreshing(false);
    }, 300);
  }, [checkAuth]);

  /**
   * Initial data loading effect
   * Runs authentication check on component mount, which automatically fetches entries after auth completes
   */
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  /**
   * Event listeners for automatic data refresh
   * Listens for window focus and visibility changes to refresh data when user returns to the tab
   * Includes cleanup for event listeners and timeout to prevent memory leaks
   */
  useEffect(() => {
    const handleFocus = () => {
      if (!isRefreshing) {
        refreshData();
      }
    };

    const handleVisibilityChange = () => {
      if (!document.hidden && !isRefreshing) {
        refreshData();
      }
    };

    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
      }
    };
  }, [refreshData]);

  // Loading state - displays skeleton placeholders while data is being fetched
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

  // Empty state - displays when no guestbook entries exist
  if (entries.length === 0) {
    return (
      <div className="text-center py-12">
        <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">No messages yet</h3>
        <p className="text-muted-foreground">Be the first to leave a message in the guestbook!</p>
      </div>
    );
  }

  // Main render - displays guestbook entries with user profiles and action buttons
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
            alt={`${item.user?.username || 'Anonymous'}'s profile`}
            className="w-12 h-12 rounded-full object-cover flex-shrink-0 border-2 border-muted"
            loading="lazy"
            decoding="async"
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
