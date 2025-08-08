import { useAuth } from '@/hooks/useAuth';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

export default function YearDetails() {
  const { token } = useAuth();
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const [yearInfo, setYearInfo] = useState({});
  const [error, setError] = useState('');
  const { id } = useParams();

  useEffect(() => {
    async function fetchYear() {
      try {
        const response = await fetch(`${apiUrl}/year/${id}`, {
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

        setYearInfo(data);
        console.log(data);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError('An unexpected error occurred... Try again later');
        }
      }
    }

    fetchYear();
  }, []);

  return <>{error}</>;
}
