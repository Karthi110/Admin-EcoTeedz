import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OrderTable } from "@/components/data-Tables/order-table";
import { fetchOrders } from "@/db/actions";
import OrderChart from "@/components/charts/order-chart";
import OrderDetails from "@/components/order-details";

const OrderPage = async () => {
  const data = await fetchOrders();
  return (
    <div>
      <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
        <Breadcrumb className="hidden md:flex">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/dashboard">Dashboard</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Orders</BreadcrumbPage>
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
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-8 px-4 py-10">
        <OrderChart
          month={data.month.length}
          week={data.week.length}
          statusData={{
            fulfied: data.fulfied,
            pending: data.pending,
            canceled: data.canceled,
          }}
        />
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          <Tabs defaultValue="all" className="col-span-3">
            <div className="flex items-center">
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="day">Day</TabsTrigger>
                <TabsTrigger value="week">Week</TabsTrigger>
                <TabsTrigger value="month">Month</TabsTrigger>
              </TabsList>
            </div>
            <TabsContent value="all">
              <Card>
                <CardHeader className="px-7">
                  <CardTitle>Orders</CardTitle>
                  <CardDescription>
                    Recent orders from your store.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <OrderTable data={data.all} />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="day">
              <Card>
                <CardHeader className="px-7">
                  <CardTitle>Orders</CardTitle>
                  <CardDescription>
                    Recent orders from your store past 24 hours.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <OrderTable data={data.day} />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="week">
              <Card>
                <CardHeader className="px-7">
                  <CardTitle>Orders</CardTitle>
                  <CardDescription>
                    Recent orders from your store this week.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <OrderTable data={data.week} />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="month">
              <Card>
                <CardHeader className="px-7">
                  <CardTitle>Orders</CardTitle>
                  <CardDescription>
                    Recent orders from your store this month.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <OrderTable data={data.month} />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          <OrderDetails />
        </div>
      </div>
    </div>
  );
};

export default OrderPage;
