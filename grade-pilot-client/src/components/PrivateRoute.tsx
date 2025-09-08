import { useAuth } from '@/hooks/useAuth';
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

export default function PrivateRoute() {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to={'/login'} replace />;
  }

  if (!user.onboardingCompleted) {
    return <Navigate to="/onboarding" replace />;
  }

  return <Outlet />;
}
