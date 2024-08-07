"use client";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShootingStars } from "@/components/ui/shooting-stars";
import { StarsBackground } from "@/components/ui/stars-background";
const Page = () => {
  return (
    <div className="w-screen h-screen flex items-center justify-center  rounded-md bg-background">
      <div className="mx-auto bg-muted/30 grid w-[450px] p-10 gap-6 rounded-md z-40">
        <div className="grid gap-2 text-center">
          <h1 className="text-3xl font-bold">Login</h1>
          <p className="text-balance text-muted-foreground">
            Enter your email below to login to your account
          </p>
        </div>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              required
            />
          </div>
          <div className="grid gap-2">
            <div className="flex items-center">
              <Label htmlFor="password">Password</Label>
            </div>
            <Input id="password" type="password" required />
          </div>
          <Button type="submit" className="w-full">
            Login
          </Button>
        </div>
        <Button asChild variant="secondary">
          <Link href="/dashboard">Go to dashboard</Link>
        </Button>
      </div>
      <ShootingStars
        minDelay={1000}
        maxDelay={4000}
        starColor="#006769"
        trailColor="#40A578"
        starWidth={10}
        starHeight={2}
      />
      <StarsBackground />
    </div>
  );
};

export default Page;
