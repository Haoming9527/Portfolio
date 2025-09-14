"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Edit, Trash2, X, Check } from "lucide-react";
import { useState, memo } from "react";

interface MessageActionsProps {
  messageId: string;
  messageText: string;
  userId: string;
  currentUserId?: string;
}

export const MessageActions = memo(function MessageActions({ messageId, messageText, userId, currentUserId }: MessageActionsProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedMessage, setEditedMessage] = useState(messageText);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isOwner = currentUserId === userId;

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
    if (!editedMessage.trim()) {
      setError("Message cannot be empty");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/guestbook?id=${messageId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: editedMessage.trim() }),
      });

      if (response.ok) {
        setIsEditing(false);
        // Refresh the page to show updated message
        window.location.reload();
      } else if (response.status === 401) {
        setError("You are not authorized to edit this message");
      } else if (response.status === 404) {
        setError("Message not found");
      } else {
        setError("Failed to update message");
      }
    } catch (error) {
      setError("Failed to update message");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this message? This action cannot be undone.")) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/guestbook?id=${messageId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Refresh the page to remove the message
        window.location.reload();
      } else if (response.status === 401) {
        setError("You are not authorized to delete this message");
      } else if (response.status === 404) {
        setError("Message not found");
      } else {
        setError("Failed to delete message");
      }
    } catch (error) {
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
        <Textarea
          value={editedMessage}
          onChange={(e) => setEditedMessage(e.target.value)}
          className="resize-none"
          maxLength={500}
          rows={3}
          disabled={isLoading}
        />
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
          {error && (
            <div className="text-sm text-red-600">
              {error}
            </div>
          )}
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
      {error && (
        <div className="text-sm text-red-600">
          {error}
        </div>
      )}
    </div>
  );
});
