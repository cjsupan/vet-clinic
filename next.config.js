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
  publicRuntimeConfig: {},
};

module.exports = nextConfig;
