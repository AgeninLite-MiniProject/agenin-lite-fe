import { useRef, useEffect, useState } from "react";

export const DotMap = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  const generateDots = (width: number, height: number) => {
    const dots = [];
    const gap = 12;
    const dotRadius = 1;

    for (let x = 0; x < width; x += gap) {
      for (let y = 0; y < height; y += gap) {
        const isInMapShape =
          ((x < width * 0.25 && x > width * 0.05) && (y < height * 0.4 && y > height * 0.1)) ||
          ((x < width * 0.25 && x > width * 0.15) && (y < height * 0.8 && y > height * 0.4)) ||
          ((x < width * 0.45 && x > width * 0.3) && (y < height * 0.35 && y > height * 0.15)) ||
          ((x < width * 0.5 && x > width * 0.35) && (y < height * 0.65 && y > height * 0.35)) ||
          ((x < width * 0.7 && x > width * 0.45) && (y < height * 0.5 && y > height * 0.1)) ||
          ((x < width * 0.8 && x > width * 0.65) && (y < height * 0.8 && y > height * 0.6));

        if (isInMapShape && Math.random() > 0.3) {
          dots.push({
            x,
            y,
            radius: dotRadius,
            opacity: Math.random() * 0.4 + 0.1, // Opasitas untuk background gelap
          });
        }
      }
    }
    return dots;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeObserver = new ResizeObserver(entries => {
      const { width, height } = entries[0].contentRect;
      setDimensions({ width, height });
      canvas.width = width;
      canvas.height = height;
    });

    resizeObserver.observe(canvas.parentElement as Element);
    return () => resizeObserver.disconnect();
  }, []);

  useEffect(() => {
    if (!dimensions.width || !dimensions.height) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
    if (!ctx) return;

    const dots = generateDots(dimensions.width, dimensions.height);
    let animationFrameId: number;
    let startTime = Date.now();

    function drawDots() {
      ctx.clearRect(0, 0, dimensions.width, dimensions.height);
      dots.forEach(dot => {
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, dot.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${dot.opacity})`; // Titik putih
        ctx.fill();
      });
    }

    // function drawRoutes() {
    //   const currentTime = (Date.now() - startTime) / 1000;
      
    //   routes.forEach(route => {
    //     const elapsed = currentTime - route.start.delay;
    //     if (elapsed <= 0) return;
        
    //     const duration = 3; 
    //     const progress = Math.min(elapsed / duration, 1);
        
    //     const x = route.start.x + (route.end.x - route.start.x) * progress;
    //     const y = route.start.y + (route.end.y - route.start.y) * progress;
        
    //     ctx.beginPath();
    //     ctx.moveTo(route.start.x, route.start.y);
    //     ctx.lineTo(x, y);
    //     ctx.strokeStyle = route.color;
    //     ctx.lineWidth = 1.5;
    //     ctx.stroke();
        
    //     ctx.beginPath();
    //     ctx.arc(route.start.x, route.start.y, 3, 0, Math.PI * 2);
    //     ctx.fillStyle = route.color;
    //     ctx.fill();
        
    //     ctx.beginPath();
    //     ctx.arc(x, y, 3, 0, Math.PI * 2);
    //     ctx.fillStyle = "#ffffff";
    //     ctx.fill();
        
    //     ctx.beginPath();
    //     ctx.arc(x, y, 6, 0, Math.PI * 2);
    //     ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
    //     ctx.fill();
        
    //     if (progress === 1) {
    //       ctx.beginPath();
    //       ctx.arc(route.end.x, route.end.y, 3, 0, Math.PI * 2);
    //       ctx.fillStyle = route.color;
    //       ctx.fill();
    //     }
    //   });
    // }
    
    function animate() {
      drawDots();
      // drawRoutes();
      
      const currentTime = (Date.now() - startTime) / 1000;
      if (currentTime > 15) { 
        startTime = Date.now();
      }
      
      animationFrameId = requestAnimationFrame(animate);
    }
    
    animate();

    return () => cancelAnimationFrame(animationFrameId);
  }, [dimensions]);

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden opacity-90 pointer-events-none">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
    </div>
  );
};
