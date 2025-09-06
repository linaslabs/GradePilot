import React, { useEffect, useState, type ReactNode } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else if (user.onboardingCompleted) {
      navigate('/dashboard');
    } else {
      setIsLoading(false);
    }
  }, [user, navigate]);

  return (
    <>
      {isLoading ? (
        <div className="bg-background flex min-h-screen items-center justify-center">
          <Loader2 className="text-primary h-16 w-16 animate-spin" />
        </div>
      ) : (
        children
      )}
    </>
  );
}
