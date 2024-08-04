"use client";
import {
  House,
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users2,
} from "lucide-react";
import React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import path from "path";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

const SIDEBAR_OPTS = [
  {
    label: "Home",
    icon: <House size={24} />,
    path: "/",
  },
  {
    label: "Dashboard",
    icon: <LayoutDashboard size={24} />,
    path: "/dashboard",
  },
  {
    label: "Products",
    icon: <Package size={24} />,
    path: "/products",
  },
  {
    label: "Orders",
    icon: <ShoppingCart size={24} />,
    path: "/orders",
  },
  {
    label: "Customers",
    icon: <Users2 size={24} />,
    path: "/customers",
  },
] as const;

const Sidebar = () => {
  const pathname = usePathname();
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <aside className="fixed inset-y-0 left-0 z-10 hidden w-[4%] flex-col border-r bg-background sm:flex">
        <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
          <TooltipProvider>
            {SIDEBAR_OPTS.map((opts, idx) => (
              <Tooltip key={idx}>
                <TooltipTrigger asChild>
                  <Link
                    href={opts.path}
                    className={cn(
                      "flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground p-1",
                      pathname === opts.path && "hover:text-primary bg-muted"
                    )}
                  >
                    {opts.icon}
                    <span className="sr-only">{opts.label}</span>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right">{opts.label}</TooltipContent>
              </Tooltip>
            ))}
          </TooltipProvider>
        </nav>
      </aside>
    </div>
  );
};

export default Sidebar;
