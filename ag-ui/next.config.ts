import type { NextConfig } from "next";
import { PHASE_DEVELOPMENT_SERVER } from "next/constants.js";

export default (phase: string): NextConfig => {
  const isDev = phase === PHASE_DEVELOPMENT_SERVER;
  return {
    assetPrefix: isDev ? undefined : "/webjars/ag-ui",
    output: "export",
    distDir: "dist",
    async rewrites() {
      if (!isDev) {
        return [];
      }

      return [
        {
          source: "/agent",
          destination: "http://localhost:8080/agent",
        },
      ];
    },
  };
};
