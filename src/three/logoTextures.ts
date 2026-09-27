import * as THREE from "three";
import { getIcon } from "../data/icons";

const luminance = (hex: string) => {
  const n = parseInt(hex, 16);
  return (0.299 * ((n >> 16) & 255) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255)) / 255;
};
const isWhite = (c?: string) => !!c && /^#f{3}(f{3})?$/i.test(c);

/**
 * Paints a brand-coloured equirectangular texture with the logo at the sphere's front (u = 0.25)
 * and back (u = 0.75), drawn from the same path data as the SVG chips. On the ball the mark is
 * single-colour: white details inside custom icons are "knocked out" to the ball colour.
 */
export function makeLogoTexture(slug: string): THREE.CanvasTexture {
  const icon = getIcon(slug);
  const hex = "brand" in icon ? icon.brand.hex : icon.custom.hex;
  const bg = `#${hex}`;
  const fg = luminance(hex) > 0.62 ? "#111111" : "#ffffff";
  const W = 512, H = 256, S = 84;
  const c = document.createElement("canvas");
  c.width = W;
  c.height = H;
  const ctx = c.getContext("2d")!;
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  for (const cx of [W * 0.25, W * 0.75]) {
    ctx.save();
    ctx.translate(cx - S / 2, H / 2 - S / 2);
    ctx.scale(S / 24, S / 24);
    if ("brand" in icon) {
      ctx.fillStyle = fg;
      ctx.fill(new Path2D(icon.brand.path));
    } else {
      ctx.lineCap = ctx.lineJoin = "round";
      for (const p of icon.custom.parts) {
        const color = isWhite(p.fill ?? p.stroke) ? bg : fg;
        const path = new Path2D(p.d);
        ctx.globalAlpha = p.opacity ?? 1;
        if (p.fill) {
          ctx.fillStyle = color;
          ctx.fill(path);
        }
        if (p.stroke) {
          ctx.strokeStyle = color;
          ctx.lineWidth = p.width ?? 1;
          ctx.stroke(path);
        }
      }
    }
    ctx.restore();
  }
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}
