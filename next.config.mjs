/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "utfs.io" }, // UploadThing file host
    ],
  },
};

export default nextConfig;
