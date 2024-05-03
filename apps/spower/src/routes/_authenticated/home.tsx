import { createFileRoute } from '@tanstack/react-router';
import { AreaChart, Card, DonutChart } from '@tremor/react';

const chartdata = [
  {
    date: '22 Tháng 1',
    SemiAnalysis: 2890,
    'The Pragmatic Engineer': 2338
  },
  {
    date: 'Feb 22',
    SemiAnalysis: 2756,
    'The Pragmatic Engineer': 2103
  },
  {
    date: 'Mar 22',
    SemiAnalysis: 3322,
    'The Pragmatic Engineer': 2194
  },
  {
    date: 'Apr 22',
    SemiAnalysis: 3470,
    'The Pragmatic Engineer': 2108
  },
  {
    date: 'May 22',
    SemiAnalysis: 3475,
    'The Pragmatic Engineer': 1812
  },
  {
    date: 'Jun 22',
    SemiAnalysis: 3129,
    'The Pragmatic Engineer': 1726
  },
  {
    date: 'Jul 22',
    SemiAnalysis: 3490,
    'The Pragmatic Engineer': 1982
  },
  {
    date: 'Aug 22',
    SemiAnalysis: 2903,
    'The Pragmatic Engineer': 2012
  },
  {
    date: 'Sep 22',
    SemiAnalysis: 2643,
    'The Pragmatic Engineer': 2342
  },
  {
    date: 'Oct 22',
    SemiAnalysis: 2837,
    'The Pragmatic Engineer': 2473
  },
  {
    date: 'Nov 22',
    SemiAnalysis: 2954,
    'The Pragmatic Engineer': 3848
  },
  {
    date: 'Dec 22',
    SemiAnalysis: 3239,
    'The Pragmatic Engineer': 3736
  }
];

const datahero = [
  {
    name: 'Noche Holding AG',
    value: 9800
  },
  {
    name: 'Rain Drop AG',
    value: 4567
  },
  {
    name: 'Push Rail AG',
    value: 3908
  },
  {
    name: 'Flow Steal AG',
    value: 2400
  },
  {
    name: 'Tiny Loop Inc.',
    value: 2174
  },
  {
    name: 'Anton Resorts Holding',
    value: 1398
  }
];

const Component = () => {
  const dataFormatter = number =>
    `$${Intl.NumberFormat('us').format(number).toString()}`;

  return (
    <div className={'flex gap-2 p-2'}>
      <Card>
        <DonutChart
          data={datahero}
          variant="donut"
          valueFormatter={dataFormatter}
          onValueChange={v => console.log(v)}
        />
      </Card>
      <Card>
        <AreaChart
          className="h-80"
          data={chartdata}
          index="date"
          categories={['SemiAnalysis', 'The Pragmatic Engineer']}
          colors={['indigo', 'rose']}
          valueFormatter={dataFormatter}
          yAxisWidth={60}
          onValueChange={v => console.log(v)}
        />
      </Card>
    </div>
  );
};

export const Route = createFileRoute('/_authenticated/home')({
  component: Component,
  beforeLoad: () => {
    return {
      title: 'Trang chủ'
    };
  }
});
