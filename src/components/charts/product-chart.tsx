"use client";

import { Loader2 } from "lucide-react";
import { Label, Pie, PieChart } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useQuery } from "@tanstack/react-query";
import { CountProductsByStatus } from "@/db/actions";

export function ProductChart() {
  const { data, isLoading } = useQuery({
    queryKey: ["chart_data"],
    queryFn: () => CountProductsByStatus(),
  });

  let d: any = [];

  data?.map((dat) =>
    d.push({
      status: dat.status,
      count: dat._count.id,
      fill: `var(--color-${dat.status})`,
    })
  );

  const chartConfig = {
    count: {
      label: "Total Products",
    },
    DRAFT: {
      label: "Draft",
      color: "hsl(var(--chart-1))",
    },
    ACTIVE: {
      label: "Active",
      color: "hsl(var(--chart-2))",
    },
    ARCHIVED: {
      label: "Archived",
      color: "hsl(var(--chart-3))",
    },
  } satisfies ChartConfig;

  let total = 0;

  data?.map((d) => (total += d._count.id));

  return (
    <div className="flex-[.5] grid grid-cols-1 mt-10 gap-2 p-1 w-full">
      <Card className="flex flex-col ">
        <CardHeader className="items-center pb-0">
          <CardTitle>Product Status</CardTitle>
          <CardDescription>All Products</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 pb-0">
          {isLoading ? (
            <div className="w-full h-[250px] flex items-center justify-center">
              <Loader2 className="animate-spin" size={24} />
            </div>
          ) : (
            <ChartContainer
              config={chartConfig}
              className="mx-auto aspect-square max-h-[250px]"
            >
              <PieChart>
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Pie
                  data={d}
                  dataKey="count"
                  nameKey="status"
                  innerRadius={60}
                  strokeWidth={4}
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
                              {total}
                            </tspan>
                            <tspan
                              x={viewBox.cx}
                              y={(viewBox.cy || 0) + 24}
                              className="fill-muted-foreground"
                            >
                              Total Products
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
    </div>
  );
}
