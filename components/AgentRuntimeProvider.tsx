"use client";

import type { ReactNode } from "react";
import {
  AssistantRuntimeProvider,
  useLocalRuntime,
  type ChatModelAdapter,
} from "@assistant-ui/react";
import {EventSourceParserStream} from 'eventsource-parser/stream'

const AgentModelAdapter: ChatModelAdapter = {
  async *run({ messages, abortSignal }) {
    const response = await fetch("/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages,
      }),
      signal: abortSignal,
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed (${response.status}): ${error}`);
    }

    if (!response.body) {
      throw new Error(`No response`);
    }

    const eventStream = response.body
        .pipeThrough(new TextDecoderStream())
        .pipeThrough(new EventSourceParserStream());

    let text = "";
    // @ts-expect-error "unknown"
    for await (const content of eventStream) {
      let data = content.data || "";
      if (data.length > 2) {
        data = data.substring(1, data.length - 1);
      }
      text += data;
      yield {
        content: [{ type: "text", text }],
      };
    }
  },
};

export function AgentRuntimeProvider({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const runtime = useLocalRuntime(AgentModelAdapter);

  return (
    <AssistantRuntimeProvider runtime={runtime}>
      {children}
    </AssistantRuntimeProvider>
  );
}
