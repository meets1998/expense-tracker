'use client';

import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';
import Marquee from './Marquee';

const SliderSection = styled.section`
  padding: 2.5rem 0;
  background: linear-gradient(
    135deg,
    rgba(99, 102, 241, 0.05) 0%,
    rgba(139, 92, 246, 0.05) 100%
  );
  border-top: 1px solid var(--border-color);
  border-bottom: 1px solid var(--border-color);
`;

const StatItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 3rem;
  text-align: center;
  
  @media (max-width: 640px) {
    padding: 0 2rem;
  }
`;

const StatValue = styled.span`
  font-size: 2.5rem;
  font-weight: 800;
  background: var(--accent-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 0.25rem;
  
  @media (max-width: 640px) {
    font-size: 2rem;
  }
`;

const StatLabel = styled.span`
  font-size: 0.9rem;
  color: var(--text-secondary);
  font-weight: 500;
`;

const StatDivider = styled.span`
  width: 1px;
  height: 50px;
  background: var(--border-color);
`;

export default function StatsSlider({ 
  stats = [],
  speed = 40,
}) {
  return (
    <SliderSection>
      <Marquee speed={speed} pauseOnHover noFade>
        {stats.map((stat, index) => (
          <StatItem key={index}>
            <StatValue>{stat.value}</StatValue>
            <StatLabel>{stat.label}</StatLabel>
          </StatItem>
        ))}
      </Marquee>
    </SliderSection>
  );
}