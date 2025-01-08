import React, { useEffect, useRef } from 'react';

const GridAnimation = () => {
  const canvasRef = useRef(null);
  const dotsRef = useRef([]);
  const mouseRef = useRef({ x: 0, y: 0 });

  const createDots = (canvas) => {
    const spacing = 80;
    const cols = Math.floor(canvas.width / spacing) + 2;
    const rows = Math.floor(canvas.height / spacing) + 2;
    const dots = [];

    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        dots.push({
          x: i * spacing,
          y: j * spacing,
          baseX: i * spacing,
          baseY: j * spacing,
          speed: 0.08,
          movementRadius: 15,
          size: 2,
          pulseAngle: Math.random() * Math.PI * 2,
          pulseSpeed: 0.01 + Math.random() * 0.02
        });
      }
    }
    return dots;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      dotsRef.current = createDots(canvas);
    };

    const handleMouseMove = (e) => {
      mouseRef.current = {
        x: e.clientX,
        y: e.clientY
      };
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      ctx.beginPath();
      dotsRef.current.forEach((dot, index) => {
        dotsRef.current.forEach((otherDot, otherIndex) => {
          if (index !== otherIndex) {
            const dx = dot.x - otherDot.x;
            const dy = dot.y - otherDot.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 100) {
              ctx.beginPath();
              ctx.moveTo(dot.x, dot.y);
              ctx.lineTo(otherDot.x, otherDot.y);
              ctx.strokeStyle = `rgba(255, 255, 255, ${0.15 * (1 - distance / 100)})`;
              ctx.stroke();
            }
          }
        });
      });

      dotsRef.current.forEach(dot => {
        dot.x = dot.baseX;
        dot.y = dot.baseY;

        dot.pulseAngle += dot.pulseSpeed;
        const pulseFactor = 0.5 + Math.sin(dot.pulseAngle) * 0.5;
        const currentSize = dot.size * pulseFactor;

        const hue = (dot.x / canvas.width) * 60 + 200;
        const saturation = 70;
        const lightness = 50;
        
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, currentSize, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${hue}, ${saturation}%, ${lightness}%, 0.8)`;
        ctx.fill();
      });
      
      requestAnimationFrame(animate);
    };

    resize();
    animate();

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="grid-canvas"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
        pointerEvents: 'none'
      }}
    />
  );
};

export default GridAnimation; 