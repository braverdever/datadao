import React, { useEffect, useRef } from 'react';

const CanvasCursor = ({
  defaultRadius = 38,
  maxRadius = 60,
  innerDotRadius = 10,
  easing = 0.2,
  clickRadius = 20,
  speedMultiplier = 1,
  lineColor = '#ffffff',
  lineWidth = 1,
  circleLineWidth = 2,
  fontSize = '12px',
  fontFamily = 'monospace',
}) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // Add these variables at the start of useEffect
    let currentX = 0;
    let currentY = 0;
    let targetX = window.clientX || window.innerWidth / 2;
    let targetY = window.clientY || window.innerHeight / 2;
    let currentRadius = defaultRadius;
    let targetRadius = defaultRadius;
    let lastX = 0;
    let lastY = 0;
    let isClicking = false;
    let animationFrameId;

    // Set canvas size to window size
    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);

    // Update cursor drawing function
    const drawCursor = (x, y, radius) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Calculate coordinates relative to center
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const relativeX = (x - centerX).toFixed(3);
      const relativeY = (y - centerY).toFixed(3);
      
      // Format numbers with apostrophe thousand separators and decimals
      const formatNumber = num => {
        const sign = num < 0 ? '-' : '';
        return sign + Math.abs(num).toFixed(3).toString().replace(/^(\d+)\.(\d+)$/, '$1\'$2');
      };
      
      const formattedX = formatNumber(relativeX);
      const formattedY = formatNumber(relativeY);
      
      // Draw crossing lines
      ctx.beginPath();
      ctx.strokeStyle = lineColor;
      ctx.lineWidth = lineWidth;
      ctx.setLineDash([5, 5]);
      
      // Horizontal line
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      
      // Vertical line
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      
      ctx.stroke();
      ctx.setLineDash([]);
      
      // Draw coordinates text
      ctx.font = `${fontSize} ${fontFamily}`;
      ctx.fillStyle = lineColor;
      ctx.textAlign = 'left';
      ctx.fillText(formattedX, x + 45, y + 15);
      ctx.fillText(formattedY, x + 45, y + 30);
      
      // Draw outer circle
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.strokeStyle = `${lineColor}${isClicking ? 'cc' : '80'}`;
      ctx.lineWidth = circleLineWidth;
      ctx.stroke();
      
      // Draw inner dot
      ctx.beginPath();
      ctx.arc(x, y, innerDotRadius, 0, Math.PI * 2);
      ctx.fillStyle = lineColor;
      ctx.fill();
    };

    // Update animation loop
    const animate = () => {
      const currentEasing = easing;
      currentX += (targetX - currentX) * currentEasing;
      currentY += (targetY - currentY) * currentEasing;

      // Calculate cursor speed
      const dx = targetX - lastX;
      const dy = targetY - lastY;
      const speed = Math.sqrt(dx * dx + dy * dy);
      
      // Update target radius based on click state and speed
      targetRadius = isClicking 
        ? clickRadius
        : Math.min(defaultRadius + speed * speedMultiplier, maxRadius);
      
      currentRadius += (targetRadius - currentRadius) * currentEasing;
      
      // Update last position
      lastX = targetX;
      lastY = targetY;
      
      drawCursor(currentX, currentY, currentRadius);
      animationFrameId = requestAnimationFrame(animate);
    };

    // Update mouse tracking
    const onMouseMove = (e) => {
      targetX = e.clientX;
      targetY = e.clientY;
    };

    // Add mouse event listeners
    const onMouseDown = () => isClicking = true;
    const onMouseUp = () => isClicking = false;

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    animate(); // Start the animation loop

    // Update cleanup
    return () => {
      window.removeEventListener('resize', setCanvasSize);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      cancelAnimationFrame(animationFrameId);
    };
  }, [defaultRadius, maxRadius, innerDotRadius, easing, clickRadius, 
      speedMultiplier, lineColor, lineWidth, circleLineWidth, fontSize, fontFamily]);

  return <canvas ref={canvasRef} />;
};

export default CanvasCursor; 