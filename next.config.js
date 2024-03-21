const CUSTOM_ENV = process.env.NODE_ENV || "production";

console.log(
  "=======================",
  process.env.NODE_ENV,
  CUSTOM_ENV,
  "======================"
);

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  publicRuntimeConfig: {
    CUSTOM_ENV,
    API_URL: {
      development: "http://localhost:3000",
      production: "vet-clinic-swart.vercel.app",
    }[CUSTOM_ENV],
  },
};

module.exports = nextConfig;
