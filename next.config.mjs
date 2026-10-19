const csp = [
  "default-src 'self'",
  // 'unsafe-inline' here is a deliberate, documented trade-off: a
  // nonce-based CSP (Next.js's own recommended stricter pattern) needs
  // per-request wiring through middleware that I can't verify works
  // without a live build to test against -- getting it wrong would
  // break the whole site's hydration. This is the safe version; ask
  // again (ideally with Claude Code, where it can actually be tested)
  // if you want the stricter nonce-based upgrade later.
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://utfs.io https://*.ufs.sh",
  "font-src 'self' data:",
  // Generous on purpose: UploadThing's browser upload may hit a
  // storage domain beyond utfs.io/ufs.sh depending on your account's
  // region/setup. If uploads break after this ships, check the
  // browser console for a CSP violation message naming the blocked
  // domain, and that domain needs adding here.
  "connect-src 'self' https://*.uploadthing.com https://*.ufs.sh https://utfs.io",
  "frame-ancestors 'none'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "upgrade-insecure-requests",
].join("; ");

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Removes the "X-Powered-By: Next.js" header Next.js sends by
  // default -- no functional purpose, just tells anyone scanning your
  // site exactly which framework (and version, via other fingerprints)
  // to look up known vulnerabilities for.
  poweredByHeader: false,

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
          {
            // Controls which resources (scripts, styles, images,
            // fetch/XHR targets) are allowed to load at all -- the
            // main defense against injected/malicious script execution.
            key: "Content-Security-Policy",
            value: csp,
          },
          {
            // Isolates your page's browsing context from other
            // origins' windows/tabs, closing a class of cross-origin
            // data-leak attacks (XS-Leaks).
            key: "Cross-Origin-Opener-Policy",
            value: "same-origin",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
