"use client";

import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { Loader } from "@/components/ai-elements/loader";
import {
  Message,
  MessageAvatar,
  MessageContent,
} from "@/components/ai-elements/message";
import { Response } from "@/components/ai-elements/response";
import {
  Tool,
  ToolContent,
  ToolHeader,
  ToolInput,
  ToolOutput,
} from "@/components/ai-elements/tool";
import {
  PromptInput,
  PromptInputActionAddAttachments,
  PromptInputActionMenu,
  PromptInputActionMenuContent,
  PromptInputActionMenuTrigger,
  PromptInputAttachment,
  PromptInputAttachments,
  PromptInputBody,
  PromptInputButton,
  PromptInputModelSelect,
  PromptInputModelSelectContent,
  PromptInputModelSelectItem,
  PromptInputModelSelectTrigger,
  PromptInputModelSelectValue,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputToolbar,
  PromptInputTools,
  usePromptInputAttachments,
} from "@/components/ai-elements/prompt-input";
import { GlobeIcon, MicIcon, MessageSquare } from "lucide-react";
import { useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import Image from "next/image";
import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { uploadFile } from "@/lib/upload";

async function blobUrlToFile(
  blobUrl: string,
  name: string,
  type: string,
): Promise<File> {
  const res = await fetch(blobUrl);
  const blob = await res.blob();
  return new File([blob], name, { type });
}

async function convertFilesToSupabaseUrls(files: any[]) {
  const uploadPromises = files.map(async (file) => {
    const realFile = await blobUrlToFile(
      file.url,
      file.filename,
      file.mediaType,
    );
    return uploadFile(realFile);
  });

  const results = await Promise.all(uploadPromises);

  return results
    .filter((result) => result !== null)
    .map((result) => ({
      type: "file",
      ...result,
    }));
}

export default function RAGChat() {
  const [text, setText] = useState("");
  const [attachments, setAttachments] = useState<any[]>([]);
  // const attachmentsHook = usePromptInputAttachments();
  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat/rag",
    }),
  });

  async function handleSubmit(message: { text: string; files: any[] }) {
    console.log("handleSubmit called", message);
    if (!message.text && (!message.files || message.files.length === 0)) return;

    // ✅ upload files to supabase and get public URLs
    const fileParts =
      message.files && message.files.length > 0
        ? await convertFilesToSupabaseUrls(message.files)
        : [];

    console.log("fileParts", fileParts);
    console.log("message", message);
    sendMessage({
      role: "user",
      parts: [
        { type: "text", text: message.text || "Sent with attachments" },
        ...fileParts,
      ],
    });

    setText("");
    setAttachments([]);
    // attachmentsHook.clear();
  }

  return (
    <div className="flex flex-col w-full max-w-2xl py-24 mx-auto stretch">
      {/* Conversation */}
      <Conversation className="relative w-full" style={{ height: "500px" }}>
        <ConversationContent>
          {messages.length === 0 ? (
            <ConversationEmptyState
              icon={<MessageSquare className="size-6" />}
              title="No messages yet"
              description="Start a conversation to see messages here"
            />
          ) : (
            messages.map((m) => {
              // Split message parts into normal (text/file) vs tools
              const normalParts = m.parts.filter(
                (p) => p.type === "text" || p.type === "file",
              );
              const toolParts = m.parts.filter((p) =>
                p.type?.startsWith("tool-"),
              );

              return (
                <React.Fragment key={m.id}>
                  {/* Tools inside accordion */}
                  {toolParts.length > 0 && (
                    <Accordion
                      type="single"
                      collapsible
                      className="w-full my-2"
                    >
                      <AccordionItem value={`tools-${m.id}`}>
                        <AccordionTrigger>Tools</AccordionTrigger>
                        <AccordionContent>
                          {toolParts.map((part, index) => (
                            <Tool
                              key={`${m.id}-tool-${index}`}
                              className="my-2"
                            >
                              <ToolHeader type={part.type} state={part.state} />
                              <ToolContent>
                                <ToolInput input={part.input} />
                                <ToolOutput
                                  errorText={part.errorText}
                                  output={part.output}
                                />
                              </ToolContent>
                            </Tool>
                          ))}
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  )}

                  {/* Normal message bubble */}
                  {normalParts.length > 0 && (
                    <Message from={m.role}>
                      <MessageContent variant="contained">
                        {normalParts.map((part, index) => {
                          switch (part.type) {
                            case "text":
                              return (
                                <Response key={`${m.id}-text-${index}`}>
                                  {part.text}
                                </Response>
                              );

                            case "file":
                              if (part.mediaType?.startsWith("image/")) {
                                return (
                                  <div
                                    key={`${m.id}-img-${index}`}
                                    className="mt-2"
                                  >
                                    <Image
                                      src={part.url}
                                      width={200}
                                      height={200}
                                      alt={`attachment-${index}`}
                                      className="rounded-lg"
                                    />
                                  </div>
                                );
                              }
                              return (
                                <div
                                  key={`${m.id}-file-${index}`}
                                  className="mt-2 text-sm text-gray-500"
                                >
                                  📎 {part.filename || "Attachment"} (
                                  {part.mediaType})
                                </div>
                              );

                            default:
                              return null;
                          }
                        })}
                      </MessageContent>
                    </Message>
                  )}
                </React.Fragment>
              );
            })
          )}

          {status === "submitted" && <Loader />}
        </ConversationContent>

        <ConversationScrollButton />
      </Conversation>

      {/* Prompt Input */}
      <PromptInput
        onSubmit={(m) => handleSubmit(m)}
        className="mt-4"
        globalDrop
        multiple
      >
        <PromptInputBody>
          <PromptInputAttachments>
            {(attachment) => <PromptInputAttachment data={attachment} />}
          </PromptInputAttachments>
          <PromptInputTextarea
            onChange={(e) => setText(e.target.value)}
            value={text}
          />
        </PromptInputBody>

        <PromptInputToolbar>
          <PromptInputTools>
            <PromptInputActionMenu>
              <PromptInputActionMenuTrigger />
              <PromptInputActionMenuContent>
                <PromptInputActionAddAttachments />
              </PromptInputActionMenuContent>
            </PromptInputActionMenu>
          </PromptInputTools>

          <PromptInputSubmit
            disabled={!text && attachments.length === 0}
            status={status}
          />
        </PromptInputToolbar>
      </PromptInput>
    </div>
  );
}

// <form
//   className="hidden bottom-0 w-full max-w-md p-2 mb-8 border border-gray-300 rounded shadow-xl space-y-2"
//   onSubmit={async (event) => {
//     event.preventDefault();

//     const fileParts =
//       files && files.length > 0
//         ? await convertFilesToDataURLs(files)
//         : [];

//     sendMessage({
//       role: "user",
//       parts: [{ type: "text", text: input }, ...fileParts],
//     });

//     setInput("");
//     setFiles(undefined);

//     if (fileInputRef.current) {
//       fileInputRef.current.value = "";
//     }
//   }}
// >
//   <input
//     type="file"
//     accept="image/*"
//     className=""
//     onChange={(event) => {
//       if (event.target.files) {
//         setFiles(event.target.files);
//       }
//     }}
//     multiple
//     ref={fileInputRef}
//   />
//   <input
//     className="w-full p-2"
//     value={input}
//     placeholder="Say something..."
//     onChange={(e) => setInput(e.target.value)}
//   />
// </form>
