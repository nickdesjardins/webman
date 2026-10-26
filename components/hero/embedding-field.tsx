"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { PerformanceMonitor } from "@react-three/drei";
import { useEffect, useRef, useState, type RefObject } from "react";
import * as THREE from "three";
import { readTonePalette, type Rgb, type TonePalette } from "./color";

/*
 * @react-three/fiber 9 still creates its store clock with THREE.Clock, which three
 * deprecated in r183 (fiber 10 moves to THREE.Timer). This scene only reads
 * useFrame's delta, so drop that one notice and pass every other message through.
 */
THREE.setConsoleFunction((type, message, ...params) => {
  if (message.startsWith("THREE.Clock: This module has been deprecated")) return;
  console[type](message, ...params);
});

export interface PointerState {
  /** Normalised pointer position in [-1, 1], 0 when the pointer is away. */
  x: number;
  y: number;
}

interface EmbeddingFieldProps {
  /** Rendering stops entirely while false (offscreen or hidden tab). */
  active: boolean;
  /** Cluster the highlighted document flies into when a run starts. */
  cluster: number;
  runId: number;
  pointer: RefObject<PointerState>;
}

const POINT_COUNT = 1500;
const FLIGHT_SECONDS = 1.6;

interface ClusterDef {
  center: readonly [number, number, number];
  spread: readonly [number, number, number];
  share: number;
  tone: keyof TonePalette["rgb"];
  alpha: number;
  size: number;
}

/** invoices, emails, receipts, noise */
const CLUSTERS: readonly ClusterDef[] = [
  { center: [-1.9, 0.8, -0.2], spread: [0.55, 0.42, 0.45], share: 0.3, tone: "primary", alpha: 0.8, size: 1.45 },
  { center: [1.75, 1.05, -0.6], spread: [0.5, 0.38, 0.4], share: 0.24, tone: "success", alpha: 0.72, size: 1.35 },
  { center: [-0.55, -1.4, 0.3], spread: [0.45, 0.35, 0.4], share: 0.2, tone: "warning", alpha: 0.72, size: 1.35 },
  { center: [1.35, -0.95, 0.1], spread: [1.35, 0.95, 1.0], share: 0.26, tone: "muted", alpha: 0.32, size: 1.1 },
];

const VERTEX = /* glsl */ `
  attribute float aSize;
  attribute float aAlpha;
  attribute vec3 aColor;
  uniform float uPixelRatio;
  uniform float uScale;
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    vColor = aColor;
    vAlpha = aAlpha;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = aSize * uPixelRatio * (uScale / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const FRAGMENT = /* glsl */ `
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    float d = length(gl_PointCoord - 0.5) * 2.0;
    float a = smoothstep(1.0, 0.12, d);
    gl_FragColor = vec4(vColor, a * a * vAlpha);
  }
`;

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function gaussian(random: () => number) {
  const u = Math.max(random(), 1e-6);
  const v = random();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

function makeMaterial(): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    vertexShader: VERTEX,
    fragmentShader: FRAGMENT,
    uniforms: { uPixelRatio: { value: 1 }, uScale: { value: 26 } },
    transparent: true,
    depthWrite: false,
    depthTest: false,
    blending: THREE.AdditiveBlending,
  });
}

interface Cloud {
  points: THREE.Points;
  geometry: THREE.BufferGeometry;
  material: THREE.ShaderMaterial;
  position: THREE.BufferAttribute;
  color: THREE.BufferAttribute;
  size: THREE.BufferAttribute;
}

function makeCloud(count: number): Cloud {
  const geometry = new THREE.BufferGeometry();
  const position = new THREE.BufferAttribute(new Float32Array(count * 3), 3);
  const color = new THREE.BufferAttribute(new Float32Array(count * 3), 3);
  const size = new THREE.BufferAttribute(new Float32Array(count), 1);
  const alpha = new THREE.BufferAttribute(new Float32Array(count).fill(1), 1);
  position.setUsage(THREE.DynamicDrawUsage);
  geometry.setAttribute("position", position);
  geometry.setAttribute("aColor", color);
  geometry.setAttribute("aSize", size);
  geometry.setAttribute("aAlpha", alpha);
  const material = makeMaterial();
  const points = new THREE.Points(geometry, material);
  points.frustumCulled = false;
  return { points, geometry, material, position, color, size };
}

interface FieldObjects {
  group: THREE.Group;
  cloud: Cloud;
  highlight: Cloud;
  homes: Float32Array;
  velocities: Float32Array;
  seeds: Float32Array;
  palette: TonePalette;
  flight: { from: THREE.Vector3; to: THREE.Vector3; startTime: number };
  rotation: { x: number; y: number };
  time: number;
}

function buildField(palette: TonePalette): FieldObjects {
  const random = mulberry32(2026);
  const cloud = makeCloud(POINT_COUNT);
  const homes = new Float32Array(POINT_COUNT * 3);
  const velocities = new Float32Array(POINT_COUNT * 3);
  const seeds = new Float32Array(POINT_COUNT);
  const positions = cloud.position.array as Float32Array;
  const colors = cloud.color.array as Float32Array;
  const sizes = cloud.size.array as Float32Array;
  const alphas = (cloud.geometry.getAttribute("aAlpha") as THREE.BufferAttribute).array as Float32Array;

  let index = 0;
  CLUSTERS.forEach((cluster, clusterIndex) => {
    const isLast = clusterIndex === CLUSTERS.length - 1;
    const count = isLast ? POINT_COUNT - index : Math.round(POINT_COUNT * cluster.share);
    const rgb: Rgb = palette.rgb[cluster.tone];
    for (let n = 0; n < count && index < POINT_COUNT; n += 1, index += 1) {
      const i3 = index * 3;
      const x = cluster.center[0] + gaussian(random) * cluster.spread[0];
      const y = cluster.center[1] + gaussian(random) * cluster.spread[1];
      const z = cluster.center[2] + gaussian(random) * cluster.spread[2];
      homes[i3] = x;
      homes[i3 + 1] = y;
      homes[i3 + 2] = z;
      positions[i3] = x;
      positions[i3 + 1] = y;
      positions[i3 + 2] = z;
      const shade = 0.75 + random() * 0.35;
      colors[i3] = rgb[0] * shade;
      colors[i3 + 1] = rgb[1] * shade;
      colors[i3 + 2] = rgb[2] * shade;
      sizes[index] = cluster.size * (0.7 + random() * 0.7);
      alphas[index] = cluster.alpha * (0.6 + random() * 0.4);
      seeds[index] = random();
    }
  });

  const highlight = makeCloud(2);
  const hs = highlight.size.array as Float32Array;
  hs[0] = 4.6;
  hs[1] = 12;
  const ha = (highlight.geometry.getAttribute("aAlpha") as THREE.BufferAttribute).array as Float32Array;
  ha[0] = 1;
  ha[1] = 0.35;

  const group = new THREE.Group();
  group.add(cloud.points);
  group.add(highlight.points);

  return {
    group,
    cloud,
    highlight,
    homes,
    velocities,
    seeds,
    palette,
    flight: { from: new THREE.Vector3(), to: new THREE.Vector3(), startTime: -10 },
    rotation: { x: 0, y: 0 },
    time: 0,
  };
}

function disposeField(field: FieldObjects) {
  field.cloud.geometry.dispose();
  field.cloud.material.dispose();
  field.highlight.geometry.dispose();
  field.highlight.material.dispose();
}

interface FieldProps {
  cluster: number;
  runId: number;
  pointer: RefObject<PointerState>;
}

/** Imperative scene content: no JSX three elements, all mutation behind a ref. */
function Field({ cluster, runId, pointer }: FieldProps) {
  const scene = useThree((state) => state.scene);
  const gl = useThree((state) => state.gl);
  const fieldRef = useRef<FieldObjects | null>(null);

  useEffect(() => {
    const field = buildField(readTonePalette(gl.domElement));
    fieldRef.current = field;
    scene.add(field.group);
    return () => {
      scene.remove(field.group);
      disposeField(field);
      fieldRef.current = null;
    };
  }, [scene, gl]);

  // A new run sends one highlighted document from the edge into its cluster.
  useEffect(() => {
    const field = fieldRef.current;
    if (!field) return;
    const def = CLUSTERS[cluster] ?? CLUSTERS[0];
    const random = mulberry32(runId * 7919 + cluster);
    const to = field.flight.to;
    to.set(
      def.center[0] + gaussian(random) * def.spread[0] * 0.5,
      def.center[1] + gaussian(random) * def.spread[1] * 0.5,
      def.center[2] + gaussian(random) * def.spread[2] * 0.5
    );
    const outward = to.clone().setZ(0).normalize();
    if (outward.lengthSq() < 0.5) outward.set(1, 0, 0);
    field.flight.from.copy(outward.multiplyScalar(4.8)).setZ(1.2);
    field.flight.startTime = field.time;

    const rgb = field.palette.rgb[def.tone];
    const fg = field.palette.rgb.foreground;
    const colors = field.highlight.color.array as Float32Array;
    for (let i = 0; i < 2; i += 1) {
      const mix = i === 0 ? 0.55 : 0.15;
      colors[i * 3] = rgb[0] + (fg[0] - rgb[0]) * mix;
      colors[i * 3 + 1] = rgb[1] + (fg[1] - rgb[1]) * mix;
      colors[i * 3 + 2] = rgb[2] + (fg[2] - rgb[2]) * mix;
    }
    field.highlight.color.needsUpdate = true;
  }, [runId, cluster]);

  useFrame((state, delta) => {
    const field = fieldRef.current;
    if (!field) return;
    const dt = Math.min(delta, 0.05);
    field.time += dt;
    const t = field.time;

    const positions = field.cloud.position.array as Float32Array;
    const { homes, velocities, seeds } = field;
    const spring = 0.9;
    const damping = Math.exp(-1.6 * dt);
    const wander = 0.32;
    for (let i = 0; i < POINT_COUNT; i += 1) {
      const i3 = i * 3;
      const s = seeds[i] * 6.2832;
      const fx = Math.sin(t * 0.7 + s) * wander;
      const fy = Math.cos(t * 0.6 + s * 2.0) * wander;
      const fz = Math.sin(t * 0.5 + s * 0.5) * wander * 0.6;
      velocities[i3] = (velocities[i3] + ((homes[i3] - positions[i3]) * spring + fx) * dt) * damping;
      velocities[i3 + 1] =
        (velocities[i3 + 1] + ((homes[i3 + 1] - positions[i3 + 1]) * spring + fy) * dt) * damping;
      velocities[i3 + 2] =
        (velocities[i3 + 2] + ((homes[i3 + 2] - positions[i3 + 2]) * spring + fz) * dt) * damping;
      positions[i3] += velocities[i3] * dt;
      positions[i3 + 1] += velocities[i3 + 1] * dt;
      positions[i3 + 2] += velocities[i3 + 2] * dt;
    }
    field.cloud.position.needsUpdate = true;

    const p = pointer.current;
    const targetY = t * 0.045 + (p?.x ?? 0) * 0.28;
    const targetX = (p?.y ?? 0) * 0.16;
    const k = 1 - Math.exp(-dt * 3);
    field.rotation.y += (targetY - field.rotation.y) * k;
    field.rotation.x += (targetX - field.rotation.x) * k;
    field.group.rotation.set(field.rotation.x, field.rotation.y, 0);

    const { from, to, startTime } = field.flight;
    const progress = Math.min(1, Math.max(0, (t - startTime) / FLIGHT_SECONDS));
    const eased = 1 - Math.pow(1 - progress, 3);
    const arc = Math.sin(Math.PI * eased) * 0.7;
    const bob = Math.sin(t * 2.2) * 0.04 * progress;
    const hx = from.x + (to.x - from.x) * eased;
    const hy = from.y + (to.y - from.y) * eased + arc + bob;
    const hz = from.z + (to.z - from.z) * eased;
    const hp = field.highlight.position.array as Float32Array;
    hp[0] = hx;
    hp[1] = hy;
    hp[2] = hz;
    hp[3] = hx;
    hp[4] = hy;
    hp[5] = hz;
    field.highlight.position.needsUpdate = true;
    const pulse = 1 + 0.18 * Math.sin(t * 4);
    const hs = field.highlight.size.array as Float32Array;
    hs[0] = 4.6 * pulse;
    hs[1] = 12 * pulse * (0.6 + 0.4 * progress);
    field.highlight.size.needsUpdate = true;

    const ratio = state.gl.getPixelRatio();
    field.cloud.material.uniforms.uPixelRatio.value = ratio;
    field.highlight.material.uniforms.uPixelRatio.value = ratio;
  });

  return null;
}

/**
 * Ambient "embedding space" behind the pipeline: 1500 additive points in
 * four soft clusters with gentle drift, slow rotation, pointer parallax and
 * one highlighted document flying into the cluster of the active scenario.
 */
export default function EmbeddingField({ active, cluster, runId, pointer }: EmbeddingFieldProps) {
  const [dpr, setDpr] = useState<number | [number, number]>([1, 1.5]);

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 mask-fade-edges">
      <Canvas
        frameloop={active ? "always" : "never"}
        dpr={dpr}
        gl={{
          antialias: false,
          powerPreference: "high-performance",
          alpha: true,
          depth: false,
          stencil: false,
        }}
        camera={{ position: [0, 0, 6.4], fov: 42, near: 0.5, far: 40 }}
        onCreated={({ gl }) => {
          gl.setClearAlpha(0);
        }}
      >
        <PerformanceMonitor
          flipflops={2}
          onDecline={() => setDpr(1)}
          onIncline={() => setDpr([1, 1.5])}
          onFallback={() => setDpr(1)}
        />
        <Field cluster={cluster} runId={runId} pointer={pointer} />
      </Canvas>
    </div>
  );
}
