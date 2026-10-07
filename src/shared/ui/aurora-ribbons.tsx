import React, { useEffect, useRef } from 'react';
import { useThemeStore } from '@/shared/state/useThemeStore';
import { cn } from '@/shared/lib';

type AuroraRibbonsProps = {
  className?: string;
  /** Number of flowing ribbons (auto-reduced on small screens) */
  ribbonCount?: number;
};

/**
 * Brand aurora ribbons - generative simplex-noise strokes for CTA ambient.
 * Optimized: pauses off-screen / hidden tab, adaptive quality, single-pass path.
 */
export function AuroraRibbons({ className, ribbonCount = 4 }: AuroraRibbonsProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const theme = useThemeStore((s) => s.theme);
  const isDark = theme === 'dark';

  useEffect(() => {
    const container = rootRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const coarse = window.matchMedia('(pointer: coarse)').matches;

    let frameId = 0;
    let running = true;
    let inView = false;
    let pageVisible = document.visibilityState === 'visible';
    let time = 0;
    let mouse = { x: 0.5, y: 0.5, active: false };
    let width = 0;
    let height = 0;
    let dpr = 1;
    let step = 6;
    let ribbons = ribbonCount;
    let resizeTimer = 0;

    const palette = isDark
      ? ['#8b5cf6', '#22d3ee', '#c084fc', '#6366f1']
      : ['#7c3aed', '#0891b2', '#9333ea', '#4f46e5'];

    // Precompute stroke colors (avoid parse every point)
    const glowStops = palette.map((c) => ({
      a: hexAlpha(c, isDark ? 0.28 : 0.18),
      b: hexAlpha(c, isDark ? 0.7 : 0.42),
      c: hexAlpha(c, isDark ? 0.28 : 0.18),
      core: hexAlpha(c, isDark ? 0.5 : 0.35),
      glow: hexAlpha(c, isDark ? 0.45 : 0.28),
    }));
    const whiteCore = hexAlpha('#ffffff', isDark ? 0.4 : 0.18);

    const simplex = createSimplex2D();

    const applyQuality = () => {
      const small = width < 640;
      // Mobile / touch: fewer ribbons, larger step, lower DPR
      ribbons = small || coarse ? Math.min(3, ribbonCount) : ribbonCount;
      step = small || coarse ? 8 : 6;
      dpr = Math.min(window.devicePixelRatio || 1, small || coarse ? 1.25 : 1.75);
    };

    const resize = () => {
      const rect = container.getBoundingClientRect();
      width = Math.max(1, Math.floor(rect.width));
      height = Math.max(1, Math.floor(rect.height));
      applyQuality();
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const scheduleResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(resize, 80);
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!inView || !pageVisible) return;
      const rect = container.getBoundingClientRect();
      const inside =
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom;
      if (!inside) {
        if (mouse.active) mouse = { ...mouse, active: false };
        return;
      }
      mouse = {
        x: (e.clientX - rect.left) / Math.max(rect.width, 1),
        y: (e.clientY - rect.top) / Math.max(rect.height, 1),
        active: true,
      };
    };

    const drawStatic = () => {
      ctx.clearRect(0, 0, width, height);
      const g = ctx.createRadialGradient(
        width * 0.35,
        height * 0.55,
        0,
        width * 0.5,
        height * 0.5,
        Math.max(width, height) * 0.65,
      );
      g.addColorStop(0, isDark ? 'hsla(268, 70%, 55%, 0.28)' : 'hsla(268, 58%, 48%, 0.18)');
      g.addColorStop(0.45, isDark ? 'hsla(190, 80%, 45%, 0.12)' : 'hsla(190, 70%, 40%, 0.08)');
      g.addColorStop(1, 'transparent');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, width, height);
    };

    const buildRibbonPath = (i: number, baseY: number, mx: number, my: number) => {
      ctx.beginPath();
      const complexity = 0.01;
      const amplitude = height * 0.26;
      const pulse = Math.sin(time * 0.55 + i * 1.1) * 0.08 + 0.94;
      const range = width * 0.42;

      for (let x = 0; x <= width; x += step) {
        let influence = 1;
        if (mouse.active) {
          const dx = x - mx;
          const dy = baseY - my;
          const dist = Math.sqrt(dx * dx + dy * dy);
          influence = 1 + (1 - Math.min(1, dist / range)) * 0.45;
        }
        const n = simplex(x * complexity * influence, i * 420 + time);
        const y = baseY + n * amplitude * pulse * influence;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
    };

    const drawFrame = () => {
      if (!running) return;

      if (!inView || !pageVisible) {
        // Sleep while off-screen - wake via IO / visibility handlers
        frameId = 0;
        return;
      }

      ctx.clearRect(0, 0, width, height);

      const wash = ctx.createLinearGradient(0, 0, width, height);
      wash.addColorStop(0, isDark ? 'hsla(270, 55%, 18%, 0.72)' : 'hsla(270, 30%, 96%, 0.32)');
      wash.addColorStop(0.5, isDark ? 'hsla(268, 60%, 22%, 0.55)' : 'hsla(268, 40%, 94%, 0.18)');
      wash.addColorStop(1, isDark ? 'hsla(220, 50%, 16%, 0.68)' : 'hsla(220, 30%, 96%, 0.28)');
      ctx.fillStyle = wash;
      ctx.fillRect(0, 0, width, height);

      time += 0.005;

      const mx = mouse.x * width;
      const my = mouse.y * height;
      // Skip expensive shadowBlur on touch / small screens
      const useGlowBlur = !coarse && width >= 640;

      for (let i = 0; i < ribbons; i += 1) {
        const stops = glowStops[i % glowStops.length];
        const band = (i - (ribbons - 1) / 2) / ribbons;
        const baseY = height * (0.48 + band * 0.4);

        // Soft glow stroke (no shadowBlur on mobile)
        buildRibbonPath(i, baseY, mx, my);
        const glowGrad = ctx.createLinearGradient(0, 0, width, 0);
        glowGrad.addColorStop(0, 'transparent');
        glowGrad.addColorStop(0.18, stops.a);
        glowGrad.addColorStop(0.5, stops.b);
        glowGrad.addColorStop(0.82, stops.c);
        glowGrad.addColorStop(1, 'transparent');
        ctx.strokeStyle = glowGrad;
        ctx.lineWidth = useGlowBlur ? (isDark ? 3 : 2.2) : isDark ? 2.4 : 1.8;
        ctx.shadowBlur = useGlowBlur ? (isDark ? 12 : 7) : 0;
        ctx.shadowColor = useGlowBlur ? stops.glow : 'transparent';
        ctx.stroke();

        // Core - reuse same path math once more (cheap vs shadowBlur)
        buildRibbonPath(i, baseY, mx, my);
        const coreGrad = ctx.createLinearGradient(0, 0, width, 0);
        coreGrad.addColorStop(0, 'transparent');
        coreGrad.addColorStop(0.2, stops.core);
        coreGrad.addColorStop(0.5, whiteCore);
        coreGrad.addColorStop(0.8, stops.core);
        coreGrad.addColorStop(1, 'transparent');
        ctx.strokeStyle = coreGrad;
        ctx.lineWidth = isDark ? 1.15 : 1;
        ctx.shadowBlur = 0;
        ctx.stroke();
      }

      frameId = requestAnimationFrame(drawFrame);
    };

    const ensureLoop = () => {
      if (!running || reduced) return;
      if (inView && pageVisible && frameId === 0) {
        frameId = requestAnimationFrame(drawFrame);
      }
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        inView = Boolean(entry?.isIntersecting);
        if (!inView && frameId) {
          cancelAnimationFrame(frameId);
          frameId = 0;
        } else if (inView) {
          resize();
          if (reduced) drawStatic();
          else ensureLoop();
        }
      },
      { root: null, rootMargin: '80px', threshold: 0.01 },
    );
    io.observe(container);

    const onVisibility = () => {
      pageVisible = document.visibilityState === 'visible';
      if (!pageVisible && frameId) {
        cancelAnimationFrame(frameId);
        frameId = 0;
      } else {
        ensureLoop();
      }
    };

    const ro = new ResizeObserver(scheduleResize);
    ro.observe(container);

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    document.addEventListener('visibilitychange', onVisibility);

    // Wait for layout so the canvas gets real dimensions inside absolute CTA shells
    requestAnimationFrame(() => {
      resize();
      if (reduced) drawStatic();
      else ensureLoop();
    });

    return () => {
      running = false;
      cancelAnimationFrame(frameId);
      window.clearTimeout(resizeTimer);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener('pointermove', onPointerMove);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [isDark, ribbonCount]);

  return (
    <div
      ref={rootRef}
      className={cn('absolute inset-0 z-0 overflow-hidden pointer-events-none', className)}
      aria-hidden
    >
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full block" />
      <div
        className={cn(
          'absolute inset-0 pointer-events-none',
          'bg-[radial-gradient(ellipse_at_center,transparent_42%,hsl(var(--background)/0.38)_100%)]',
        )}
      />
    </div>
  );
}

function hexAlpha(hex: string, alpha: number) {
  const h = hex.replace('#', '');
  const full =
    h.length === 3
      ? h
          .split('')
          .map((c) => c + c)
          .join('')
      : h;
  const n = Number.parseInt(full, 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  return `rgba(${r},${g},${b},${alpha})`;
}

function createSimplex2D() {
  const F2 = 0.5 * (Math.sqrt(3) - 1);
  const G2 = (3 - Math.sqrt(3)) / 6;
  const p = new Uint8Array(256);
  for (let i = 0; i < 256; i += 1) p[i] = i;

  let seed = 0x6a09e667;
  for (let i = 255; i > 0; i -= 1) {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    const j = seed % (i + 1);
    const tmp = p[i];
    p[i] = p[j];
    p[j] = tmp;
  }

  const perm = new Uint8Array(512);
  const perm12 = new Uint8Array(512);
  const grad3 = [
    1, 1, 0, -1, 1, 0, 1, -1, 0, -1, -1, 0, 1, 0, 1, -1, 0, 1, 1, 0, -1, -1, 0, -1, 0, 1, 1, 0, -1,
    1, 0, 1, -1, 0, -1, -1,
  ];
  for (let i = 0; i < 512; i += 1) {
    perm[i] = p[i & 255];
    perm12[i] = perm[i] % 12;
  }

  return (xin: number, yin: number) => {
    let n0 = 0;
    let n1 = 0;
    let n2 = 0;
    const s = (xin + yin) * F2;
    const i = Math.floor(xin + s);
    const j = Math.floor(yin + s);
    const t = (i + j) * G2;
    const X0 = i - t;
    const Y0 = j - t;
    const x0 = xin - X0;
    const y0 = yin - Y0;
    const i1 = x0 > y0 ? 1 : 0;
    const j1 = x0 > y0 ? 0 : 1;
    const x1 = x0 - i1 + G2;
    const y1 = y0 - j1 + G2;
    const x2 = x0 - 1 + 2 * G2;
    const y2 = y0 - 1 + 2 * G2;
    const ii = i & 255;
    const jj = j & 255;

    let t0 = 0.5 - x0 * x0 - y0 * y0;
    if (t0 >= 0) {
      const gi = perm12[ii + perm[jj]];
      t0 *= t0;
      n0 = t0 * t0 * (grad3[gi * 3] * x0 + grad3[gi * 3 + 1] * y0);
    }
    let t1 = 0.5 - x1 * x1 - y1 * y1;
    if (t1 >= 0) {
      const gi = perm12[ii + i1 + perm[jj + j1]];
      t1 *= t1;
      n1 = t1 * t1 * (grad3[gi * 3] * x1 + grad3[gi * 3 + 1] * y1);
    }
    let t2 = 0.5 - x2 * x2 - y2 * y2;
    if (t2 >= 0) {
      const gi = perm12[ii + 1 + perm[jj + 1]];
      t2 *= t2;
      n2 = t2 * t2 * (grad3[gi * 3] * x2 + grad3[gi * 3 + 1] * y2);
    }
    return 70 * (n0 + n1 + n2);
  };
}
