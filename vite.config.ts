import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";

/**
 * Content Security Policy: the page may only run its own scripts, and may only send data to the
 * contact-form services. Kept to one place and applied at build time only (the dev server relies
 * on inline scripts for hot reload).
 */
const CSP = {
  "default-src": "'self'",
  "script-src": "'self'",
  "style-src": "'self' 'unsafe-inline'", // React style={...} attributes
  "img-src": "'self' data: blob:",
  "font-src": "'self'",
  "connect-src": "'self' https://script.google.com https://script.googleusercontent.com https://formspree.io",
  "object-src": "'none'",
  "base-uri": "'self'",
  "form-action": "'self'",
};
const csp = (extra: Record<string, string> = {}) =>
  Object.entries({ ...CSP, ...extra })
    .map(([k, v]) => (v ? `${k} ${v}` : k))
    .join("; ");

function securityHeaders(): Plugin {
  return {
    name: "security-headers",
    apply: "build",
    // 1. <meta> CSP: works on any static host
    transformIndexHtml: (html) =>
      html.replace(/(<meta charset[^>]*>)/i, `$1\n    <meta http-equiv="Content-Security-Policy" content="${csp()}" />`),
    // 2. real HTTP headers for hosts that read a `_headers` file (Netlify, Cloudflare Pages). Headers can
    //    also set what a meta tag can't: framing protection and HTTPS upgrades.
    generateBundle() {
      this.emitFile({
        type: "asset",
        fileName: "_headers",
        source: [
          "/*",
          `  Content-Security-Policy: ${csp({ "frame-ancestors": "'none'", "upgrade-insecure-requests": "" })}`,
          "  X-Frame-Options: DENY",
          "  X-Content-Type-Options: nosniff",
          "  Referrer-Policy: strict-origin-when-cross-origin",
          "  Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()",
          "  Cross-Origin-Opener-Policy: same-origin",
          "/assets/*",
          "  Cache-Control: public, max-age=31536000, immutable",
          "",
        ].join("\n"),
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), securityHeaders()],
  build: {
    target: "es2020",
    // never inline fonts as data: URIs; they stay cacheable files and the CSP can stay strict (font-src 'self')
    assetsInlineLimit: (file) => (/\.(woff2?|ttf|otf)$/.test(file) ? false : undefined),
    // three.js is ~920 kB on its own; it's split into a lazily loaded chunk on purpose
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        // three.js lives in its own chunk so the page's HTML/CSS never waits on it
        manualChunks: (id) =>
          id.includes("node_modules/three") || id.includes("@react-three") || id.includes("/src/three/canvas") ? "three" : undefined,
      },
    },
  },
});
