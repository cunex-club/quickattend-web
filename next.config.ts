import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import path from "path";

const nextConfig: NextConfig = {
  /* config options here */
  output: "standalone",
  allowedDevOrigins: ["quickattend.cunex.club", "*.quickattend.cunex.club"],
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
