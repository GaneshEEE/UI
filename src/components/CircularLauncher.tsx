import React, { useState, useRef, useEffect } from 'react';

interface CircularLauncherProps {
  onClick: () => void;
}

const CircularLauncher: React.FC<CircularLauncherProps> = ({ onClick }) => {
  const [position, setPosition] = useState({ x: 50, y: 50 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      const newX = e.clientX - dragStart.x;
      const newY = e.clientY - dragStart.y;
      
      // Keep button within viewport bounds
      const maxX = window.innerWidth - 80;
      const maxY = window.innerHeight - 80;
      
      setPosition({
        x: Math.max(0, Math.min(newX, maxX)),
        y: Math.max(0, Math.min(newY, maxY))
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleClick = (e: React.MouseEvent) => {
    if (!isDragging) {
      onClick();
    }
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragStart]);

  return (
    <button
      ref={buttonRef}
      onMouseDown={handleMouseDown}
      onClick={handleClick}
      className="fixed w-20 h-20 bg-gradient-to-br from-confluence-blue to-confluence-light-blue text-white rounded-full shadow-2xl cursor-move z-50 flex items-center justify-center font-bold text-sm backdrop-blur-xl border-2 border-white/30 hover:shadow-confluence-blue/50 hover:shadow-2xl transition-all duration-300"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        boxShadow: `
          0 0 30px rgba(38, 132, 255, 0.4),
          0 0 60px rgba(38, 132, 255, 0.2),
          0 8px 32px rgba(0, 0, 0, 0.3),
          inset 0 1px 0 rgba(255, 255, 255, 0.3)
        `,
        background: `
          linear-gradient(135deg, 
            rgba(38, 132, 255, 0.9) 0%, 
            rgba(0, 82, 204, 0.9) 100%
          ),
          radial-gradient(circle at 30% 30%, 
            rgba(255, 255, 255, 0.3) 0%, 
            transparent 50%
          )
        `,
      }}
    >
      <span className="text-white font-extrabold tracking-tight">C.AIA</span>
    </button>
  );
};

export default CircularLauncher;