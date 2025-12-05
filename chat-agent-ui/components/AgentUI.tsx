"use client";

import {AgentRuntimeProvider} from "@/components/AgentRuntimeProvider";
import {ThreadList} from "@/components/assistant-ui/thread-list";
import {Thread} from "@/components/assistant-ui/thread";
import {TooltipProvider} from "@/components/ui/tooltip";

export function AgentUI() {
    return (
        <AgentRuntimeProvider>
            <TooltipProvider>
                <main className="grid h-dvh grid-cols-[200px_1fr] gap-x-2 px-4 py-4">
                    <ThreadList/>
                    <Thread/>
                </main>
            </TooltipProvider>
        </AgentRuntimeProvider>
    );
}
