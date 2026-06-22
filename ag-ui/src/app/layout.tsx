import type { Metadata } from "next";

import AgentProvider from "@/components/AgentProvider";
import "./globals.css";
import "@copilotkit/react-ui/styles.css";

export const metadata: Metadata = {
  title: "AG-UI Agent",
  description: "AG-UI Agent",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
      <body className={"antialiased"}>
        <AgentProvider>
          {children}
        </AgentProvider>
      </body>
    </html>
  );
}
