"use client";

import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";

import { Progress } from "@/components/ui/progress";
import { fetchUsersByDate } from "@/db/actions";
import { useQuery } from "@tanstack/react-query";
import { Loader2, Plus } from "lucide-react";

export function UserChart({ total }: { total: number }) {
  const { data, isLoading } = useQuery({
    queryKey: ["week_data"],
    queryFn: () => fetchUsersByDate(),
  });

  const chartData = [
    { Type: "user", visitors: total, fill: "var(--color-safari)" },
  ];

  const chartConfig = {
    visitors: {
      label: "Visitors",
    },
    safari: {
      label: "Users",
      color: "hsl(var(--chart-2))",
    },
  } satisfies ChartConfig;

  return (
    <div className="flex-[.5] grid grid-cols-2 lg:grid-cols-1 items-center justify-center gap-6 mt-10 w-full p-1">
      <div className="grid grid-cols-1 gap-4 w-full">
        <Card className="h-fit">
          <CardHeader className="pb-2">
            <CardDescription>This Week</CardDescription>
            <CardTitle className="text-3xl">+{data?.week} Customers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">
              +{data?.week} from last Week
            </div>
          </CardContent>
          <CardFooter>
            <Progress value={data?.week!} aria-label="25% increase" />
          </CardFooter>
        </Card>
        <Card className="h-fit">
          <CardHeader className="pb-2">
            <CardDescription>This Month</CardDescription>
            <CardTitle className="text-3xl">+{data?.month} Customers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">
              +{data?.month} from last Month
            </div>
          </CardContent>
          <CardFooter>
            <Progress value={data?.month! * 0.1} aria-label="25% increase" />
          </CardFooter>
        </Card>
      </div>
      <Card className="flex flex-col w-full">
        <CardHeader className="items-center pb-0">
          <CardTitle>Total Number of Customers</CardTitle>
          <CardDescription>Tracks total Customers.</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 pb-0">
          {isLoading ? (
            <div className="w-full h-[200px] flex items-center justify-center">
              <Loader2 className="animate-spin" size={24} />
            </div>
          ) : (
            <ChartContainer
              config={chartConfig}
              className="mx-auto aspect-square max-h-[200px]"
            >
              <RadialBarChart
                data={chartData}
                startAngle={0}
                endAngle={100}
                innerRadius={80}
                outerRadius={110}
              >
                <PolarGrid
                  gridType="circle"
                  radialLines={false}
                  stroke="none"
                  className="first:fill-muted last:fill-background"
                  polarRadius={[86, 74]}
                />
                <RadialBar dataKey="visitors" background cornerRadius={10} />
                <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
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
                              className="fill-foreground text-4xl font-bold"
                            >
                              {chartData[0].visitors.toLocaleString()}
                            </tspan>
                            <tspan
                              x={viewBox.cx}
                              y={(viewBox.cy || 0) + 24}
                              className="fill-muted-foreground"
                            >
                              Customers
                            </tspan>
                          </text>
                        );
                      }
                    }}
                  />
                </PolarRadiusAxis>
              </RadialBarChart>
            </ChartContainer>
          )}
        </CardContent>
        <CardFooter className="flex-col gap-2 text-sm">
          <h1 className="text-sm font-semibold flex items-center justify-center">
            <Plus className="w-4 h-4 text-green-400" />
            <span className="text-green-400 text-base mr-1">{data?.day}</span>
            customers in Last 24 Hours.
          </h1>
          total Customers for EcoTeedz shop.
        </CardFooter>
      </Card>
    </div>
  );
}

export default UserChart;
