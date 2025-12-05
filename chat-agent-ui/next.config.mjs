/** @type {import('next').NextConfig} */
import {PHASE_DEVELOPMENT_SERVER} from 'next/constants.js'

export default (phase) => {
    const isDev = phase === PHASE_DEVELOPMENT_SERVER
    return {
        assetPrefix: isDev ? undefined : '/webjars/chat-agent-ui',
        output: "export",
        distDir: "dist",
        async rewrites() {
            if (!isDev) {
                return [];
            }

            return [
                {
                    source: "/chat",
                    destination: "http://localhost:8080/chat",
                },
            ];
        }
    }
}