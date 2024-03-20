const CUSTOM_ENV = process.env.CUSTOM_ENV || "production";

console.log(
  "=======================",
  process.env.CUSTOM_ENV,
  CUSTOM_ENV,
  "======================"
);

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  publicRuntimeConfig: {
    CUSTOM_ENV,
    API_URL: {
      development: "localhost:3000",
      production: "https://vet-clinic-mrl82q6tr-cjsupans-projects.vercel.app",
    }[CUSTOM_ENV],
  },
};

module.exports = nextConfig;
