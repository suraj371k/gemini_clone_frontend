"use client";

import { useParams } from "next/navigation";
import { useChatStore } from "@/store/chatStore";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Image from "next/image";

export default function ChatroomPage() {
  const { id } = useParams<{ id: string }>();
  const { chatrooms } = useChatStore();
  const room = chatrooms.find((r) => r.id === id);

  type Message = {
    id: string;
    sender: "user" | "ai";
    text?: string;
    imageUrl?: string;
    timestamp: number;
  };

  const PAGE_SIZE = 20;

  const [allMessages, setAllMessages] = useState<Message[]>([]);
  const [page, setPage] = useState(1);
  const [displayed, setDisplayed] = useState<Message[]>([]);
  const [isLoadingOlder, setIsLoadingOlder] = useState(false);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [lastAiReplyAt, setLastAiReplyAt] = useState<number>(0);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const listRef = useRef<HTMLDivElement | null>(null);
  const topSentinelRef = useRef<HTMLDivElement | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const storageKey = useMemo(() => (id ? `chat-messages-${id}` : null), [id]);

  // Seed dummy history for reverse infinite scroll
  const generateDummyHistory = useCallback(
    (count: number, startFrom: number): Message[] => {
      const out: Message[] = [];
      const t = startFrom;
      for (let i = 0; i < count; i += 1) {
        const isUser = i % 2 === 0;
        out.push({
          id: `seed-${startFrom}-${i}`,
          sender: isUser ? "user" : "ai",
          text: isUser ? `Past message ${i + 1}` : `AI past reply ${i + 1}`,
          timestamp: t - (count - i) * 60_000,
        });
      }
      return out;
    },
    []
  );

  // Initialize messages: load from localStorage or seed dummy data
  useEffect(() => {
    const init = () => {
      let loaded: Message[] | null = null;
      try {
        if (typeof window !== "undefined" && storageKey) {
          const raw = localStorage.getItem(storageKey);
          if (raw) {
            loaded = JSON.parse(raw) as Message[];
          }
        }
      } catch {}

      if (loaded && loaded.length > 0) {
        setAllMessages(loaded);
        setDisplayed(loaded.slice(-PAGE_SIZE));
        setPage(1);
      } else {
        const now = Date.now();
        const seed = generateDummyHistory(60, now - 60_000); // 60 older msgs
        setAllMessages(seed);
        setDisplayed(seed.slice(-PAGE_SIZE));
        setPage(1);
      }

      // scroll to bottom after first paint
      setTimeout(() => {
        if (listRef.current) {
          listRef.current.scrollTop = listRef.current.scrollHeight;
        }
      }, 0);
    };
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [generateDummyHistory, storageKey]);

  // Persist messages to localStorage when they change
  useEffect(() => {
    try {
      if (typeof window !== "undefined" && storageKey) {
        localStorage.setItem(storageKey, JSON.stringify(allMessages));
      }
    } catch {}
  }, [allMessages, storageKey]);

  // Helper to format timestamps
  const formatTime = (ms: number) =>
    new Date(ms).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  // Auto scroll to bottom when new message appears
  const scrollToBottom = useCallback(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [displayed, isTyping, scrollToBottom]);

  // Reverse infinite scroll: load older when top sentinel intersects
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          !isLoadingOlder &&
          page * PAGE_SIZE < allMessages.length
        ) {
          loadOlder();
        }
      },
      { threshold: 1.0 }
    );

    if (topSentinelRef.current) {
      observer.observe(topSentinelRef.current);
    }

    return () => observer.disconnect();
  }, [allMessages, isLoadingOlder, page]);

  const loadOlder = useCallback(() => {
    setIsLoadingOlder(true);
    setTimeout(() => {
      setDisplayed(() => {
        const totalToShow = Math.min(
          allMessages.length,
          (page + 1) * PAGE_SIZE
        );
        const sliceStart = Math.max(0, allMessages.length - totalToShow);
        const next = allMessages.slice(sliceStart);

        // Maintain scroll position after prepending
        if (listRef.current) {
          const prevScrollHeight = listRef.current.scrollHeight;
          setTimeout(() => {
            if (!listRef.current) return;
            const newScrollHeight = listRef.current.scrollHeight;
            listRef.current.scrollTop =
              newScrollHeight - prevScrollHeight + listRef.current.scrollTop;
          }, 0);
        }

        return next;
      });
      setPage((p) => p + 1);
      setIsLoadingOlder(false);
    }, 800);
  }, [allMessages, page]);

  // Send message (text or image)
  const sendMessage = () => {
    if (!input.trim() && !selectedImage) return;
    const userMsg: Message = {
      id: crypto.randomUUID(),
      sender: "user",
      text: input.trim() ? input.trim() : undefined,
      imageUrl: selectedImage ?? undefined,
      timestamp: Date.now(),
    };
    setAllMessages((prev) => [...prev, userMsg]);
    setDisplayed((prev) => [...prev, userMsg]);
    setInput("");
    setSelectedImage(null);

    // Throttle AI replies: ensure at least 2s between AI messages
    const now = Date.now();
    const minDelay = Math.max(0, 2000 - (now - lastAiReplyAt));
    setIsTyping(true);
    // Show typing indicator for 1-1.5s then reply
    const delay = minDelay + 1000 + Math.floor(Math.random() * 600);
    setTimeout(() => {
      const aiMsg: Message = {
        id: crypto.randomUUID(),
        sender: "ai",
        text: "Gemini response (simulated)",
        timestamp: Date.now(),
      };
      setAllMessages((prev) => [...prev, aiMsg]);
      setDisplayed((prev) => [...prev, aiMsg]);
      setIsTyping(false);
      setLastAiReplyAt(Date.now());
    }, delay);
  };

  // Image upload
  const onSelectImage: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setSelectedImage(url);
  };

  // Copy to clipboard
  const copyMessage = async (m: Message) => {
    try {
      const content = m.text ?? (m.imageUrl ? "[image message]" : "");
      await navigator.clipboard.writeText(content);
      toast.success("Message copied to clipboard!");
    } catch {}
  };

  const SkeletonMessage = ({ sender }: { sender: "user" | "ai" }) => (
    <div
      className={`flex ${sender === "user" ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`flex items-start gap-3 max-w-xs lg:max-w-md ${
          sender === "user" ? "flex-row-reverse" : ""
        }`}
      >
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-gray-900 border-b border-gray-700 shadow-xl">
          <div className="px-4 py-4 sm:px-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-900/30 rounded-lg shadow-md">
                <svg
                  className="h-5 w-5 text-blue-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-100">
                  {room?.name ?? "Chatroom"}
                </h1>
                <p className="text-sm text-gray-400">
                  {displayed.length} messages
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-sm text-gray-400">
                Page {page} of {Math.ceil(allMessages.length / PAGE_SIZE)}
              </div>
            </div>
          </div>
        </div>

        {/* Chat Container */}
        <div className="flex flex-col h-[calc(100vh-80px)] bg-gray-900">
          {/* Messages Area */}
          <div
            ref={listRef}
            className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4"
          >
            <div ref={topSentinelRef} className="h-1" />

            {/* Loading Older Skeletons */}
            {isLoadingOlder && (
              <div className="space-y-4">
                <SkeletonMessage sender="ai" />
                <SkeletonMessage sender="user" />
                <SkeletonMessage sender="ai" />
                <SkeletonMessage sender="user" />
              </div>
            )}

            {/* Messages */}
            {displayed.map((msg) => (
              <div
                key={msg.id}
                className={`flex items-start gap-3 ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {msg.sender === "ai" && (
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-blue-900/30 text-blue-400">
                      AI
                    </AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={`max-w-xs sm:max-w-md lg:max-w-lg px-4 py-3 rounded-2xl cursor-pointer transition-all duration-300 hover:shadow-lg group ${
                    msg.sender === "user"
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700"
                      : "bg-gray-800 text-gray-200 hover:bg-gray-700"
                  }`}
                  title="Click to copy"
                  onClick={() => copyMessage(msg)}
                >
                  {msg.text && (
                    <div className="text-sm leading-relaxed">{msg.text}</div>
                  )}
                  {msg.imageUrl && (
                    <Image
                      src={msg.imageUrl}
                      alt="uploaded"
                      width={400}
                      height={400}
                      className="mt-2 max-h-64 rounded-lg w-full object-cover shadow-md"
                    />
                  )}
                  <div
                    className={`text-xs mt-2 opacity-70 group-hover:opacity-100 transition-opacity ${
                      msg.sender === "user" ? "text-blue-200" : "text-gray-400"
                    }`}
                  >
                    {formatTime(msg.timestamp)}
                  </div>
                </div>
                {msg.sender === "user" && (
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-gray-700 text-gray-200">
                      U
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex items-start gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-blue-900/30 text-blue-400">
                    AI
                  </AvatarFallback>
                </Avatar>
                <div className="bg-gray-800 rounded-2xl px-4 py-3">
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                    <span>Gemini is typing...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Message Composer */}
          <div className="border-t border-gray-700 bg-gray-900 p-4 sm:p-6">
            {selectedImage && (
              <div className="mb-4 p-3 bg-gray-800 rounded-lg border border-gray-700 flex items-start gap-3">
                <Image
                  src={selectedImage}
                  alt="preview"
                  className="object-cover rounded-md shadow-md"
                  width={80}
                  height={80}
                  unoptimized
                />
                <div className="flex-1">
                  <span className="text-sm text-gray-300">
                    Image ready to send
                  </span>
                </div>
                <button
                  onClick={() => setSelectedImage(null)}
                  className="text-gray-400 hover:text-gray-200 transition-colors"
                >
                  ✕
                </button>
              </div>
            )}

            <div className="flex gap-3 items-end">
              <div className="flex-1 relative">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type a message..."
                  className="w-full px-4 py-3 pr-12 rounded-2xl border border-gray-700 bg-gray-800 text-gray-200 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  disabled={!room}
                  onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                />
                <label className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={onSelectImage}
                    className="hidden"
                  />
                  <svg
                    className="h-5 w-5 text-gray-400 hover:text-gray-200 transition-colors"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </label>
              </div>
              <button
                onClick={sendMessage}
                disabled={!room || (!input.trim() && !selectedImage)}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:bg-gray-600 text-white rounded-2xl transition-all duration-300 transform disabled:scale-100 hover:scale-105 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Error State */}
        {!room && (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-red-900/30 rounded-full flex items-center justify-center mb-4 shadow-md">
                <svg
                  className="h-8 w-8 text-red-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-100 mb-2">
                Chatroom not found
              </h3>
              <p className="text-gray-400">
                <p>The chatroom you&apos;re looking for doesn&apos;t exist.</p>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
