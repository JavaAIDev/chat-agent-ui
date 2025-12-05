"use client";

import type {ReactNode} from "react";
import {
    AssistantRuntimeProvider,
    type ChatModelAdapter,
    CompositeAttachmentAdapter,
    SimpleImageAttachmentAdapter,
    SimpleTextAttachmentAdapter,
    type ThreadAssistantMessagePart,
    useLocalRuntime,
} from "@assistant-ui/react";
import {EventSourceParserStream} from 'eventsource-parser/stream'

const AgentModelAdapter: ChatModelAdapter = {
    async* run({messages, abortSignal}) {
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
        let reasoning = "";

        for (; ;) {
            const {done, value} = await eventStream.read();
            if (!done) {
                if (!value.data) {
                    continue;
                }
                const {content} = JSON.parse(value.data);
                if (!content || content.length == 0) {
                    continue;
                }
                for (const item of content) {
                    if (item.type === "text") {
                        text += item.text;
                    } else if (item.type === "reasoning") {
                        reasoning += item.text;
                    }
                }

                const result: ThreadAssistantMessagePart[] = [];
                if (text) {
                    result.push({type: "text", text});
                }
                if (reasoning) {
                    result.push({type: "reasoning", text: reasoning});
                }

                yield {
                    content: result,
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
    const runtime = useLocalRuntime(AgentModelAdapter, {
        adapters: {
            attachments: new CompositeAttachmentAdapter([
                new SimpleImageAttachmentAdapter(),
                new SimpleTextAttachmentAdapter()
            ]),
        }
    });

    return (
        <AssistantRuntimeProvider runtime={runtime}>
            {children}
        </AssistantRuntimeProvider>
    );
}
