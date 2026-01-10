'use client';

import styled from 'styled-components';

const AuthLayout = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: var(--bg-primary);
`;

const AuthContainer = styled.div`
  width: 100%;
  max-width: 420px;
`;

export default function AuthLayoutWrapper({ children }) {
  return (
    <AuthLayout>
      <AuthContainer>
        {children}
      </AuthContainer>
    </AuthLayout>
  );
}