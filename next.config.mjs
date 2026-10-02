/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // UploadThing has used both of these hostnames across SDK
      // versions (legacy "utfs.io" and the newer per-app "ufs.sh"
      // subdomain). Both are allowed here so image loading doesn't
      // silently break on whichever one your account actually uses --
      // check your uploaded file URLs in the Media Library if images
      // don't appear, and trim this list to match once confirmed.
      { protocol: "https", hostname: "utfs.io" },
      { protocol: "https", hostname: "*.ufs.sh" },
    ],
  },
};

export default nextConfig;
