'use client';

import styled, { keyframes, css } from 'styled-components';
import { useRef, useEffect, useState } from 'react';

const scrollLeft = keyframes`
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
`;

const scrollRight = keyframes`
  0% {
    transform: translateX(-50%);
  }
  100% {
    transform: translateX(0);
  }
`;

const MarqueeContainer = styled.div`
  width: 100%;
  overflow: hidden;
  position: relative;
  
  /* Gradient fade on edges */
  &::before,
  &::after {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    width: ${({ $fadeWidth }) => $fadeWidth || '80px'};
    z-index: 2;
    pointer-events: none;
  }
  
  &::before {
    left: 0;
    background: linear-gradient(to right, 
      ${({ $bgColor }) => $bgColor || 'var(--bg-primary)'} 0%, 
      transparent 100%
    );
  }
  
  &::after {
    right: 0;
    background: linear-gradient(to left, 
      ${({ $bgColor }) => $bgColor || 'var(--bg-primary)'} 0%, 
      transparent 100%
    );
  }
  
  ${({ $noFade }) => $noFade && css`
    &::before,
    &::after {
      display: none;
    }
  `}
`;

const MarqueeTrack = styled.div`
  display: flex;
  width: fit-content;
  animation: ${({ $reverse }) => $reverse ? scrollRight : scrollLeft} 
             ${({ $duration }) => $duration}s 
             linear infinite;
  
  ${({ $pauseOnHover }) => $pauseOnHover && css`
    ${MarqueeContainer}:hover & {
      animation-play-state: paused;
    }
  `}
`;

const MarqueeContent = styled.div`
  display: flex;
  align-items: center;
  flex-shrink: 0;
`;

export default function Marquee({ 
  children, 
  speed = 30,
  reverse = false,
  pauseOnHover = true,
  fadeWidth = '80px',
  bgColor,
  noFade = false,
  className,
}) {
  const [contentWidth, setContentWidth] = useState(0);
  const contentRef = useRef(null);
  
  useEffect(() => {
    if (contentRef.current) {
      setContentWidth(contentRef.current.scrollWidth);
    }
  }, [children]);

  // Calculate duration based on content width and speed
  const duration = contentWidth / (speed * 10) || speed;

  return (
    <MarqueeContainer 
      $fadeWidth={fadeWidth} 
      $bgColor={bgColor}
      $noFade={noFade}
      className={className}
    >
      <MarqueeTrack 
        $duration={duration} 
        $reverse={reverse}
        $pauseOnHover={pauseOnHover}
      >
        <MarqueeContent ref={contentRef}>
          {children}
        </MarqueeContent>
        <MarqueeContent>
          {children}
        </MarqueeContent>
      </MarqueeTrack>
    </MarqueeContainer>
  );
}