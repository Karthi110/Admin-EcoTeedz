"use client";
import { DashboardAnalytics } from "@/components/charts/analytics";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  fetchActiveProducts,
  fetchOrders,
  monthlyIncome,
  recentTransactions,
  totalEarnings,
} from "@/db/actions";
import { formatAmount } from "@/lib/utils";
import { useQueries } from "@tanstack/react-query";
import {
  Activity,
  IndianRupee,
  BadgeIndianRupee,
  ReceiptIndianRupee,
  Search,
} from "lucide-react";
import Link from "next/link";

const Dashboard = () => {
  const data = useQueries({
    queries: [
      {
        queryKey: ["active_products"],
        queryFn: () => fetchActiveProducts(),
      },
      {
        queryKey: ["revenue"],
        queryFn: () => totalEarnings(),
      },
      {
        queryKey: ["monthly"],
        queryFn: () => monthlyIncome(),
      },
      {
        queryKey: ["recent_transaction"],
        queryFn: () => recentTransactions(),
      },
    ],
  });

  if (!data[0].data || !data[1].data || !data[2].data || !data[3].data) {
    return (
      <div className="w-full h-fit p-4 rounded-md animate-pulse">
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 p-4">
          <div className="h-[120px] w-full bg-muted rounded-md" />
          <div className="h-full w-full bg-muted rounded-md" />
          <div className="h-full w-full  bg-muted rounded-md" />
          <div className="h-full w-full bg-muted rounded-md" />
        </div>
        <div className="grid grid-cols-3 gap-4 p-4">
          <div className="h-[300px] bg-muted rounded-md" />
          <div className="h-full bg-muted rounded-md" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
        <Breadcrumb className="hidden md:flex">
          <BreadcrumbList>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Dashboard</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Revenue
              </CardTitle>
              <IndianRupee className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                +{formatAmount(data[1].data?.all!)}
              </div>
              <p className="text-xs text-muted-foreground">
                +{formatAmount(data[1].data?.day)} from last 24 hours.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                This Week Revenue
              </CardTitle>
              <BadgeIndianRupee className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                +{formatAmount(data[1].data?.week!)}
              </div>
              <p className="text-xs text-muted-foreground">
                +{formatAmount(data[1].data?.day!)} from last 24 hours.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Today Revenue
              </CardTitle>
              <ReceiptIndianRupee className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                +{formatAmount(data[1].data?.day!)}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Products
              </CardTitle>
              <Activity className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+{data[0].data.active}</div>
              <p className="text-xs text-muted-foreground">
                +{data[0].data.latest} since last 24 hours.
              </p>
            </CardContent>
          </Card>
        </div>
        <div className="grid gap-4 md:gap-8 xl:grid-cols-2">
          <DashboardAnalytics data={data[2].data} />
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions.</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-8 px-3 py-2  ">
              {data[3].data.map((d, i) => (
                <div className="flex items-center gap-4" key={i}>
                  <Avatar className="hidden h-9 w-9 sm:flex">
                    <AvatarImage src={d.User?.avatarUrl!} alt="Avatar" />
                    <AvatarFallback>{d.User?.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="grid gap-1">
                    <p className="text-sm font-medium leading-none">
                      {d.User?.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {d.User?.email}
                    </p>
                  </div>
                  <div className="ml-auto font-medium">
                    +{formatAmount(d.totalAmount)}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
