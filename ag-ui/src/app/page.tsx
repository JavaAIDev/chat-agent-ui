"use client";

import { CopilotChat } from "@copilotkit/react-ui";

export default function CopilotKitPage() {
  return (
    <CopilotChat
      className="h-full"
      instructions="You are a helpful assistant."
    />
  );
}
