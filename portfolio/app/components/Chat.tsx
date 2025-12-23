"use client";

import { useState, useRef, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

type Message = { role: "user" | "assistant"; content: string };

export function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [open, setOpen] = useState(false);
  const [spinning, setSpinning] = useState(false);
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length, open, loading]);

  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([
        { role: "assistant", content: "Hello! How may I help you?" },
      ]);
    }
  }, [open, messages.length]);

  const toggleChat = () => {
    setSpinning(true);
    setTimeout(() => {
      setOpen((prev) => !prev);
      setSpinning(false);
    }, 200);
  };

  const sendMessage = async () => {
    const trimmedInput = input.trim();
    if (!trimmedInput) return;

    const userMessage: Message = { role: "user", content: trimmedInput };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmedInput }),
      });

      const data = await res.json();
      const botMessageContent = data.error
        ? data.error.message || "An error occurred."
        : data.reply || "No reply";

      setMessages((prev) => [
        ...prev.filter((m) => m.role !== "assistant" || m.content !== ""),
        { role: "assistant", content: botMessageContent },
      ]);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Error occurred";
      setMessages((prev) => [
        ...prev.filter((m) => m.role !== "assistant" || m.content !== ""),
        { role: "assistant", content: message },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {open && (
        <Card className="fixed bottom-36 right-4 sm:right-6 md:right-8 z-50 w-[90vw] sm:w-64 md:w-72 lg:w-80 max-h-[60vh] sm:max-h-[320px] md:max-h-[360px] lg:max-h-[400px] flex flex-col animate-in fade-in slide-in-from-top-4 duration-700 overflow-hidden">
          <CardContent className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-800">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex items-end ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {m.role === "assistant" && (
                  <span className="mr-2 text-2xl">🤖</span>
                )}
                <div
                  className={`px-3 py-2 rounded-xl break-words max-w-[85%] ${
                    m.role === "user"
                      ? "bg-blue-500 text-white rounded-br-none"
                      : "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-bl-none"
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex items-end justify-start">
                <span className="mr-2 text-2xl">🤖</span>
                <Skeleton className="bg-gray-200 dark:bg-gray-700 px-3 py-2 rounded-xl rounded-bl-none max-w-[85%] w-1/2 h-10" />
              </div>
            )}
            <div ref={chatEndRef} />
          </CardContent>

          <CardFooter className="flex p-2 sm:p-3 border-t border-gray-300 dark:border-gray-700 gap-2">
            <input
              className="flex-1 p-2 sm:p-2 border rounded-lg dark:bg-gray-800 dark:text-white text-sm sm:text-base"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message..."
              onKeyDown={(e) => {
                if (e.key === "Enter" && input.trim() !== "") sendMessage();
              }}
            />
            <button
              className="flex-shrink-0 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white px-3 sm:px-4 py-2 sm:py-2 rounded-lg transition-colors duration-200 disabled:opacity-50"
              onClick={sendMessage}
              disabled={input.trim() === ""}
            >
              Send
            </button>
          </CardFooter>
        </Card>
      )}

      <button
        onClick={toggleChat}
        className={`fixed bottom-20 right-8 z-50 w-12 h-12 sm:w-14 sm:h-14 rounded-full shadow-lg flex items-center justify-center text-xl sm:text-2xl font-bold bg-blue-600 text-white transition-transform duration-300 ease-in-out hover:bg-blue-700 active:bg-blue-800 ${
          spinning ? "rotate-180" : "rotate-0"
        }`}
        aria-label={open ? "Close chat" : "Open chat"}
      >
        {open ? "✕" : "💬"}
      </button>
    </div>
  );
}
