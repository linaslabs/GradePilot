import React, { useEffect, useState } from 'react';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import AppSidebar from '@/components/ui/app-sidebar';
import { Outlet, useOutletContext } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import type { Degree } from '@/types';
import { Loader2 } from 'lucide-react';

interface OutletContextType {
  degree: Degree | null;
}

export default function DashboardLayout() {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const { token } = useAuth();

  const [degree, setDegree] = useState<Degree | null>(null);

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDegree = async () => {
      try {
        const response = await fetch(`${apiUrl}/degree/my-degree`, {
          method: 'GET',
          headers: {
            authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.customMessage ||
              'An unexpected error occured... Try again later',
          );
        }

        setDegree(data.degree);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError('An unexpected error occurred... Try again later');
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (token) {
      fetchDegree();
    }
  }, [token, apiUrl]);

  if (isLoading) {
    return (
      <div className="bg-background flex min-h-screen items-center justify-center">
        <Loader2 className="text-primary h-16 w-16 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center p-8">
        <div className="flex flex-col items-center gap-4 rounded-md p-8 text-red-600">
          <h2 className="text-2xl font-bold">Dashboard Error</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <SidebarProvider>
        <AppSidebar degree={degree} />
        <main>
          <SidebarTrigger />
          <Outlet context={{ degree }} />
        </main>
      </SidebarProvider>
    </>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useDegree() {
  return useOutletContext<OutletContextType>();
}
