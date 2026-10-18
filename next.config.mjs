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

  // Security headers applied to every response. These don't stop a
  // determined attacker on their own, but they close off several
  // common, cheap attack classes (clickjacking, MIME-sniffing,
  // leaking your site in referrer headers) for free.
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            // Stops your site being embedded in an <iframe> on another
            // site -- the core defense against clickjacking, where an
            // attacker overlays invisible buttons on top of your page.
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            // Stops the browser "guessing" a file's type from its
            // content instead of trusting the declared Content-Type --
            // closes a class of attacks involving disguised file uploads.
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            // Limits how much of your URL leaks to other sites when
            // someone clicks a link away from your site.
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            // Explicitly denies browser features your site never uses,
            // so even an injected script couldn't invoke them.
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
