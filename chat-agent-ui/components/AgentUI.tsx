"use client";

import { AgentRuntimeProvider } from "@/components/AgentRuntimeProvider";
import { ThreadList } from "@/components/assistant-ui/thread-list";
import { Thread } from "@/components/assistant-ui/thread";

export function AgentUI() {
  return (
      <AgentRuntimeProvider>
          <main className="grid h-dvh grid-cols-[200px_1fr] gap-x-2 px-4 py-4">
            <ThreadList />
            <Thread />
          </main>
      </AgentRuntimeProvider>
  );
}
