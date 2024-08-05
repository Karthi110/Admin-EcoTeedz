"use client";
import { UserTable } from "@/components/data-Tables/user-table";
import { fetchUsers } from "@/db/actions";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Search, PlusCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import UserChart from "@/components/charts/user-chart";
import { useQuery } from "@tanstack/react-query";
import UserDrawer from "@/components/drawers/user-drawer";

const Customers = () => {
  const { data } = useQuery({
    queryKey: ["customers"],
    queryFn: () => fetchUsers(),
  });
  if (!data)
    return (
      <div className="w-full h-full grid grid-cols-4 gap-6 p-6 animate-pulse">
        <div className="w-full h-full bg-muted rounded-md col-span-3" />
        <div className=" grid grid-cols-1 gap-4">
          <div className="w-full h-full bg-muted rounded-md" />
          <div className="w-full h-full bg-muted rounded-md" />
          <div className="w-full h-full bg-muted rounded-md" />
        </div>
      </div>
    );
  return (
    <div>
      <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
        <Breadcrumb className="hidden md:flex">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/dashboard">Dashboard</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>All Customers</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="relative ml-auto flex-1 md:grow-0">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search..."
            className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
          />
        </div>
      </header>
      <div className="flex flex-1 flex-col-reverse lg:flex-row items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-6 mt-3 w-full">
        <Tabs defaultValue="all" className="flex-[1.5] w-full">
          <div className="flex items-center">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
            </TabsList>
            <div className="ml-auto flex items-center gap-2">
              <UserDrawer />
            </div>
          </div>
          <TabsContent value="all">
            <Card>
              <CardHeader>
                <CardTitle>Customers</CardTitle>
                <CardDescription>Manage your customers here.</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <UserTable data={data} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        <UserChart total={data.length} />
      </div>
    </div>
  );
};

export default Customers;
