import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Navigate, Outlet } from 'react-router-dom';

export default function OnboardingRoute() {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to={'/login'} replace />;
  }

  if (user.onboardingCompleted) {
    return <Navigate to={'/dashboard'} replace />;
  }

  return <Outlet />;
}
