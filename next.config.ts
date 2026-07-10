import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  /* config options here */
  output: "standalone",
  allowedDevOrigins: ["quickattend.cunex.club", "*.quickattend.cunex.club"],
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
