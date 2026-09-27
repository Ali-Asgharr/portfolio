import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { canvasProps } from "./canvas";
import { makeLogoTexture } from "./logoTextures";
import { isLowPower } from "../lib";

/**
 * Tech-stack "ball pit": logo spheres pulled towards the centre, colliding with each other and pushed
 * around by the cursor. The physics is ~60 lines of plain maths (sphere to sphere impulses) instead of a
 * multi-megabyte wasm physics engine.
 */

type Ball = { pos: THREE.Vector3; vel: THREE.Vector3; r: number; mesh: THREE.Mesh | null; tilt: number };

const SIZES = [0.7, 1, 0.8, 1, 1, 0.9];
const POINTER_R = 1.8;
const CENTER = new THREE.Vector3(0, -1.6, 0); // pile settles below the section title

function Balls({ slugs, count }: { slugs: readonly string[]; count: number }) {
  const { viewport, pointer, camera, size } = useThree();

  // pull the camera back on portrait screens so the pile fits the width
  useEffect(() => {
    const aspect = size.width / size.height;
    camera.position.z = aspect < 0.7 ? 34 : aspect < 1.1 ? 26 : 20;
    camera.updateProjectionMatrix();
  }, [camera, size]);

  const geometry = useMemo(() => new THREE.SphereGeometry(1, 32, 24), []);
  const materials = useMemo(
    () =>
      slugs.map((s) => {
        const map = makeLogoTexture(s);
        return new THREE.MeshStandardMaterial({ map, emissiveMap: map, emissive: "#ffffff", emissiveIntensity: 0.28, roughness: 0.42, metalness: 0.08 });
      }),
    [slugs]
  );
  useEffect(
    () => () => {
      geometry.dispose();
      materials.forEach((m) => (m.map?.dispose(), m.dispose()));
    },
    [geometry, materials]
  );

  const balls = useMemo<Ball[]>(
    () =>
      Array.from({ length: count }, (_, i) => ({
        pos: new THREE.Vector3((Math.random() - 0.5) * 20, -12 - Math.random() * 14, (Math.random() - 0.5) * 6),
        vel: new THREE.Vector3(),
        r: SIZES[i % SIZES.length],
        mesh: null,
        tilt: (Math.random() - 0.5) * 0.6,
      })),
    [count]
  );

  const ptr = useRef(new THREE.Vector3(99, 99, 0));
  const ptrPrev = useRef(new THREE.Vector3());
  const tmp = useMemo(() => new THREE.Vector3(), []);

  useFrame((_, rawDt) => {
    const dt = Math.min(rawDt, 1 / 30);
    ptrPrev.current.copy(ptr.current);
    ptr.current.lerp(tmp.set((pointer.x * viewport.width) / 2, (pointer.y * viewport.height) / 2, 0), 0.25);
    const ptrVel = ptrPrev.current.sub(ptr.current).multiplyScalar(-1 / Math.max(dt, 1e-3));

    // 1. attraction to centre (stronger vertically, like gravity into a bowl) + damping
    for (const b of balls) {
      tmp.copy(b.pos).sub(CENTER).normalize();
      b.vel.x -= tmp.x * 14 * dt;
      b.vel.y -= tmp.y * 30 * dt;
      b.vel.z -= tmp.z * 14 * dt + b.pos.z * 2 * dt;
      b.vel.multiplyScalar(Math.exp(-1.6 * dt));
      b.pos.addScaledVector(b.vel, dt);
    }

    // 2. resolve collisions (a couple of passes keeps the pile stable)
    for (let pass = 0; pass < 2; pass++) {
      for (let i = 0; i < balls.length; i++) {
        const a = balls[i];
        for (let j = i + 1; j < balls.length; j++) {
          const b = balls[j];
          tmp.subVectors(b.pos, a.pos);
          const min = a.r + b.r;
          const d2 = tmp.lengthSq();
          if (d2 >= min * min || d2 === 0) continue;
          const d = Math.sqrt(d2);
          tmp.divideScalar(d);
          const overlap = (min - d) / 2;
          a.pos.addScaledVector(tmp, -overlap);
          b.pos.addScaledVector(tmp, overlap);
          const rel = b.vel.dot(tmp) - a.vel.dot(tmp);
          if (rel < 0) {
            const imp = -rel * 0.65;
            a.vel.addScaledVector(tmp, -imp);
            b.vel.addScaledVector(tmp, imp);
          }
        }
        // pointer: an immovable sphere that also transfers its own motion
        tmp.subVectors(a.pos, ptr.current);
        const min = a.r + POINTER_R;
        const d2 = tmp.lengthSq();
        if (d2 < min * min && d2 > 0) {
          const d = Math.sqrt(d2);
          tmp.divideScalar(d);
          a.pos.addScaledVector(tmp, min - d);
          const into = a.vel.dot(tmp);
          if (into < 0) a.vel.addScaledVector(tmp, -into * 1.4);
          a.vel.addScaledVector(ptrVel, 0.04);
        }
      }
    }

    // 3. sync meshes; balls keep their logo roughly facing the camera, leaning with velocity
    for (const b of balls) {
      if (!b.mesh) continue;
      b.mesh.position.copy(b.pos);
      b.mesh.rotation.set(-b.vel.y * 0.04 + b.tilt * 0.3, b.vel.x * 0.05 + b.tilt, b.tilt * 0.4);
    }
  });

  return (
    <>
      {balls.map((b, i) => (
        <mesh
          key={i}
          ref={(m) => {
            b.mesh = m;
          }}
          geometry={geometry}
          material={materials[i % materials.length]}
          scale={b.r}
        />
      ))}
    </>
  );
}

export default function BallPit({ slugs, active }: { slugs: readonly string[]; active: boolean }) {
  const count = isLowPower() ? Math.min(slugs.length, 18) : Math.max(slugs.length, 30);
  return (
    <Canvas {...canvasProps(active)} camera={{ position: [0, 0, 20], fov: 32.5, near: 1, far: 60 }}>
      <ambientLight intensity={0.9} />
      <directionalLight position={[10, 14, 18]} intensity={2.2} />
      <directionalLight position={[-12, -4, 6]} intensity={0.6} color="#9fb6ff" />
      <directionalLight position={[0, 6, -10]} intensity={2} color="#ff4a1c" />
      <Balls slugs={slugs} count={count} />
    </Canvas>
  );
}
