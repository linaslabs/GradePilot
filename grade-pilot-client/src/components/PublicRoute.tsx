import { useAuth } from '@/hooks/useAuth';
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

export default function PublicRoute() {
  const { user } = useAuth();

  if (user) {
    if (!user.onboardingCompleted) {
      return <Navigate to={'/onboarding'} replace />;
    } else {
      return <Navigate to={'/dashboard'} replace />;
    }
  }

  return <Outlet />;
}
