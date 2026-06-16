"use client";

import { useState, useRef, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Bot, MessageCircle, Send, X } from "lucide-react";
import ReactMarkdown from "react-markdown";
import type { Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

type Message = { role: "user" | "assistant"; content: string };

const markdownComponents: Components = {
  code({ className, children, ...props }) {
    const match = /language-(\w+)/.exec(className || "");
    return match ? (
      <div className="my-2 overflow-hidden rounded-lg border border-slate-700">
        <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950 px-3 py-1 text-xs text-slate-400">
          <span>{match[1]}</span>
        </div>
        <SyntaxHighlighter
          style={oneDark}
          language={match[1]}
          PreTag="div"
          customStyle={{ margin: 0, borderRadius: 0, fontSize: "0.8rem" }}
        >
          {String(children).replace(/\n$/, "")}
        </SyntaxHighlighter>
      </div>
    ) : (
      <code className={className} {...props}>
        {children}
      </code>
    );
  },
};

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
        <Card className="fixed bottom-36 right-4 sm:right-6 md:right-8 z-50 w-[90vw] sm:w-64 md:w-72 lg:w-80 max-h-[60vh] sm:max-h-[320px] md:max-h-[360px] lg:max-h-[400px] flex flex-col animate-in fade-in slide-in-from-top-4 duration-700 overflow-hidden border-slate-200 bg-white shadow-none dark:border-primary/30 dark:bg-[oklch(0.16_0.045_264)]">
          <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3 dark:border-white/10">
            <div>
              <h2 className="font-display text-lg leading-none text-slate-950 dark:text-white">
                Ask Haoming
              </h2>
              <p className="mt-1 text-xs text-slate-500 dark:text-indigo-100/65">
                Portfolio assistant
              </p>
            </div>
            <Bot className="h-5 w-5 text-primary" />
          </div>

          <CardContent className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-800">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex items-end ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {m.role === "assistant" && (
                  <div className="mr-2 mb-1 rounded-lg bg-slate-100 p-1.5 dark:bg-white/10">
                    <Bot className="w-5 h-5 text-primary" />
                  </div>
                )}
                <div
                  className={`px-3 py-1.5 rounded-xl break-words max-w-[85%] ${
                    m.role === "user"
                      ? "bg-slate-950 text-white rounded-br-none dark:bg-primary dark:text-primary-foreground"
                      : "bg-slate-100 dark:bg-white/8 text-gray-900 dark:text-indigo-50 rounded-bl-none border border-slate-200 dark:border-white/10"
                  }`}
                >
                  {m.role === "assistant" ? (
                    <div
                      className="prose prose-sm dark:prose-invert max-w-none
                        prose-p:leading-relaxed prose-p:my-1
                        prose-ul:my-1 prose-li:my-0
                        prose-code:text-primary dark:prose-code:text-indigo-100 prose-code:bg-white dark:prose-code:bg-white/10 prose-code:px-1 prose-code:rounded
                        prose-strong:text-inherit"
                    >
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={markdownComponents}
                      >
                        {m.content}
                      </ReactMarkdown>
                    </div>
                  ) : (
                    m.content
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex items-end justify-start">
                <div className="mr-2 mb-1 rounded-lg bg-slate-100 p-1.5 dark:bg-white/10">
                  <Bot className="w-5 h-5 text-primary animate-pulse" />
                </div>
                <Skeleton className="bg-slate-200 dark:bg-white/10 px-3 py-2 rounded-xl rounded-bl-none max-w-[85%] w-1/2 h-10" />
              </div>
            )}
            <div ref={chatEndRef} />
          </CardContent>

          <CardFooter className="flex p-2 sm:p-3 border-t border-slate-200 dark:border-white/10 gap-2">
            <input
              className="flex-1 p-2 sm:p-2 border border-slate-200 rounded-lg bg-white text-sm sm:text-base text-slate-950 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-ring dark:border-white/15 dark:bg-white/8 dark:text-white dark:placeholder:text-indigo-100/50"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message..."
              onKeyDown={(e) => {
                if (e.key === "Enter" && input.trim() !== "") sendMessage();
              }}
            />
            <button
              className="flex-shrink-0 bg-slate-950 hover:bg-primary active:bg-primary text-white px-3 sm:px-4 py-2 sm:py-2 rounded-lg transition-colors duration-200 disabled:opacity-50 dark:bg-white dark:text-slate-950 dark:hover:bg-primary dark:hover:text-primary-foreground"
              onClick={sendMessage}
              disabled={input.trim() === ""}
              aria-label="Send message"
            >
              <Send className="h-4 w-4" />
            </button>
          </CardFooter>
        </Card>
      )}

      <button
        onClick={toggleChat}
        className={`fixed bottom-20 right-8 z-50 w-12 h-12 sm:w-14 sm:h-14 rounded-full border border-slate-800 bg-slate-950 text-white flex items-center justify-center transition-all duration-300 ease-in-out hover:bg-primary active:bg-primary dark:border-primary/40 dark:bg-[oklch(0.16_0.055_264)] dark:hover:bg-primary ${
          spinning ? "rotate-180" : "rotate-0"
        }`}
        aria-label={open ? "Close chat" : "Open chat"}
      >
        {open ? <X className="h-5 w-5" /> : <MessageCircle className="h-5 w-5" />}
      </button>
    </div>
  );
}
