import { useRef, useEffect, useCallback } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
  opacity: number;
}

const BRAND_COLORS = [
  'rgba(91, 58, 140, ', // amethyst
  'rgba(75, 42, 120, ', // deep violet
  'rgba(167, 139, 250, ', // soft lilac (light-friendly)
  'rgba(196, 181, 253, ', // pale violet
  'rgba(180, 180, 190, ', // silver
];

const MAX_PARTICLES = 40; // Reduced from 60 for better performance

export const MouseParticles = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: -100, y: -100, active: false });
  const animFrameRef = useRef<number>(0);
  const lastSpawnRef = useRef(0);
  const isAnimatingRef = useRef(false);

  const spawnParticles = useCallback((x: number, y: number) => {
    const now = Date.now();
    if (now - lastSpawnRef.current < 16) return;
    lastSpawnRef.current = now;

    const count = 1 + Math.floor(Math.random() * 2);
    for (let i = 0; i < count; i++) {
      if (particlesRef.current.length >= MAX_PARTICLES) {
        particlesRef.current.shift();
      }
      const angle = Math.random() * Math.PI * 2;
      const speed = 0.3 + Math.random() * 1.5;
      const maxLife = 30 + Math.random() * 30; // Shorter life for performance
      particlesRef.current.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 0.5,
        life: 0,
        maxLife,
        size: 1 + Math.random() * 2,
        color: BRAND_COLORS[Math.floor(Math.random() * BRAND_COLORS.length)],
        opacity: 0.5 + Math.random() * 0.5,
      });
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const dpr = Math.min(window.devicePixelRatio, 2);
      const rect = parent.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas.parentElement!);

    const startAnimation = () => {
      if (!isAnimatingRef.current) {
        isAnimatingRef.current = true;
        animate();
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top, active: true };
      spawnParticles(mouseRef.current.x, mouseRef.current.y);
      startAnimation();
    };

    const handleMouseEnter = () => {
      mouseRef.current.active = true;
      startAnimation();
    };

    const handleMouseLeave = () => {
      mouseRef.current.active = false;
    };

    const parent = canvas.parentElement!;
    parent.addEventListener('mousemove', handleMouseMove, { passive: true });
    parent.addEventListener('mouseenter', handleMouseEnter);
    parent.addEventListener('mouseleave', handleMouseLeave);

    const animate = () => {
      const particles = particlesRef.current;

      // OPTIMIZATION: Stop animation loop if no particles and mouse is inactive
      if (particles.length === 0 && !mouseRef.current.active) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        isAnimatingRef.current = false;
        return;
      }

      const w = canvas.width / Math.min(window.devicePixelRatio, 2);
      const h = canvas.height / Math.min(window.devicePixelRatio, 2);
      ctx.clearRect(0, 0, w, h);

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life++;
        p.x += p.vx;
        p.y += p.vy;
        p.vy -= 0.01;

        const progress = p.life / p.maxLife;
        const alpha =
          progress < 0.15
            ? (progress / 0.15) * p.opacity
            : (1 - (progress - 0.15) / 0.85) * p.opacity;

        if (p.life >= p.maxLife || alpha <= 0) {
          particles.splice(i, 1);
          continue;
        }

        const currentSize = p.size * (1 - progress * 0.3);

        ctx.beginPath();
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, currentSize * 3);
        gradient.addColorStop(0, `${p.color}${alpha * 0.4})`);
        gradient.addColorStop(1, `${p.color}0)`);
        ctx.fillStyle = gradient;
        ctx.arc(p.x, p.y, currentSize * 3, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.fillStyle = `${p.color}${alpha})`;
        ctx.arc(p.x, p.y, currentSize, 0, Math.PI * 2);
        ctx.fill();
      }

      if (mouseRef.current.active) {
        const { x, y } = mouseRef.current;
        const glow = ctx.createRadialGradient(x, y, 0, x, y, 40);
        glow.addColorStop(0, 'rgba(91, 58, 140, 0.1)');
        glow.addColorStop(1, 'rgba(91, 58, 140, 0)');
        ctx.beginPath();
        ctx.fillStyle = glow;
        ctx.arc(x, y, 40, 0, Math.PI * 2);
        ctx.fill();
      }

      animFrameRef.current = requestAnimationFrame(animate);
    };

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      parent.removeEventListener('mousemove', handleMouseMove);
      parent.removeEventListener('mouseenter', handleMouseEnter);
      parent.removeEventListener('mouseleave', handleMouseLeave);
      ro.disconnect();
    };
  }, [spawnParticles]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-0"
      aria-hidden="true"
    />
  );
};
