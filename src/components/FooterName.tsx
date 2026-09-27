import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "../lib";

/**
 * The giant footer name as a window onto flowing code: rows of code and numbers scroll through the
 * letters at different speeds, an accent scan beam sweeps across, and the cursor lights up the
 * glyphs around it. Canvas 2D, only animates while visible.
 */

const SNIPPETS = [
  "import pandas as pd", "df.groupby('provider').sum()", "SELECT * FROM claims WHERE status='open'", "model.fit(X_train, y_train)",
  "0.94", "def automate(report):", "await queue.publish(job)", "r2_score=0.912", "for row in sheet.iter_rows():", "01101001",
  "POST /api/v1/extract", "ocr.read(invoice)", "{ 'status': 'validated' }", "power_automate.run()", "df.dropna()", "=SUMIFS(C:C,A:A,\"Paid\")",
  "claude.messages.create()", "schedule.every().monday", "10110", "fastapi.APIRouter()", "np.mean(errors)", "✓ synced",
];

const ACCENT = "255, 74, 28";

export default function FooterName({ text }: { text: string }) {
  const wrap = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const el = wrap.current!;
    const cvs = canvas.current!;
    const ctx = cvs.getContext("2d")!;
    const reduce = prefersReducedMotion();
    let W = 0, H = 0, dpr = 1, fontPx = 0, baseline = 0;
    let mask: HTMLCanvasElement | null = null;
    let tapes: { img: HTMLCanvasElement; y: number; speed: number; offset: number; w: number }[] = [];
    // gradients are built once per size and positioned with translate() each frame
    let beam: CanvasGradient | null = null;
    let spot: CanvasGradient | null = null;
    let raf = 0, visible = false, last = performance.now(), t = 0;
    const pointer = { x: -9999, y: -9999, active: false };

    const font = (px: number) => `800 ${px}px "Inter Tight Variable", "Inter Tight", system-ui, sans-serif`;

    // Size the text to fill the width, then build the letter mask and the code "tapes".
    const build = () => {
      W = el.clientWidth;
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      ctx.font = font(100);
      if ("letterSpacing" in ctx) (ctx as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = "-6px";
      const m = ctx.measureText(text);
      fontPx = Math.floor((W * 0.96 * 100) / m.width);
      ctx.font = font(fontPx);
      if ("letterSpacing" in ctx) (ctx as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = `${-fontPx * 0.06}px`;
      const mm = ctx.measureText(text);
      const ascent = mm.actualBoundingBoxAscent || fontPx * 0.72;
      H = Math.ceil(ascent + fontPx * 0.04);
      baseline = ascent;
      cvs.width = W * dpr;
      cvs.height = H * dpr;
      cvs.style.height = `${H}px`;

      mask = document.createElement("canvas");
      mask.width = cvs.width;
      mask.height = cvs.height;
      const mc = mask.getContext("2d")!;
      mc.scale(dpr, dpr);
      mc.font = font(fontPx);
      if ("letterSpacing" in mc) (mc as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = `${-fontPx * 0.06}px`;
      mc.textAlign = "center";
      mc.fillStyle = "#fff";
      mc.fillText(text, W / 2, baseline);

      // one pre-rendered strip of code per row; drawing them is just a blit per frame
      const rowH = Math.max(8, Math.round(fontPx / 24));
      const rows = Math.ceil(H / rowH);
      tapes = [];
      for (let r = 0; r < rows; r++) {
        const img = document.createElement("canvas");
        const g = img.getContext("2d")!;
        const fs = rowH * 0.78;
        g.font = `${fs}px "JetBrains Mono", ui-monospace, monospace`;
        let str = "";
        while (g.measureText(str).width < W * 1.2) str += SNIPPETS[(r * 7 + str.length) % SNIPPETS.length] + "   ";
        const w = Math.ceil(g.measureText(str).width);
        img.width = w * dpr;
        img.height = rowH * dpr;
        g.scale(dpr, dpr);
        g.font = `${fs}px "JetBrains Mono", ui-monospace, monospace`;
        g.textBaseline = "middle";
        const hot = r % 5 === 2;
        g.fillStyle = hot ? `rgba(${ACCENT}, 0.95)` : `rgba(242, 241, 237, ${0.55 + ((r * 13) % 7) / 20})`;
        g.fillText(str, 0, rowH / 2);
        tapes.push({ img, y: r * rowH, speed: (18 + ((r * 37) % 60)) * (r % 2 ? 1 : -1), offset: (r * 97) % w, w });
      }
      beam = ctx.createLinearGradient(-220, 0, 220, 0);
      beam.addColorStop(0, `rgba(${ACCENT}, 0)`);
      beam.addColorStop(0.5, `rgba(${ACCENT}, 0.55)`);
      beam.addColorStop(1, `rgba(${ACCENT}, 0)`);
      spot = ctx.createRadialGradient(0, 0, 0, 0, 0, fontPx * 0.9);
      spot.addColorStop(0, `rgba(${ACCENT}, 0.9)`);
      spot.addColorStop(1, `rgba(${ACCENT}, 0)`);
      draw();
    };

    const draw = () => {
      if (!mask) return;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, cvs.width, cvs.height);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // 1. flowing code
      ctx.globalCompositeOperation = "source-over";
      for (const tp of tapes) {
        const x = -(((tp.offset % tp.w) + tp.w) % tp.w);
        ctx.drawImage(tp.img, x, tp.y, tp.w, tp.img.height / dpr);
        ctx.drawImage(tp.img, x + tp.w, tp.y, tp.w, tp.img.height / dpr);
      }
      // 2. scan beam sweeping left to right every ~5s, and the cursor spotlight
      const beamX = ((t % 5) / 5) * (W + 600) - 300;
      ctx.globalCompositeOperation = "lighter";
      ctx.fillStyle = beam!;
      ctx.translate(beamX, 0);
      ctx.fillRect(-220, 0, 440, H);
      ctx.translate(-beamX, 0);
      if (pointer.active) {
        const reach = fontPx * 0.9;
        ctx.fillStyle = spot!;
        ctx.translate(pointer.x, pointer.y);
        ctx.fillRect(-reach, -reach, reach * 2, reach * 2);
        ctx.translate(-pointer.x, -pointer.y);
      }
      // 3. keep only what's inside the letters
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.globalCompositeOperation = "destination-in";
      ctx.drawImage(mask, 0, 0);
      // 4. faint solid letters underneath so the name always reads
      ctx.globalCompositeOperation = "destination-over";
      ctx.globalAlpha = 0.22;
      ctx.drawImage(mask, 0, 0);
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";
    };

    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      t += dt;
      for (const tp of tapes) tp.offset += tp.speed * dt;
      draw();
      raf = visible ? requestAnimationFrame(loop) : 0;
    };

    const start = () => {
      if (reduce || raf || !visible) return;
      last = performance.now();
      raf = requestAnimationFrame(loop);
    };

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible) start();
    });
    io.observe(el);

    const onMove = (e: PointerEvent) => {
      const r = cvs.getBoundingClientRect();
      pointer.x = e.clientX - r.left;
      pointer.y = e.clientY - r.top;
      pointer.active = true;
    };
    const onLeave = () => (pointer.active = false);
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);

    let resizeTimer = 0;
    const ro = new ResizeObserver(() => {
      clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(build, 120);
    });

    // wait for the display + mono fonts so the mask and code use the real typefaces
    Promise.all([document.fonts.load(font(100)), document.fonts.load('12px "JetBrains Mono"')])
      .catch(() => {})
      .then(() => {
        build();
        ro.observe(el);
      });

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      clearTimeout(resizeTimer);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, [text]);

  return (
    <div className="footer__name" ref={wrap} aria-hidden="true">
      <canvas ref={canvas} className="footer__name-canvas" />
    </div>
  );
}
