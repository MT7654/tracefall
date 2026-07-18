"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function TraceCore3D() {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
    camera.position.z = 6.8;
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
    renderer.setClearColor(0, 0);
    host.appendChild(renderer.domElement);

    const topology = new THREE.Group();
    topology.rotation.set(-0.25, -0.35, 0.08);
    scene.add(topology);
    const addMesh = (geometry: THREE.BufferGeometry, material: THREE.Material) => {
      const mesh = new THREE.Mesh(geometry, material);
      topology.add(mesh);
      return mesh;
    };

    const core = addMesh(new THREE.IcosahedronGeometry(1.18, 2), new THREE.MeshBasicMaterial({ color: 0x42e8c4, wireframe: true, transparent: true, opacity: 0.24 }));
    const shell = addMesh(new THREE.IcosahedronGeometry(1.46, 1), new THREE.MeshBasicMaterial({ color: 0x54b8ff, wireframe: true, transparent: true, opacity: 0.08 }));
    const ringA = addMesh(new THREE.TorusGeometry(1.72, 0.012, 6, 120), new THREE.MeshBasicMaterial({ color: 0x42e8c4, transparent: true, opacity: 0.28 }));
    ringA.rotation.x = Math.PI * 0.56;
    const ringB = addMesh(new THREE.TorusGeometry(2.05, 0.009, 6, 120), new THREE.MeshBasicMaterial({ color: 0x54b8ff, transparent: true, opacity: 0.18 }));
    ringB.rotation.set(Math.PI * 0.28, Math.PI * 0.62, 0.4);

    const route = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-2.3, -1.1, 0.2), new THREE.Vector3(-0.85, 0.45, 0.9),
      new THREE.Vector3(0.7, -0.2, -0.65), new THREE.Vector3(2.2, 1.05, 0.25),
    ]);
    addMesh(new THREE.TubeGeometry(route, 90, 0.022, 6, false), new THREE.MeshBasicMaterial({ color: 0x54b8ff, transparent: true, opacity: 0.72 }));

    const nodeGeometry = new THREE.SphereGeometry(0.105, 16, 16);
    [0, 0.34, 0.67, 1].forEach((position, index) => {
      const node = addMesh(nodeGeometry, new THREE.MeshBasicMaterial({ color: index === 3 ? 0xff5c6c : 0x42e8c4 }));
      node.position.copy(route.getPoint(position));
      if (index === 3) {
        const halo = addMesh(new THREE.SphereGeometry(0.31, 18, 18), new THREE.MeshBasicMaterial({ color: 0xff5c6c, wireframe: true, transparent: true, opacity: 0.32 }));
        halo.name = "failure-halo-3d";
        halo.position.copy(node.position);
      }
    });

    const count = 70;
    const positions = new Float32Array(count * 3);
    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const particles = new THREE.Points(particleGeometry, new THREE.PointsMaterial({ color: 0x42e8c4, size: 0.045, transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending }));
    topology.add(particles);

    const stars = new Float32Array(180 * 3);
    for (let i = 0; i < stars.length; i += 3) {
      stars[i] = (Math.random() - 0.5) * 8;
      stars[i + 1] = (Math.random() - 0.5) * 6;
      stars[i + 2] = (Math.random() - 0.5) * 4;
    }
    const starGeometry = new THREE.BufferGeometry();
    starGeometry.setAttribute("position", new THREE.BufferAttribute(stars, 3));
    scene.add(new THREE.Points(starGeometry, new THREE.PointsMaterial({ color: 0x82959d, size: 0.018, transparent: true, opacity: 0.42 })));

    const pointer = new THREE.Vector2();
    const onPointer = (event: PointerEvent) => {
      pointer.set((event.clientX / innerWidth - 0.5) * 0.32, (event.clientY / innerHeight - 0.5) * 0.22);
    };
    addEventListener("pointermove", onPointer, { passive: true });
    const resize = () => {
      const { width, height } = host.getBoundingClientRect();
      if (!width || !height) return;
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(host);
    resize();

    let visible = true;
    const visibilityObserver = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; }, { threshold: 0.05 });
    visibilityObserver.observe(host);
    const clock = new THREE.Clock();
    let frame = 0;
    const render = () => {
      frame = requestAnimationFrame(render);
      if (!visible) return;
      const time = clock.getElapsedTime();
      if (!reducedMotion) {
        core.rotation.x -= 0.0022; core.rotation.y += 0.003; shell.rotation.y -= 0.0014;
        ringA.rotation.z += 0.0025; ringB.rotation.z -= 0.0015;
        topology.rotation.x += (pointer.y - topology.rotation.x - 0.25) * 0.018;
        topology.rotation.y += (pointer.x - topology.rotation.y - 0.35) * 0.012;
      }
      for (let i = 0; i < count; i++) {
        const point = route.getPoint((i / count + time * 0.075) % 1);
        positions.set([point.x, point.y, point.z], i * 3);
      }
      particleGeometry.attributes.position.needsUpdate = true;
      topology.getObjectByName("failure-halo-3d")?.scale.setScalar(1 + Math.sin(time * 3) * 0.16);
      renderer.render(scene, camera);
    };
    render();

    return () => {
      cancelAnimationFrame(frame); removeEventListener("pointermove", onPointer);
      resizeObserver.disconnect(); visibilityObserver.disconnect();
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh || object instanceof THREE.Points) {
          object.geometry.dispose();
          (Array.isArray(object.material) ? object.material : [object.material]).forEach((material) => material.dispose());
        }
      });
      renderer.dispose(); renderer.domElement.remove();
    };
  }, []);

  return <div className="trace-webgl" ref={hostRef} aria-hidden="true"><span>LIVE 3D · INCIDENT TOPOLOGY</span></div>;
}
