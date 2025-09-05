import React, { useEffect, useState } from 'react';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import AppSidebar from '@/components/ui/app-sidebar';
import { Outlet, useOutletContext } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import type { Degree } from '@/types';

interface OutletContextType {
  degree: Degree | null;
  isLoading: boolean;
  error: string | null;
}

export default function DashboardLayout() {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const { token } = useAuth();

  const [degree, setDegree] = useState<Degree | null>(null);

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchDegree = async () => {
      try {
        setIsLoading(true);
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
  return (
    <>
      <SidebarProvider>
        <AppSidebar degree={degree} />
        <main>
          <SidebarTrigger />
          <Outlet context={{ degree, isLoading, error }} />
        </main>
      </SidebarProvider>
    </>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useDegree() {
  return useOutletContext<OutletContextType>();
}
