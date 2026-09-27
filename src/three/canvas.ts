import type { CanvasProps } from "@react-three/fiber";
import { isLowPower } from "../lib";

/**
 * Renderer settings shared by both WebGL canvases. `active` pauses the render loop entirely
 * (frameloop "never") while the canvas is off-screen.
 */
export function canvasProps(active: boolean): Omit<CanvasProps, "children"> {
  const low = isLowPower();
  return {
    frameloop: active ? "always" : "never",
    dpr: low ? 1 : [1, 1.5],
    gl: { antialias: !low, alpha: true, powerPreference: "high-performance", stencil: false },
    style: { position: "absolute", inset: 0 },
    // shader error checks make the browser finish compiling synchronously: development only
    onCreated: ({ gl }) => {
      gl.debug.checkShaderErrors = import.meta.env.DEV;
    },
  };
}
