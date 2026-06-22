"use client"

import { HttpAgent } from "@ag-ui/client";
import { CopilotKit } from "@copilotkit/react-core";

export default function AgentProvider({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const agent = new HttpAgent({
        url: "/agent",
    });
    return (
        <CopilotKit agents__unsafe_dev_only={{ "default": agent }} enableInspector={false}>
            {children}
        </CopilotKit>
    )
}