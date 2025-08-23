import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  const submitLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = { email, password };
    try {
      const response = await fetch(`${apiUrl}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.customMessage ||
            'An unexpected error occured... Try again later',
        );
      }

      login(data.user, data.token);
      navigate('/dashboard');
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An unexpected error occurred... Try again later');
      }
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 pb-40">
      <h1 className="text-6xl font-bold">Login</h1>
      <form className="flex w-100 flex-col gap-4" onSubmit={submitLogin}>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            type="email"
            value={email}
            id="email"
            autoComplete="email"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            type="password"
            value={password}
            id="password"
            autoComplete="current-password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <Button type="submit">Login</Button>
      </form>
      {error && <p className="text-red-400">{error}</p>}
      <p>
        Don't have an account?{' '}
        <a href="" className="font-bold">
          Sign up
        </a>
      </p>
    </div>
  );
}
