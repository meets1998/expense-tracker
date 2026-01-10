'use client';

import styled from 'styled-components';
import Marquee from './Marquee';

const SliderSection = styled.section`
  padding: 2rem 0;
  background: var(--bg-secondary);
`;

const SectionLabel = styled.p`
  text-align: center;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 2px;
  color: var(--text-muted);
  margin-bottom: 1.5rem;
`;

const LogoItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 2.5rem;
  opacity: 0.6;
  transition: opacity var(--transition-fast);
  
  &:hover {
    opacity: 1;
  }
  
  @media (max-width: 640px) {
    padding: 0 1.5rem;
  }
`;

const LogoIcon = styled.div`
  font-size: 2rem;
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const LogoText = styled.span`
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--text-secondary);
`;

export default function LogoSlider({ 
  logos = [],
  label = "Trusted by users worldwide",
  speed = 30,
}) {
  return (
    <SliderSection>
      <SectionLabel>{label}</SectionLabel>
      <Marquee speed={speed} pauseOnHover bgColor="var(--bg-secondary)">
        {logos.map((logo, index) => (
          <LogoItem key={index}>
            <LogoIcon>
              {logo.icon}
              {logo.text && <LogoText>{logo.text}</LogoText>}
            </LogoIcon>
          </LogoItem>
        ))}
      </Marquee>
    </SliderSection>
  );
}