"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useRef, useState } from "react";
import Image from "next/image";
import React from "react";
import { X, Upload, Camera } from "lucide-react";
import ReactMarkdown from "react-markdown";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

async function uploadImageToSupabase(file: File): Promise<string | null> {
  try {
    const fileName = `${Date.now()}-${file.name.replace(/\s/g, "_")}`;
    const filePath = `crop-doctor/${fileName}`;

    const response = await fetch(
      `${SUPABASE_URL}/storage/v1/object/crop-doctor/${fileName}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          "Content-Type": file.type || "application/octet-stream",
          "x-upsert": "true",
        },
        body: file,
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Upload failed:", response.status, errorText);
      return null;
    }

    const publicUrl = `${SUPABASE_URL}/storage/v1/object/public/crop-doctor/${fileName}`;
    return publicUrl;
  } catch (error) {
    console.error("Upload error:", error);
    return null;
  }
}

export default function ChatPage() {
  const [input, setInput] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const { messages, sendMessage } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat/rag",
    }),
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [messages]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!input.trim() && !imageUrl.trim()) return;

    setIsLoading(true);

    const textContent = input.trim() || "Image analysis";

    sendMessage({
      role: "user",
      parts: [
        ...(imageUrl.trim().length > 0
          ? [
              {
                type: "file" as const,
                mediaType: "image/jpeg",
                url: imageUrl.trim(),
              },
            ]
          : []),
        { type: "text" as const, text: textContent },
      ],
    });

    setInput("");
    setImageUrl("");
    setIsLoading(false);
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files || e.target.files.length === 0) return;

    setIsUploadingImage(true);

    try {
      const file = e.target.files[0];
      const uploadedUrl = await uploadImageToSupabase(file);

      if (uploadedUrl) {
        setImageUrl(uploadedUrl);
      } else {
        alert("Failed to upload image");
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Error uploading image");
    } finally {
      setIsUploadingImage(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }

  return (
    <div className="flex flex-col h-screen w-full bg-gradient-to-b from-green-50 to-white">
      {/* Header */}
      <div className="bg-green-600 text-white px-4 py-3 shadow-md">
        <h1 className="text-lg font-semibold">🌱 Crop Doctor</h1>
        <p className="text-xs text-green-100">AI Agronomist</p>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="text-6xl mb-4">🌽</div>
              <p className="text-gray-600 font-medium">Start a conversation</p>
              <p className="text-gray-400 text-sm mt-2">
                Ask about crop diseases, treatment, and prevention
              </p>
            </div>
          </div>
        ) : (
          <>
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex ${
                  m.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                    m.role === "user"
                      ? "bg-green-600 text-white rounded-br-none"
                      : "bg-gray-200 text-gray-900 rounded-bl-none"
                  }`}
                >
                  {m.parts.map((part, index) => {
                    if (part.type === "text") {
                      return (
                        <div
                          key={`${m.id}-text-${index}`}
                          className="break-words text-sm prose prose-sm max-w-none"
                        >
                          <ReactMarkdown
                            components={{
                              p: ({ children }) => (
                                <p className="mb-2 last:mb-0">{children}</p>
                              ),
                              ul: ({ children }) => (
                                <ul className="list-disc list-inside mb-2 space-y-1">
                                  {children}
                                </ul>
                              ),
                              ol: ({ children }) => (
                                <ol className="list-decimal list-inside mb-2 space-y-1">
                                  {children}
                                </ol>
                              ),
                              li: ({ children }) => <li className="ml-2">{children}</li>,
                              strong: ({ children }) => (
                                <strong className="font-bold">{children}</strong>
                              ),
                              em: ({ children }) => (
                                <em className="italic">{children}</em>
                              ),
                              code: ({ children }) => (
                                <code className="bg-black bg-opacity-20 px-1.5 py-0.5 rounded text-xs">
                                  {children}
                                </code>
                              ),
                              h1: ({ children }) => (
                                <h1 className="text-lg font-bold mb-2">{children}</h1>
                              ),
                              h2: ({ children }) => (
                                <h2 className="text-base font-bold mb-2">{children}</h2>
                              ),
                              h3: ({ children }) => (
                                <h3 className="text-sm font-bold mb-1">{children}</h3>
                              ),
                              blockquote: ({ children }) => (
                                <blockquote className="border-l-2 border-current pl-2 italic opacity-80 my-2">
                                  {children}
                                </blockquote>
                              ),
                            }}
                          >
                            {part.text}
                          </ReactMarkdown>
                        </div>
                      );
                    }
                    if (
                      part.type === "file" &&
                      part.mediaType?.startsWith("image/")
                    ) {
                      return (
                        <div
                          key={`${m.id}-image-${index}`}
                          className="mt-2"
                        >
                          <Image
                            src={part.url}
                            width={280}
                            height={280}
                            alt={`attachment-${index}`}
                            className="rounded-lg max-w-xs"
                          />
                        </div>
                      );
                    }
                    return null;
                  })}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-200 text-gray-900 px-4 py-3 rounded-2xl rounded-bl-none">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce delay-100"></div>
                    <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce delay-200"></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Image Preview */}
      {imageUrl.trim() && (
        <div className="px-4 py-2 bg-white border-t border-gray-200">
          <div className="flex items-end gap-2 overflow-x-auto pb-2">
            <div className="relative flex-shrink-0">
              <Image
                src={imageUrl.trim()}
                width={100}
                height={100}
                alt="preview"
                className="rounded-lg object-cover"
              />
              <button
                type="button"
                onClick={() => setImageUrl("")}
                className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center transition-colors"
              >
                <X size={14} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="bg-white border-t border-gray-300 px-4 py-3">
        <form onSubmit={handleSubmit} className="flex gap-2 items-end">
        {/* File Upload Input */}
<input
  type="file"
  ref={fileInputRef}
  onChange={handleImageUpload}
  accept="image/*"
  className="hidden"
  disabled={isUploadingImage}
/>

{/* Camera Input */}
<input
  type="file"
  ref={cameraInputRef}
  onChange={handleImageUpload}
  accept="image/*"
  capture="environment"
  className="hidden"
  disabled={isUploadingImage}
/>
         {/* Mobile Camera Button */}
<button
  type="button"
  onClick={() => cameraInputRef.current?.click()}
  disabled={isLoading || isUploadingImage}
  className="sm:hidden flex-shrink-0 p-2 rounded-full hover:bg-green-100 text-green-600"
  title="Take photo"
>
  <Camera size={24} />
</button>

{/* Mobile Upload Button */}
<button
  type="button"
  onClick={() => fileInputRef.current?.click()}
  disabled={isLoading || isUploadingImage}
  className="sm:hidden flex-shrink-0 p-2 rounded-full hover:bg-green-100 text-green-600"
  title="Upload image"
>
  <Upload size={24} />
</button>

{/* Desktop Upload Button */}
<button
  type="button"
  onClick={() => fileInputRef.current?.click()}
  disabled={isLoading || isUploadingImage}
  className="hidden sm:flex flex-shrink-0 p-2 rounded-full hover:bg-green-100 text-green-600"
  title="Upload image"
>
  <Upload size={24} />
</button>
          {/* <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading || isUploadingImage}
            className="flex-shrink-0 p-2 rounded-full hover:bg-green-100 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors text-green-600"
            title="Upload image"
          >
            <Upload size={24} />
          </button> */}
          <div className="flex-1 flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e as any);
                }
              }}
              placeholder="Message..."
              disabled={isLoading || isUploadingImage}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-50 disabled:cursor-not-allowed text-sm"
            />
            <button
              type="submit"
              disabled={isLoading || isUploadingImage || (!input.trim() && !imageUrl.trim())}
              className="flex-shrink-0 p-2 rounded-full bg-green-600 text-white hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              <span className="text-lg">➤</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}