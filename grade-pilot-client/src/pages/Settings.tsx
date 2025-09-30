import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Trash, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';

export default function SettingsPage() {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const { token, logout } = useAuth();
  const navigate = useNavigate();

  const [error, setError] = useState('');

  const deleteProfile = async () => {
    try {
      const response = await fetch(`${apiUrl}/user`, {
        method: 'DELETE',
        headers: {
          authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(
          errorData.customMessage ||
            'An unexpected error occured... Try again later',
        );
      }

      logout();
      navigate('/login', { replace: true });
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An unexpected error occurred... Try again later');
      }
    }
  };

  return (
    <div className="pl-7">
      <h2 className="mb-2 flex items-center gap-1 font-bold">
        <Settings className="h-7 w-7" />
        Settings
      </h2>
      <Button
        className="mb-4 flex flex-col items-center justify-center rounded-sm bg-gray-700 font-light text-gray-300 transition-all duration-300 ease-in-out hover:bg-red-600"
        onClick={() => deleteProfile()}
      >
        <div className="flex items-center gap-1.5">
          <Trash />
          Delete Profile
        </div>
      </Button>
      {error && <p className="text-red-400">{error}</p>}
    </div>
  );
}
