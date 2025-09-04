import { useAuth } from '@/hooks/useAuth';
import React, { useEffect, useState } from 'react';

export default function Overview() {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const { token } = useAuth();
  const [degreeInfo, setDegreeInfo] = useState({});
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchDegree() {
      try {
        const response = await fetch(`${apiUrl}/degree/my-degree`, {
          // GET doesn't require the usual options (its inferred)
          headers: {
            authorization: `Bearer ${token}`,
          },
        });

        /* Code doesn't fully handle JSON parsing errors (e.g. 404 error), I had this before, it could spit out a verbose error for the front end user,
        however, I assume this will be impossible now I have verified the fetch endpoints are correct. This applies to the other fetches */
        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.customMessage ||
              'An unexpected error occured... Try again later',
          );
        }

        setDegreeInfo(data);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError('An unexpected error occurred... Try again later');
        }
      }
    }

    fetchDegree();
  }, []);

  return (
    <>
      Coming soon!
      {error}
    </>
  );
}
