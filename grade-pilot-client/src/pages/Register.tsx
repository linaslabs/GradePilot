import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  const submitRegistration = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = { name, email, password };
    try {
      const response = await fetch(`${apiUrl}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.customMessage || // Server sends back a custom message if its one the user needs to visually see
            'An unexpected error occured... Try again later',
        );
      }

      login(data.user, data.token);
      navigate('/onboarding');
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message); /// This also catches front end errors and displays them to the user. Front-end should be secure though so no worries.
      } else {
        setError('An unexpected error occurred... Try again later');
      }
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 pb-40">
      <h1 className="text-6xl font-bold">Sign Up</h1>
      <form className="flex w-100 flex-col gap-4" onSubmit={submitRegistration}>
        <div className="space-y-2">
          <Label htmlFor="register-name"> Full Name</Label>
          <Input
            type="text"
            id="register-name"
            value={name}
            autoComplete="name"
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="register-email">Email</Label>
          <Input
            type="email"
            id="register-email"
            value={email}
            autoComplete="email"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="register-password">Password</Label>
          <Input
            type="password"
            id="register-password"
            value={password}
            autoComplete="new-password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <Button type="submit">Register</Button>
      </form>
      {error && <p className="text-red-400">{error}</p>}

      <p>
        Already have an account?{' '}
        <a href="/login" className="font-bold">
          Log in
        </a>
      </p>
    </div>
  );
}
