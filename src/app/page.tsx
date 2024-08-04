import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LeafyGreen } from "lucide-react";
const Page = () => {
  return (
    <div className="w-full lg:grid lg:grid-cols-2 min-h-screen">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
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
          <Button asChild variant="ghost">
            <Link href="/dashboard">Go to dashboard</Link>
          </Button>
        </div>
      </div>
      <div className="hidden bg-muted lg:block">
        <div className="h-full w-full object-cover flex items-center justify-center">
          <LeafyGreen className="w-1/2 h-1/2 fill-green-400 text-background" />
        </div>
      </div>
    </div>
  );
};

export default Page;
