import { useEffect, useRef, useState } from 'react';

export default function CustomCursor() {
  const cursorRef = useRef(null);
  const glowRef = useRef(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const mousePos = useRef({ x: -100, y: -100 });
  const cursorPos = useRef({ x: -100, y: -100 });
  const glowPos = useRef({ x: -100, y: -100 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    const handleMouseOver = (e) => {
      const target = e.target;
      if (
        target.tagName === 'BUTTON' ||
        target.tagName === 'A' ||
        target.closest('button') ||
        target.closest('a') ||
        target.closest('[data-cursor-hover]') ||
        target.classList.contains('glass-card') ||
        target.closest('.glass-card') ||
        target.tagName === 'INPUT' ||
        target.tagName === 'SELECT' ||
        target.tagName === 'TEXTAREA' ||
        target.closest('tr')
      ) {
        setIsHovering(true);
      }
    };

    const handleMouseOut = (e) => {
      const target = e.target;
      if (
        target.tagName === 'BUTTON' ||
        target.tagName === 'A' ||
        target.closest('button') ||
        target.closest('a') ||
        target.closest('[data-cursor-hover]') ||
        target.classList.contains('glass-card') ||
        target.closest('.glass-card') ||
        target.tagName === 'INPUT' ||
        target.tagName === 'SELECT' ||
        target.tagName === 'TEXTAREA' ||
        target.closest('tr')
      ) {
        setIsHovering(false);
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);

    // Animation loop
    let animationFrame;
    const animate = () => {
      // Cursor follows exactly
      cursorPos.current.x += (mousePos.current.x - cursorPos.current.x) * 0.3;
      cursorPos.current.y += (mousePos.current.y - cursorPos.current.y) * 0.3;
      // Glow follows with delay
      glowPos.current.x += (mousePos.current.x - glowPos.current.x) * 0.12;
      glowPos.current.y += (mousePos.current.y - glowPos.current.y) * 0.12;

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${cursorPos.current.x}px, ${cursorPos.current.y}px)`;
      }
      if (glowRef.current) {
        glowRef.current.style.transform = `translate(${glowPos.current.x}px, ${glowPos.current.y}px)`;
      }

      animationFrame = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
      cancelAnimationFrame(animationFrame);
    };
  }, []);

  return (
    <>
      {/* Main cursor dot */}
      <div
        ref={cursorRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: isHovering ? '40px' : '10px',
          height: isHovering ? '40px' : '10px',
          marginLeft: isHovering ? '-20px' : '-5px',
          marginTop: isHovering ? '-20px' : '-5px',
          borderRadius: '50%',
          background: isHovering
            ? 'transparent'
            : isClicking
            ? 'rgba(6, 182, 212, 0.9)'
            : 'rgba(124, 58, 237, 0.9)',
          border: isHovering ? '2px solid rgba(124, 58, 237, 0.7)' : 'none',
          pointerEvents: 'none',
          zIndex: 99999,
          transition: 'width 0.25s ease, height 0.25s ease, margin 0.25s ease, background 0.25s ease, border 0.25s ease',
          mixBlendMode: isHovering ? 'normal' : 'normal',
          boxShadow: isClicking
            ? '0 0 20px rgba(6, 182, 212, 0.5)'
            : isHovering
            ? '0 0 20px rgba(124, 58, 237, 0.3)'
            : '0 0 10px rgba(124, 58, 237, 0.4)',
        }}
      />
      {/* Trailing glow */}
      <div
        ref={glowRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: isHovering ? '60px' : '30px',
          height: isHovering ? '60px' : '30px',
          marginLeft: isHovering ? '-30px' : '-15px',
          marginTop: isHovering ? '-30px' : '-15px',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${
            isClicking
              ? 'rgba(6, 182, 212, 0.15)'
              : 'rgba(124, 58, 237, 0.1)'
          } 0%, transparent 70%)`,
          pointerEvents: 'none',
          zIndex: 99998,
          transition: 'width 0.3s ease, height 0.3s ease, margin 0.3s ease',
        }}
      />
    </>
  );
}
