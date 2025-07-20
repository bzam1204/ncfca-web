"use client"

import * as React from "react"
import {Pie, PieChart} from "recharts"
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {Skeleton} from "@/components/ui/skeleton"

interface GenderData {
  label: 'Masculino' | 'Feminino';
  value: number;
  color: string;
}

interface GenderDistributionChartProps {
  data: GenderData[];
  isLoading: boolean;
}

const chartConfig = {
  members : {
    label : "Membros",
  },
  masculino : {
    label : "Masculino",
    color : "hsl(var(--chart-1))",
  },
  feminino : {
    label : "Feminino",
    color : "var(--chart-2)",
  },
  
} satisfies ChartConfig

export function GenderDistributionChart({data, isLoading}: GenderDistributionChartProps) {
  const totalMembers = React.useMemo(() => {
    return data.reduce((acc, curr) => acc + curr.value, 0)
  }, [data])

  const chartData = data.map(item => ({
    name : item.label.toLowerCase(),
    value : item.value,
    fill : `var(--color-${item.color.toLowerCase()})`,
  }))

  if (isLoading) {
    return <Skeleton className="h-[350px] w-full" />
  }

  return (
      <Card className="flex flex-col">
        <CardHeader className="items-center pb-0">
          <CardTitle>Distribuição por Gênero</CardTitle>
          <CardDescription>Composição atual do clube</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 pb-4">
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
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={60}
                  strokeWidth={5}
              >
              </Pie>
            </PieChart>
          </ChartContainer>
        </CardContent>
      </Card>
  )
}
