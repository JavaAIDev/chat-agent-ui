"use client";

import type { ReactNode } from "react";
import {
  AssistantRuntimeProvider,
  TextContentPart,
  useLocalRuntime,
  type ChatModelAdapter,
} from "@assistant-ui/react";

const AgentModelAdapter: ChatModelAdapter = {
  async run({ messages, abortSignal }) {
    const result = await fetch("/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        input: (messages[messages.length - 1]?.content[0] as TextContentPart)
          ?.text,
      }),
      signal: abortSignal,
    });

    const data = await result.json();
    return {
      content: [
        {
          type: "text",
          text: data.output,
        },
      ],
    };
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
