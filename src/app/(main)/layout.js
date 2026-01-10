'use client';

import styled from 'styled-components';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Header, Sidebar, MobileNav } from '@/components/layout';
import { Toast, Loader } from '@/components/common';
import DebugExpenses from '@/components/common/DebugExpenses';
import { useAuth } from '@/context/AuthContext';
import { useToastContext } from '@/context/ToastContext';

const MainLayout = styled.div`
  min-height: 100vh;
  background: var(--bg-primary);
`;

const MainContent = styled.main`
  padding-bottom: 90px;
  
  @media (min-width: 768px) {
    margin-left: 240px;
    padding-bottom: 0;
  }
`;

// Pages that don't require full auth check
const publicSetupPages = ['/profile/setup'];

export default function MainLayoutWrapper({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, isLoading, isReady } = useAuth();
  const { toasts, removeToast } = useToastContext();

  useEffect(() => {
    // Wait for auth to be ready
    if (!isReady) return;

    // Allow profile setup page even without full auth (for registration flow)
    if (publicSetupPages.includes(pathname)) {
      // Check if there's newUser data in session (registration flow)
      const hasNewUserData = sessionStorage.getItem('newUser');
      if (hasNewUserData || isAuthenticated) {
        return; // Allow access
      }
    }

    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      router.replace('/login');
    }
  }, [isReady, isAuthenticated, pathname, router]);

  // Show loading while checking auth
  if (!isReady) {
    return <Loader fullPage text="Loading..." />;
  }

  // For profile setup during registration, show minimal layout
  if (pathname === '/profile/setup' && !isAuthenticated) {
    const hasNewUserData = typeof window !== 'undefined' && sessionStorage.getItem('newUser');
    if (hasNewUserData) {
      return (
        <MainLayout>
          {children}
          <Toast toasts={toasts} removeToast={removeToast} />
        </MainLayout>
      );
    }
    return <Loader fullPage text="Loading..." />;
  }

  // Not authenticated and not on setup page
  if (!isAuthenticated) {
    return <Loader fullPage text="Redirecting..." />;
  }

  return (
    <MainLayout>
      <Sidebar />
      <Header />
      <MainContent>
        {children}
      </MainContent>
      <MobileNav />
      <Toast toasts={toasts} removeToast={removeToast} />
      
      {/* Debug component - REMOVE IN PRODUCTION */}
      <DebugExpenses />
    </MainLayout>
  );
}