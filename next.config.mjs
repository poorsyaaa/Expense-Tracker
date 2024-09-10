/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: "/settings",
        destination: "/settings/general",
        permanent: false,
      },
    ];
  },
  output: "standalone",
  experimental: {
    serverComponentsExternalPackages: ["@node-rs/argon2"],
  },
};

export default nextConfig;
