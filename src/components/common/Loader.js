'use client';

import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
`;

const LoaderWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ $padding }) => $padding || '2rem'};
`;

const Spinner = styled.div`
  width: ${({ $size }) => $size || '40px'};
  height: ${({ $size }) => $size || '40px'};
  border: 3px solid var(--border-color);
  border-top-color: var(--accent-primary);
  border-radius: 50%;
  animation: ${spin} 0.8s linear infinite;
`;

const DotsWrapper = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const Dot = styled.div`
  width: 10px;
  height: 10px;
  background: var(--accent-primary);
  border-radius: 50%;
  animation: ${pulse} 1.4s ease-in-out infinite;
  animation-delay: ${({ $delay }) => $delay || '0s'};
`;

const FullPageLoader = styled.div`
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-primary);
  z-index: 9999;
`;

const LogoText = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  background: var(--accent-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-top: 1rem;
`;

export function Loader({ size, padding }) {
  return (
    <LoaderWrapper $padding={padding}>
      <Spinner $size={size} />
    </LoaderWrapper>
  );
}

export function DotsLoader() {
  return (
    <LoaderWrapper>
      <DotsWrapper>
        <Dot $delay="0s" />
        <Dot $delay="0.2s" />
        <Dot $delay="0.4s" />
      </DotsWrapper>
    </LoaderWrapper>
  );
}

export function PageLoader() {
  return (
    <FullPageLoader>
      <div style={{ textAlign: 'center' }}>
        <Spinner $size="48px" />
        <LogoText>ExpenseWise</LogoText>
      </div>
    </FullPageLoader>
  );
}

export default Loader;