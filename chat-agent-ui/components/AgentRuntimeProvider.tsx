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
        .pipeThrough(new EventSourceParserStream())
        .getReader();

    let text = "";

    for (;;) {
      const {done, value} = await eventStream.read();
      if (!done) {
        if (!value.data) {
          continue;
        }
        const { content } = JSON.parse(value.data);
        if (!content || content.length == 0 || content[0].type !== "text" || !content[0].text) {
          continue;
        }
        text += content[0].text;
        yield {
          content: [{ type: "text", text }],
        };
      } else {
        break;
      }
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
