"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Edit, Trash2, X, Check } from "lucide-react";
import { useState, useRef, useEffect } from "react";

interface MessageActionsProps {
  messageId: string;
  messageText: string;
  userId: string;
  currentUserId?: string;
}

export function MessageActions({
  messageId,
  messageText,
  userId,
  currentUserId,
}: MessageActionsProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedMessage, setEditedMessage] = useState(messageText);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const isOwner = currentUserId === userId;

  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  useEffect(() => {
    if (isEditing) {
      adjustTextareaHeight();
    }
  }, [isEditing, editedMessage]);

  useEffect(() => {
    const handleResize = () => {
      if (isEditing) {
        adjustTextareaHeight();
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isEditing]);

  const handleEdit = () => {
    setIsEditing(true);
    setEditedMessage(messageText);
    setError(null);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedMessage(messageText);
    setError(null);
  };

  const handleSaveEdit = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/guestbook?id=${messageId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: editedMessage }),
      });

      if (response.ok) {
        setIsEditing(false);
        // Dispatch custom event to refresh guestbook
        window.dispatchEvent(new CustomEvent("guestbook-updated"));
      } else if (response.status === 401) {
        setError("You are not authorized to edit this message");
      } else if (response.status === 404) {
        setError("Message not found");
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Failed to update message");
      }
    } catch {
      setError("Failed to update message");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (
      !confirm(
        "Are you sure you want to delete this message? This action cannot be undone."
      )
    ) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/guestbook?id=${messageId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        // Dispatch custom event to refresh guestbook
        window.dispatchEvent(new CustomEvent("guestbook-updated"));
      } else if (response.status === 401) {
        setError("You are not authorized to delete this message");
      } else if (response.status === 404) {
        setError("Message not found");
      } else {
        setError("Failed to delete message");
      }
    } catch {
      setError("Failed to delete message");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOwner) {
    return null;
  }

  if (isEditing) {
    return (
      <div className="space-y-2 mt-2">
        <div className="space-y-1">
          <Textarea
            ref={textareaRef}
            value={editedMessage}
            onChange={(e) => setEditedMessage(e.target.value)}
            className="resize-none break-words whitespace-pre-wrap overflow-wrap-anywhere min-h-[80px] overflow-hidden focus:outline-none focus:ring-inset"
            disabled={isLoading}
          />
          <div className="text-xs text-muted-foreground text-right">
            {editedMessage.length}/500 characters
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={handleSaveEdit}
            disabled={isLoading}
            className="h-8 w-8 p-0"
          >
            <Check className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={handleCancelEdit}
            disabled={isLoading}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
          {error && <div className="text-sm text-red-600">{error}</div>}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 mt-2">
      <Button
        size="sm"
        variant="outline"
        onClick={handleEdit}
        disabled={isLoading}
        className="h-8 px-2"
      >
        <Edit className="h-3 w-3 mr-1" />
        Edit
      </Button>
      <Button
        size="sm"
        variant="outline"
        onClick={handleDelete}
        disabled={isLoading}
        className="h-8 px-2 text-red-600 hover:text-red-700 hover:bg-red-50"
      >
        <Trash2 className="h-3 w-3 mr-1" />
        Delete
      </Button>
      {error && <div className="text-sm text-red-600">{error}</div>}
    </div>
  );
}
