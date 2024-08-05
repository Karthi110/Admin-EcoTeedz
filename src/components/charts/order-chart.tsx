"use client";
import { Progress } from "../ui/progress";
import React from "react";
import { Button } from "../ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
  CardContent,
} from "../ui/card";
import { Loader2, Plus, TrendingUp } from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../ui/select";
import {
  Pie,
  Sector,
  Label,
  PieChart,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts";
import { PieSectorDataItem } from "recharts/types/polar/Pie";
import {
  ChartConfig,
  ChartStyle,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "../ui/chart";
import { useQuery } from "@tanstack/react-query";
import { fetchPayment } from "@/db/actions";

interface ChartProps {
  month: number;
  week: number;
  statusData: {
    fulfied: number;
    pending: number;
    canceled: number;
  };
}

const OrderChart = ({ month, week, statusData }: ChartProps) => {
  const OrderData = [
    {
      status: "FULFIED",
      orders: statusData.fulfied,
      fill: "var(--color-FULFIED)",
    },
    {
      status: "PENDING",
      orders: statusData.pending,
      fill: "var(--color-PENDING)",
    },
    {
      status: "CANCELED",
      orders: statusData.canceled,
      fill: "var(--color-CANCELED)",
    },
  ];

  const chartConfig = {
    Orders: {
      label: "Orders",
    },
    orders: {
      label: "Orders",
    },
    PENDING: {
      label: "PENDING",
      color: "hsl(var(--chart-3))",
    },
    FULFIED: {
      label: "FULFIED",
      color: "hsl(var(--chart-2))",
    },
    CANCELED: {
      label: "CANCELED",
      color: "hsl(var(--chart-5))",
    },
    paid: {
      label: "paid",
      color: "hsl(var(--chart-1))",
    },
    pending: {
      label: "pending",
      color: "hsl(var(--chart-3))",
    },
    failed: {
      label: "failed",
      color: "hsl(var(--chart-5))",
    },
  } satisfies ChartConfig;

  const id = "pie-interactive";
  const [activeStatus, setActiveStatus] = React.useState(OrderData[0].status);

  const activeIndex = React.useMemo(
    () => OrderData.findIndex((item) => item.status === activeStatus),
    [activeStatus]
  );
  const OrderStatus = React.useMemo(
    () => OrderData.map((item) => item.status),
    []
  );

  const { data, isLoading } = useQuery({
    queryKey: ["payment"],
    queryFn: () => fetchPayment(),
  });

  if (!data)
    return (
      <div className="w-full h-[300px] flex items-center justify-center animate-pulse rounded-md p-2 gap-4">
        <div className="flex-1 aspect-square bg-muted w-full h-full rounded-md" />
        <div className="flex-1 aspect-square bg-muted w-full h-full rounded-md" />
        <div className="flex-1 aspect-square bg-muted w-full h-full rounded-md" />
      </div>
    );

  let TotalOrder = [
    {
      label: "orders",
      paid: data?.paid,
      pending: data?.pending,
      failed: data?.failed,
    },
  ];
  const totalCount =
    TotalOrder[0].paid + TotalOrder[0].pending + TotalOrder[0].failed;

  return (
    <div className="grid grid-cols-2 xl:grid-cols-4 gap-2 ">
      <Card className="col-span-2">
        <CardHeader>
          <CardTitle>Your Orders</CardTitle>
          <CardDescription className="w-fit text-balance leading-relaxed">
            Introducing Our Dynamic Orders Dashboard for Seamless Management and
            Insightful Analysis.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button>Create New Order</Button>
        </CardContent>
        <CardFooter className="w-full flex items-center justify-center gap-2">
          <Card className="flex-1">
            <CardHeader className="pb-2">
              <CardDescription>This Week</CardDescription>
              <CardTitle className="text-4xl flex gap-1 items-center text-green-400">
                <Plus size={24} />
                {week} Orders
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-[.7rem] text-muted-foreground">
                +{(week / 10) * 100}% from last week.
              </div>
            </CardContent>
            <CardFooter>
              <Progress value={week * 10} aria-label="25% increase" />
            </CardFooter>
          </Card>
          <Card className="flex-1">
            <CardHeader className="pb-2">
              <CardDescription>This Month</CardDescription>
              <CardTitle className="text-4xl flex gap-1 items-center text-green-400">
                <Plus size={24} />
                {month} Orders
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-[.7rem] text-muted-foreground">
                +{(month / 100) * 100}% from last month.
              </div>
            </CardContent>
            <CardFooter>
              <Progress value={month} aria-label="12% increase" />
            </CardFooter>
          </Card>
        </CardFooter>
      </Card>
      <Card data-chart={id} className="flex flex-col">
        <ChartStyle id={id} config={chartConfig} />
        <CardHeader className="flex-row items-start space-y-0 pb-0">
          <div className="grid gap-1">
            <CardTitle>Order Shipping Status</CardTitle>
            <CardDescription>
              track the shipping status of orders.
            </CardDescription>
          </div>
          <Select value={activeStatus} onValueChange={setActiveStatus}>
            <SelectTrigger
              className="ml-auto h-7 w-[130px] rounded-lg pl-2.5"
              aria-label="Select a value"
            >
              <SelectValue placeholder="Select month" />
            </SelectTrigger>
            <SelectContent align="end" className="rounded-xl">
              {OrderStatus.map((key) => {
                const config = chartConfig[key as keyof typeof chartConfig];

                if (!config) {
                  return null;
                }

                return (
                  <SelectItem
                    key={key}
                    value={key}
                    className="rounded-lg [&_span]:flex"
                  >
                    <div className="flex items-center gap-2 text-xs">
                      <span
                        className="flex h-3 w-3 shrink-0 rounded-sm"
                        style={{
                          backgroundColor: `var(--color-${key})`,
                        }}
                      />
                      {config?.label}
                    </div>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent className="flex flex-1 justify-center pb-0">
          {isLoading ? (
            <div className="w-full h-[300px] flex items-center justify-center">
              <Loader2 className="animate-spin" size={24} />
            </div>
          ) : (
            <ChartContainer
              id={id}
              config={chartConfig}
              className="mx-auto aspect-square w-full max-w-[310px]"
            >
              <PieChart>
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Pie
                  data={OrderData}
                  dataKey="orders"
                  nameKey="status"
                  innerRadius={85}
                  strokeWidth={4}
                  activeIndex={activeIndex}
                  activeShape={({
                    outerRadius = 0,
                    ...props
                  }: PieSectorDataItem) => (
                    <g>
                      <Sector {...props} outerRadius={outerRadius + 10} />
                      <Sector
                        {...props}
                        outerRadius={outerRadius + 25}
                        innerRadius={outerRadius + 12}
                      />
                    </g>
                  )}
                >
                  <Label
                    content={({ viewBox }) => {
                      if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                        return (
                          <text
                            x={viewBox.cx}
                            y={viewBox.cy}
                            textAnchor="middle"
                            dominantBaseline="middle"
                          >
                            <tspan
                              x={viewBox.cx}
                              y={viewBox.cy}
                              className="fill-foreground text-3xl font-bold"
                            >
                              {OrderData[activeIndex].orders.toLocaleString()}
                            </tspan>
                            <tspan
                              x={viewBox.cx}
                              y={(viewBox.cy || 0) + 24}
                              className="fill-muted-foreground"
                            >
                              Orders
                            </tspan>
                          </text>
                        );
                      }
                    }}
                  />
                </Pie>
              </PieChart>
            </ChartContainer>
          )}
        </CardContent>
      </Card>
      <Card className="flex flex-col">
        <CardHeader className="items-center pb-0">
          <CardTitle>Orders Payment Status</CardTitle>
          <CardDescription>
            track the payment status of the orders
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-1 items-center pb-0">
          {isLoading ? (
            <div className="w-full h-[200px] flex items-center justify-center">
              <Loader2 className="animate-spin" size={24} />
            </div>
          ) : (
            <ChartContainer
              config={chartConfig}
              className="mx-auto aspect-square w-full max-w-[200px]"
            >
              <RadialBarChart
                data={TotalOrder}
                startAngle={-40}
                endAngle={220}
                innerRadius={80}
                outerRadius={140}
              >
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
                  <Label
                    content={({ viewBox }) => {
                      if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                        return (
                          <text
                            x={viewBox.cx}
                            y={viewBox.cy}
                            textAnchor="middle"
                          >
                            <tspan
                              x={viewBox.cx}
                              y={(viewBox.cy || 0) - 16}
                              className="fill-foreground text-2xl font-bold"
                            >
                              {totalCount.toLocaleString()}
                            </tspan>
                            <tspan
                              x={viewBox.cx}
                              y={(viewBox.cy || 0) + 4}
                              className="fill-muted-foreground"
                            >
                              total orders.
                            </tspan>
                          </text>
                        );
                      }
                    }}
                  />
                </PolarRadiusAxis>
                <RadialBar
                  dataKey="paid"
                  stackId="a"
                  cornerRadius={5}
                  fill="var(--color-paid)"
                  className="stroke-transparent stroke-2"
                />
                <RadialBar
                  dataKey="pending"
                  fill="var(--color-pending)"
                  stackId="a"
                  cornerRadius={5}
                  className="stroke-transparent stroke-2"
                />
                <RadialBar
                  dataKey="failed"
                  fill="var(--color-failed)"
                  stackId="a"
                  cornerRadius={5}
                  className="stroke-transparent stroke-2"
                />
              </RadialBarChart>
            </ChartContainer>
          )}
        </CardContent>
        <CardFooter className="flex-col gap-2 text-sm">
          <div className="leading-none text-muted-foreground">
            Showing payment status of the orders.
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default OrderChart;
