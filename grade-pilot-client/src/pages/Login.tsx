import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Login() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 pb-40">
      <h1 className="text-6xl font-bold">Login</h1>
      <form className="flex w-100 flex-col gap-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" />
        </div>
        <Button type="submit">Login</Button>
      </form>
      <p>
        Don't have an account?{" "}
        <a href="" className="font-bold">
          Sign up
        </a>
      </p>
    </div>
  );
}
