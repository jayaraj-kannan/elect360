import type { NextConfig } from "next";
import withSerwistInit from "@serwist/next";

const withSerwist = withSerwistInit({
  swSrc: "src/app/sw.ts",
  swDest: "public/sw.js",
  disable: process.env.NODE_ENV === "development",
});

const nextConfig: NextConfig = {
  output: "standalone",
  turbopack: {
    // Explicitly set the workspace root to prevent Turbopack from scanning
    // up to the home directory if a stray package-lock.json exists there.
    root: process.cwd(),
  },
  // other options
};

export default withSerwist(nextConfig);
