import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};

// Habilita o acesso aos bindings da Cloudflare durante `next dev` (útil no futuro p/ admin)
initOpenNextCloudflareForDev();

export default nextConfig;
