'use client';

import Link from 'next/link';
import { format, parseISO } from 'date-fns';
import { XAxis, YAxis, CartesianGrid, AreaChart, Area } from 'recharts';

import StyledBox from '@/app/lib/components/StyledBox';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/app/lib/components/ui/chart';
import { Button } from '@/app/lib/components/Button';
import { useLeagueControlPanel } from '@/app/control-panel/_components/LeagueControlPanelProvider';

export default function WebsiteStatistics() {
  // TODO: create dashboard statistics endpoint

  const { isAdministrator } = useLeagueControlPanel();

  return (
    <div className='relative flex gap-6 pl-0'>
      {isAdministrator() && <WebsiteVisitsChart />}

      <WebsiteCreatedTotals />
    </div>
  );
}

function WebsiteVisitsChart() {
  // todo?: pass empty chart data when fetching statistics?
  const chartData = [
    { week: '2024-02-05T10:00:00Z', visits: 1200 },
    { week: '2024-02-12T10:00:00Z', visits: 1400 },
    { week: '2024-02-19T10:00:00Z', visits: 2100 },
    { week: '2024-02-26T10:00:00Z', visits: 1800 },
    { week: '2024-03-04T10:00:00Z', visits: 2400 },
    { week: '2024-03-11T10:00:00Z', visits: 2200 },
    { week: '2024-03-18T10:00:00Z', visits: 2600 },
    { week: '2024-03-25T10:00:00Z', visits: 2800 },
    { week: '2024-04-01T10:00:00Z', visits: 2450 },
    { week: '2024-04-08T10:00:00Z', visits: 2165 },
  ];

  const chartConfig = {
    visits: {
      label: 'Desktop',
      color: '#03C988',
    },
  } satisfies ChartConfig;

  return (
    <StyledBox
      classes='w-[550px] p-6 pl-0 sm:min-w-[550px] sm:h-[405px]'
      boxShadow
    >
      <div className='mb-8 pl-6 text-lg font-bold'>Weekly Website Visits</div>
      <ChartContainer config={chartConfig}>
        <AreaChart accessibilityLayer data={chartData}>
          <defs>
            <linearGradient id='fillDesktop' x1='0' y1='0' x2='0' y2='1'>
              <stop
                offset='5%'
                stopColor='var(--color-visits)'
                stopOpacity={0.8}
              />
              <stop
                offset='95%'
                stopColor='var(--color-visits)'
                stopOpacity={0.1}
              />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} strokeOpacity={0.4} />
          <YAxis
            dataKey='visits'
            tickLine={false}
            axisLine={false}
            tickMargin={8}
          />
          <XAxis
            dataKey='week'
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickFormatter={(dateString) => {
              const date = parseISO(dateString);
              return format(date, 'MMM d');
            }}
          />
          <ChartTooltip
            cursor={false}
            content={
              <ChartTooltipContent indicator='dot' className='bg-white' />
            }
            labelFormatter={(dateString) => {
              const date = parseISO(dateString);
              return format(date, 'MMM d');
            }}
          />
          <Area
            dataKey='visits'
            type='natural'
            fill='url(#fillDesktop)'
            fillOpacity={0.4}
            stroke='var(--color-visits)'
            stackId='a'
          />
        </AreaChart>
      </ChartContainer>
    </StyledBox>
  );
}

function WebsiteCreatedTotals() {
  return (
    <StyledBox classes='flex p-6 h-full gap-6 w-full sm:h-[405px]'>
      <StyledBox classes='w-full p-6 flex flex-col justify-between' boxShadow>
        <div className='h-full space-y-2 '>
          <div className='text-lg font-medium'>Total Teams</div>
          <div className='flex h-full w-full items-center justify-center pb-12 text-[48px] font-bold text-secondary/80'>
            46
          </div>
        </div>

        <Link href={'#'}>
          <Button className='!h-10 w-full'>View Teams</Button>
        </Link>
      </StyledBox>
      <StyledBox classes='w-full p-6 flex flex-col justify-between' boxShadow>
        <div className='h-full space-y-2'>
          <div className='text-lg font-medium'>Total Players</div>
          <div className='flex h-full w-full items-center justify-center pb-12 text-[48px] font-bold text-secondary/80'>
            545
          </div>{' '}
        </div>

        <Link href={'#'}>
          <Button className='!h-10 w-full'>View Players</Button>
        </Link>
      </StyledBox>
    </StyledBox>
  );
}
