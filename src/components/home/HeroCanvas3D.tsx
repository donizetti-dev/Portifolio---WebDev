import React, { useEffect, useRef } from 'react';
import { useTheme } from '../../context/ThemeContext';
import styles from './HeroCanvas3D.module.css';

interface Point3D {
  x: number;
  y: number;
  z: number;
}

// Geometria procedural leve (< 4 KB): Icosaedro Técnico + Núcleo Octaédrico
const PHI = (1 + Math.sqrt(5)) / 2;

const RAW_VERTICES: Point3D[] = [
  { x: -1, y: PHI, z: 0 },
  { x: 1, y: PHI, z: 0 },
  { x: -1, y: -PHI, z: 0 },
  { x: 1, y: -PHI, z: 0 },
  { x: 0, y: -1, z: PHI },
  { x: 0, y: 1, z: PHI },
  { x: 0, y: -1, z: -PHI },
  { x: 0, y: 1, z: -PHI },
  { x: PHI, y: 0, z: -1 },
  { x: PHI, y: 0, z: 1 },
  { x: -PHI, y: 0, z: -1 },
  { x: -PHI, y: 0, z: 1 },
  // Vértices internos do núcleo de automação
  { x: 0, y: 0.78, z: 0 },
  { x: 0, y: -0.78, z: 0 },
  { x: 0.78, y: 0, z: 0 },
  { x: -0.78, y: 0, z: 0 },
  { x: 0, y: 0, z: 0.78 },
  { x: 0, y: 0, z: -0.78 },
];

const EDGES: [number, number][] = [
  // Arestas externas do icosaedro
  [0, 11],
  [0, 5],
  [0, 1],
  [0, 7],
  [0, 10],
  [1, 5],
  [5, 11],
  [11, 10],
  [10, 7],
  [7, 1],
  [3, 9],
  [3, 4],
  [3, 2],
  [3, 6],
  [3, 8],
  [4, 9],
  [2, 4],
  [6, 2],
  [8, 6],
  [9, 8],
  [4, 5],
  [2, 11],
  [6, 10],
  [8, 7],
  [9, 1],
  [4, 11],
  [2, 10],
  [6, 7],
  [8, 1],
  [9, 5],
  // Conexões internas do núcleo
  [12, 14],
  [12, 15],
  [12, 16],
  [12, 17],
  [13, 14],
  [13, 15],
  [13, 16],
  [13, 17],
  [14, 16],
  [16, 15],
  [15, 17],
  [17, 14],
];

export const HeroCanvas3D: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) {
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return;
    }

    const reducedMotionQuery =
      typeof window.matchMedia === 'function'
        ? window.matchMedia('(prefers-reduced-motion: reduce)')
        : null;

    let prefersReducedMotion = reducedMotionQuery?.matches ?? false;
    let isVisible = true;
    let animationFrameId: number | null = null;

    let angleX = 0.35;
    let angleY = 0.55;
    let targetPointerX = 0;
    let targetPointerY = 0;
    let scrollOffset = 0;

    const resizeCanvas = () => {
      const rect = container.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.floor(rect.width * dpr));
      canvas.height = Math.max(1, Math.floor(rect.height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resizeCanvas();

    const drawFrame = () => {
      const rect = container.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;

      ctx.clearRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;
      const radiusScale = Math.min(width, height) * 0.25;

      const isDark = theme === 'dark';
      const primaryWireColor = isDark ? 'rgba(255, 255, 255, 0.28)' : 'rgba(10, 10, 10, 0.28)';
      const coreWireColor = isDark ? 'rgba(56, 189, 248, 0.55)' : 'rgba(0, 102, 255, 0.48)';
      const electricNodeColor = isDark ? '#00FF87' : '#0066FF';
      const secondaryNodeColor = isDark ? '#38BDF8' : '#0A0A0A';

      // Anéis técnicos orbitais de fundo
      ctx.save();
      ctx.strokeStyle = isDark ? 'rgba(255, 255, 255, 0.07)' : 'rgba(10, 10, 10, 0.08)';
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 6]);
      ctx.beginPath();
      ctx.arc(centerX, centerY, radiusScale * 1.45, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.restore();

      const cosX = Math.cos(angleX + scrollOffset * 0.4 + targetPointerY * 0.45);
      const sinX = Math.sin(angleX + scrollOffset * 0.4 + targetPointerY * 0.45);
      const cosY = Math.cos(angleY + scrollOffset * 0.65 + targetPointerX * 0.45);
      const sinY = Math.sin(angleY + scrollOffset * 0.65 + targetPointerX * 0.45);

      const projected = RAW_VERTICES.map((vertex) => {
        // Rotação em Y
        const x1 = vertex.x * cosY - vertex.z * sinY;
        const z1 = vertex.z * cosY + vertex.x * sinY;
        // Rotação em X
        const y2 = vertex.y * cosX - z1 * sinX;
        const z2 = z1 * cosX + vertex.y * sinX;

        const perspective = 3.8 / (3.8 - z2 * 0.55);
        return {
          x: centerX + x1 * radiusScale * perspective,
          y: centerY + y2 * radiusScale * perspective,
          z: z2,
          scale: perspective,
        };
      });

      // Desenha arestas
      for (let i = 0; i < EDGES.length; i += 1) {
        const [startIdx, endIdx] = EDGES[i];
        const p1 = projected[startIdx];
        const p2 = projected[endIdx];
        const isCoreEdge = startIdx >= 12 || endIdx >= 12;

        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.strokeStyle = isCoreEdge ? coreWireColor : primaryWireColor;
        ctx.lineWidth = isCoreEdge ? 1.25 : 1;
        ctx.stroke();
      }

      // Desenha nós / vértices
      for (let i = 0; i < projected.length; i += 1) {
        const pt = projected[i];
        const isCoreNode = i >= 12;
        const nodeRadius = Math.max(1.8, (isCoreNode ? 3.1 : 2.4) * pt.scale * 0.85);

        ctx.beginPath();
        ctx.arc(pt.x, pt.y, nodeRadius, 0, Math.PI * 2);
        ctx.fillStyle = isCoreNode ? electricNodeColor : secondaryNodeColor;
        ctx.fill();
      }
    };

    const tick = () => {
      if (!prefersReducedMotion && isVisible) {
        angleX += 0.0032;
        angleY += 0.0054;
        drawFrame();
        animationFrameId = window.requestAnimationFrame(tick);
      }
    };

    const handleScroll = () => {
      scrollOffset = window.scrollY * 0.0018;
      if (prefersReducedMotion && isVisible) {
        drawFrame();
      }
    };

    const handlePointerMove = (event: MouseEvent) => {
      if (prefersReducedMotion) {
        return;
      }
      const rect = container.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) {
        return;
      }
      const relX = (event.clientX - rect.left) / rect.width - 0.5;
      const relY = (event.clientY - rect.top) / rect.height - 0.5;
      targetPointerX = Math.max(-0.6, Math.min(0.6, relX));
      targetPointerY = Math.max(-0.6, Math.min(0.6, relY));
    };

    const handlePointerLeave = () => {
      targetPointerX = 0;
      targetPointerY = 0;
    };

    const handleMotionChange = (event: MediaQueryListEvent) => {
      prefersReducedMotion = event.matches;
      if (prefersReducedMotion) {
        if (animationFrameId !== null) {
          window.cancelAnimationFrame(animationFrameId);
          animationFrameId = null;
        }
        drawFrame();
      } else if (isVisible && animationFrameId === null) {
        animationFrameId = window.requestAnimationFrame(tick);
      }
    };

    const observer =
      typeof IntersectionObserver !== 'undefined'
        ? new IntersectionObserver(
            (entries) => {
              const entry = entries[0];
              isVisible = Boolean(entry?.isIntersecting);
              if (isVisible) {
                if (prefersReducedMotion) {
                  drawFrame();
                } else if (animationFrameId === null) {
                  animationFrameId = window.requestAnimationFrame(tick);
                }
              } else if (animationFrameId !== null) {
                window.cancelAnimationFrame(animationFrameId);
                animationFrameId = null;
              }
            },
            { threshold: 0.05 }
          )
        : null;

    observer?.observe(container);
    window.addEventListener('resize', resizeCanvas, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });
    container.addEventListener('mousemove', handlePointerMove, { passive: true });
    container.addEventListener('mouseleave', handlePointerLeave, { passive: true });
    reducedMotionQuery?.addEventListener('change', handleMotionChange);

    // Render inicial imediato (evita flash em branco ou CLS)
    drawFrame();
    if (!prefersReducedMotion) {
      animationFrameId = window.requestAnimationFrame(tick);
    }

    return () => {
      observer?.disconnect();
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('scroll', handleScroll);
      container.removeEventListener('mousemove', handlePointerMove);
      container.removeEventListener('mouseleave', handlePointerLeave);
      reducedMotionQuery?.removeEventListener('change', handleMotionChange);
      if (animationFrameId !== null) {
        window.cancelAnimationFrame(animationFrameId);
      }
    };
  }, [theme]);

  return (
    <div
      ref={containerRef}
      className={styles.wrapper}
      role="img"
      aria-label="Malha geométrica 3D interativa representando engenharia de automação e arquitetura de software"
    >
      <div className={styles.hudTop}>
        <span className={styles.statusDot}>
          <span className={styles.pulse} aria-hidden="true" />
          SYS.MESH // RPA-CORE
        </span>
        <span className={styles.cornerMark}>[3D.WIREFRAME]</span>
      </div>

      <canvas ref={canvasRef} className={styles.canvas} />

      <div className={styles.hudBottom}>
        <span>MV3 • FIAP</span>
        <span>PY • SQL • TS</span>
      </div>
    </div>
  );
};

export default HeroCanvas3D;
