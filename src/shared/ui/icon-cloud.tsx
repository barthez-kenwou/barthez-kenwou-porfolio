'use client';

import React, { useEffect, useRef, useState, useMemo } from 'react';
import { renderToString } from 'react-dom/server';

interface Icon {
  x: number;
  y: number;
  z: number;
  scale: number;
  opacity: number;
  id: number;
}

interface IconCloudProps {
  icons?: React.ReactNode[];
  images?: string[];
  className?: string;
  /** Display max width in px. Canvas stays 460 for sphere math. Default 460. */
  size?: number;
}

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

const SPHERE_RADIUS = 200;
const IMAGE_SIZE = 60;

export function IconCloud({ icons, images, className, size = 460 }: IconCloudProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [iconPositions, setIconPositions] = useState<Icon[]>([]);

  // Use Refs for performance instead of state to avoid unnecessary re-renders in animation loop
  const isDraggingRef = useRef(false);
  const lastMousePosRef = useRef({ x: 0, y: 0 });
  const mousePosRef = useRef({ x: 0, y: 0 });
  const targetRotationRef = useRef<{
    x: number;
    y: number;
    startX: number;
    startY: number;
    distance: number;
    startTime: number;
    duration: number;
  } | null>(null);

  const animationFrameRef = useRef<number>(0);
  const rotationRef = useRef({ x: 0, y: 0 });
  const iconCanvasesRef = useRef<HTMLCanvasElement[]>([]);
  const imagesLoadedRef = useRef<boolean[]>([]);

  // Create icon canvases once when icons/images change
  useEffect(() => {
    if (!icons && !images) return;

    const items = icons ?? images ?? [];
    imagesLoadedRef.current = new Array(items.length).fill(false);

    const newIconCanvases = items.map((item, index) => {
      const offscreen = document.createElement('canvas');
      offscreen.width = IMAGE_SIZE;
      offscreen.height = IMAGE_SIZE;
      const offCtx = offscreen.getContext('2d');

      if (offCtx) {
        if (images) {
          // Handle image URLs directly
          const img = new Image();
          img.crossOrigin = 'anonymous';
          img.src = items[index] as string;
          img.onload = () => {
            offCtx.clearRect(0, 0, offscreen.width, offscreen.height);

            // Create circular clipping path
            offCtx.beginPath();
            offCtx.arc(IMAGE_SIZE / 2, IMAGE_SIZE / 2, IMAGE_SIZE / 2, 0, Math.PI * 2);
            offCtx.closePath();
            offCtx.clip();

            // Draw the image
            offCtx.drawImage(img, 0, 0, IMAGE_SIZE, IMAGE_SIZE);

            imagesLoadedRef.current[index] = true;
          };
        } else {
          // Handle SVG icons
          offCtx.scale(IMAGE_SIZE / 100, IMAGE_SIZE / 100); // Adjust scale based on original size
          const svgString = renderToString(item as React.ReactElement);
          const img = new Image();
          img.src = 'data:image/svg+xml;base64,' + btoa(svgString);
          img.onload = () => {
            offCtx.clearRect(0, 0, offscreen.width, offscreen.height);
            offCtx.drawImage(img, 0, 0);
            imagesLoadedRef.current[index] = true;
          };
        }
      }
      return offscreen;
    });

    iconCanvasesRef.current = newIconCanvases;
  }, [icons, images]);

  // Generate initial icon positions on a sphere
  useEffect(() => {
    const items = icons ?? images ?? [];
    const newIcons: Icon[] = [];
    const numIcons = items.length || 20;

    // Fibonacci sphere parameters
    const offset = 2 / numIcons;
    const increment = Math.PI * (3 - Math.sqrt(5));

    for (let i = 0; i < numIcons; i++) {
      const y = i * offset - 1 + offset / 2;
      const r = Math.sqrt(1 - y * y);
      const phi = i * increment;

      const x = Math.cos(phi) * r;
      const z = Math.sin(phi) * r;

      newIcons.push({
        x: x * SPHERE_RADIUS,
        y: y * SPHERE_RADIUS,
        z: z * SPHERE_RADIUS,
        scale: 1,
        opacity: 1,
        id: i,
      });
    }
    setIconPositions(newIcons);
  }, [icons, images]);

  // Handle mouse events
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect || !canvasRef.current) return;

    // Scale canvas coordinates to visual dimensions
    const scaleX = canvasRef.current.width / rect.width;
    const scaleY = canvasRef.current.height / rect.height;

    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    iconPositions.forEach((icon) => {
      const cosX = Math.cos(rotationRef.current.x);
      const sinX = Math.sin(rotationRef.current.x);
      const cosY = Math.cos(rotationRef.current.y);
      const sinY = Math.sin(rotationRef.current.y);

      const rotatedX = icon.x * cosY - icon.z * sinY;
      const rotatedZ = icon.x * sinY + icon.z * cosY;
      const rotatedY = icon.y * cosX + rotatedZ * sinX;

      const screenX = canvasRef.current!.width / 2 + rotatedX;
      const screenY = canvasRef.current!.height / 2 + rotatedY;

      const scale = (rotatedZ + SPHERE_RADIUS * 1.5) / (SPHERE_RADIUS * 2);
      const radius = (IMAGE_SIZE / 2) * scale;
      const dx = x - screenX;
      const dy = y - screenY;

      if (dx * dx + dy * dy < radius * radius) {
        const targetX = -Math.atan2(icon.y, Math.sqrt(icon.x * icon.x + icon.z * icon.z));
        const targetY = Math.atan2(icon.x, icon.z);

        const currentX = rotationRef.current.x;
        const currentY = rotationRef.current.y;
        const distance = Math.sqrt(
          Math.pow(targetX - currentX, 2) + Math.pow(targetY - currentY, 2),
        );

        const duration = Math.min(2000, Math.max(800, distance * 1000));

        targetRotationRef.current = {
          x: targetX,
          y: targetY,
          startX: currentX,
          startY: currentY,
          distance,
          startTime: performance.now(),
          duration,
        };
        return;
      }
    });

    isDraggingRef.current = true;
    lastMousePosRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      mousePosRef.current = { x, y };
    }

    if (isDraggingRef.current) {
      const deltaX = e.clientX - lastMousePosRef.current.x;
      const deltaY = e.clientY - lastMousePosRef.current.y;

      rotationRef.current = {
        x: rotationRef.current.x + deltaY * 0.002,
        y: rotationRef.current.y + deltaX * 0.002,
      };

      lastMousePosRef.current = { x: e.clientX, y: e.clientY };
    }
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  // Animation and rendering
  useEffect(() => {
    const canvas = canvasRef.current;
    const renderCtx = canvas?.getContext('2d');
    if (canvas && renderCtx) {
      // Setup dynamic sizing based on window or container if needed, but for now fixed high-res canvas scaling
      const animate = () => {
        renderCtx.clearRect(0, 0, canvas.width, canvas.height);

        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const targetRotation = targetRotationRef.current;

        // We calculate maxDistance based on a normalized rect, assuming rect bounds are relatively large
        const rect = canvas.getBoundingClientRect();
        const mouseXCanvas =
          mousePosRef.current.x * (canvas.width / rect.width) || canvas.width / 2;
        const mouseYCanvas =
          mousePosRef.current.y * (canvas.height / rect.height) || canvas.height / 2;

        const maxDistance = Math.sqrt(centerX * centerX + centerY * centerY);
        const dx = mouseXCanvas - centerX;
        const dy = mouseYCanvas - centerY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const speed = 0.002 + (distance / maxDistance) * 0.008;

        if (targetRotation) {
          const elapsed = performance.now() - targetRotation.startTime;
          const progress = Math.min(1, elapsed / targetRotation.duration);
          const easedProgress = easeOutCubic(progress);

          rotationRef.current = {
            x: targetRotation.startX + (targetRotation.x - targetRotation.startX) * easedProgress,
            y: targetRotation.startY + (targetRotation.y - targetRotation.startY) * easedProgress,
          };

          if (progress >= 1) {
            targetRotationRef.current = null;
          }
        } else if (!isDraggingRef.current) {
          rotationRef.current = {
            x: rotationRef.current.x + (dy / canvas.height) * speed,
            y: rotationRef.current.y + (dx / canvas.width) * speed,
          };
        }

        iconPositions.forEach((icon, index) => {
          const cosX = Math.cos(rotationRef.current.x);
          const sinX = Math.sin(rotationRef.current.x);
          const cosY = Math.cos(rotationRef.current.y);
          const sinY = Math.sin(rotationRef.current.y);

          const rotatedX = icon.x * cosY - icon.z * sinY;
          const rotatedZ = icon.x * sinY + icon.z * cosY;
          const rotatedY = icon.y * cosX + rotatedZ * sinX;

          // Scale and opacity math adjusted for SPHERE_RADIUS
          const scale = (rotatedZ + SPHERE_RADIUS * 1.5) / (SPHERE_RADIUS * 2.5);
          const opacity = Math.max(
            0.1,
            Math.min(1, (rotatedZ + SPHERE_RADIUS * 1.2) / (SPHERE_RADIUS * 1.5)),
          );

          renderCtx.save();
          renderCtx.translate(canvas.width / 2 + rotatedX, canvas.height / 2 + rotatedY);
          renderCtx.scale(scale, scale);
          renderCtx.globalAlpha = opacity;

          if (icons || images) {
            // Only try to render icons/images if they exist
            if (iconCanvasesRef.current[index] && imagesLoadedRef.current[index]) {
              const halfSize = IMAGE_SIZE / 2;
              renderCtx.drawImage(
                iconCanvasesRef.current[index],
                -halfSize,
                -halfSize,
                IMAGE_SIZE,
                IMAGE_SIZE,
              );
            }
          } else {
            // Show numbered circles if no icons/images are provided
            renderCtx.beginPath();
            renderCtx.arc(0, 0, IMAGE_SIZE / 2, 0, Math.PI * 2);
            renderCtx.fillStyle = '#4b2a78';
            renderCtx.fill();
            renderCtx.fillStyle = 'white';
            renderCtx.textAlign = 'center';
            renderCtx.textBaseline = 'middle';
            renderCtx.font = '16px Arial';
            renderCtx.fillText(`${icon.id + 1}`, 0, 0);
          }

          renderCtx.restore();
        });
        animationFrameRef.current = requestAnimationFrame(animate);
      };

      animate();
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [icons, images, iconPositions]); // Removed React state dependencies! Huge performance win!

  return (
    <div className={`mx-auto flex justify-center items-center overflow-hidden ${className ?? ''}`}>
      <canvas
        ref={canvasRef}
        width={460}
        height={460}
        style={{ width: '100%', maxWidth: `${size}px`, height: 'auto', aspectRatio: '1/1' }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className="rounded-md cursor-pointer"
        aria-label="Interactive 3D Icon Cloud"
        role="img"
      />
    </div>
  );
}
