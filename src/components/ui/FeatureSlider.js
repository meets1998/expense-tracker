'use client';

import styled from 'styled-components';
import { motion } from 'framer-motion';
import Marquee from './Marquee';

const SliderSection = styled.section`
  padding: 2rem 0;
  background: ${({ $bgColor }) => $bgColor || 'var(--bg-secondary)'};
  border-top: 1px solid var(--border-color);
  border-bottom: 1px solid var(--border-color);
  overflow: hidden;
`;

const SliderRow = styled.div`
  margin: ${({ $margin }) => $margin || '0'};
`;

const FeatureItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0 2rem;
  white-space: nowrap;
`;

const FeatureIcon = styled.span`
  font-size: 1.25rem;
  color: ${({ $color }) => $color || 'var(--accent-primary)'};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const FeatureText = styled.span`
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--text-secondary);
  
  @media (max-width: 640px) {
    font-size: 1rem;
  }
`;

const Divider = styled.span`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--border-color);
  margin: 0 1rem;
`;

export default function FeatureSlider({ 
  items = [], 
  speed = 25,
  reverse = false,
  bgColor,
  showDividers = true,
}) {
  return (
    <SliderSection $bgColor={bgColor}>
      <Marquee 
        speed={speed} 
        reverse={reverse}
        bgColor={bgColor}
        pauseOnHover
      >
        {items.map((item, index) => (
          <FeatureItem key={index}>
            {item.icon && (
              <FeatureIcon $color={item.color}>
                {typeof item.icon === 'function' ? <item.icon size={20} /> : item.icon}
              </FeatureIcon>
            )}
            <FeatureText>{item.text}</FeatureText>
            {showDividers && <Divider />}
          </FeatureItem>
        ))}
      </Marquee>
    </SliderSection>
  );
}