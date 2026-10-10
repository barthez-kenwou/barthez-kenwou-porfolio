import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { cn } from '@/shared/lib/utils';

export type TimeseriesPoint = {
  date: string;
  visitors: number;
  pageviews: number;
};

export type BarRow = {
  id: string;
  label: string;
  value: number;
};

const CHART = {
  visitors: 'hsl(var(--chart-1))',
  pageviews: 'hsl(var(--chart-3))',
  bar: 'hsl(var(--chart-2))',
  grid: 'hsl(var(--border))',
  tick: 'hsl(var(--muted-foreground))',
  tooltipBg: 'hsl(var(--card))',
  tooltipBorder: 'hsl(var(--border))',
  tooltipFg: 'hsl(var(--foreground))',
} as const;

const SOURCE_COLORS = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
];

function formatDayLabel(isoDate: string, fr: boolean): string {
  const d = new Date(`${isoDate}T12:00:00`);
  if (Number.isNaN(d.getTime())) return isoDate.slice(5) || isoDate;
  return d.toLocaleDateString(fr ? 'fr-FR' : 'en-GB', { weekday: 'short', day: 'numeric' });
}

function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ name?: string; value?: number; color?: string }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="rounded-lg border px-3 py-2 text-xs shadow-md"
      style={{
        background: CHART.tooltipBg,
        borderColor: CHART.tooltipBorder,
        color: CHART.tooltipFg,
      }}
    >
      {label ? <p className="mb-1.5 font-medium">{label}</p> : null}
      <ul className="space-y-1">
        {payload.map((entry) => (
          <li key={String(entry.name)} className="flex items-center justify-between gap-6">
            <span className="inline-flex items-center gap-1.5 text-muted-foreground">
              <span
                className="inline-block size-2 rounded-full"
                style={{ background: entry.color }}
              />
              {entry.name}
            </span>
            <span className="tabular-nums font-medium">{entry.value ?? 0}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** 7-day visitors trend (area) + pageviews (line overlay via second area). */
export function VisitorsLineChart({
  series,
  fr,
  className,
}: {
  series: TimeseriesPoint[];
  fr: boolean;
  className?: string;
}) {
  if (!series.length) {
    return (
      <p className={cn('text-xs text-muted-foreground', className)}>
        {fr ? 'Pas de série temporelle.' : 'No timeseries yet.'}
      </p>
    );
  }

  const data = series.map((p) => ({
    ...p,
    label: formatDayLabel(p.date, fr),
  }));

  const visitorsLabel = fr ? 'Visiteurs' : 'Visitors';
  const pageviewsLabel = fr ? 'Pages vues' : 'Pageviews';

  return (
    <div className={cn('w-full', className)}>
      <div className="h-48 w-full sm:h-56">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="visitorsFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={CHART.visitors} stopOpacity={0.28} />
                <stop offset="100%" stopColor={CHART.visitors} stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke={CHART.grid} strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="label"
              tick={{ fill: CHART.tick, fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              dy={6}
            />
            <YAxis
              allowDecimals={false}
              width={32}
              tick={{ fill: CHART.tick, fontSize: 11 }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              content={<ChartTooltip />}
              cursor={{ stroke: CHART.grid, strokeDasharray: '4 4' }}
            />
            <Area
              type="monotone"
              dataKey="pageviews"
              name={pageviewsLabel}
              stroke={CHART.pageviews}
              strokeWidth={1.5}
              strokeDasharray="4 3"
              fill="transparent"
              dot={false}
              activeDot={{ r: 3 }}
            />
            <Area
              type="monotone"
              dataKey="visitors"
              name={visitorsLabel}
              stroke={CHART.visitors}
              strokeWidth={2}
              fill="url(#visitorsFill)"
              dot={{ r: 3, strokeWidth: 0, fill: CHART.visitors }}
              activeDot={{ r: 4 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-2 flex items-center gap-4 text-[10px] text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-block size-2 rounded-full" style={{ background: CHART.visitors }} />
          {visitorsLabel}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span
            className="inline-block h-px w-3 border-t border-dashed"
            style={{ borderColor: CHART.pageviews }}
          />
          {pageviewsLabel}
        </span>
      </div>
    </div>
  );
}

/** Vertical column chart for traffic sources. */
export function SourcesBarChart({
  rows,
  fr,
  className,
}: {
  rows: BarRow[];
  fr: boolean;
  className?: string;
}) {
  if (!rows.length) {
    return (
      <p className={cn('text-xs text-muted-foreground', className)}>
        {fr ? 'Pas encore de sources' : 'No sources yet'}
      </p>
    );
  }

  const data = rows.map((row) => ({
    name: row.label.length > 14 ? `${row.label.slice(0, 12)}…` : row.label,
    fullName: row.label,
    value: row.value,
  }));

  return (
    <div className={cn('w-full', className)}>
      <div className="h-44 w-full sm:h-48">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 4, left: 0, bottom: 4 }} barCategoryGap="28%">
            <CartesianGrid stroke={CHART.grid} strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="name"
              tick={{ fill: CHART.tick, fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              interval={0}
            />
            <YAxis
              allowDecimals={false}
              width={28}
              tick={{ fill: CHART.tick, fontSize: 11 }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              cursor={{ fill: 'hsl(var(--muted) / 0.35)' }}
              content={({ active, payload }) => {
                if (!active || !payload?.[0]) return null;
                const item = payload[0].payload as { fullName: string; value: number };
                return (
                  <ChartTooltip
                    active
                    label={item.fullName}
                    payload={[{ name: fr ? 'Visiteurs' : 'Visitors', value: item.value, color: CHART.bar }]}
                  />
                );
              }}
            />
            <Bar dataKey="value" name={fr ? 'Visiteurs' : 'Visitors'} radius={[6, 6, 0, 0]} maxBarSize={48}>
              {data.map((_, index) => (
                <Cell key={data[index].name} fill={SOURCE_COLORS[index % SOURCE_COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

/** Vertical bars for product signals with data. */
export function SignalsBarChart({
  rows,
  fr,
  className,
}: {
  rows: BarRow[];
  fr: boolean;
  className?: string;
}) {
  if (!rows.length) {
    return (
      <p className={cn('text-xs text-muted-foreground', className)}>
        {fr
          ? 'Pas encore de signal produit sur 7 jours.'
          : 'No product signals in the last 7 days.'}
      </p>
    );
  }

  const data = rows.map((row) => ({
    name: row.label.length > 12 ? `${row.label.slice(0, 10)}…` : row.label,
    fullName: row.label,
    value: row.value,
  }));

  return (
    <div className={cn('w-full', className)}>
      <div className="h-44 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 4, left: 0, bottom: 4 }} barCategoryGap="24%">
            <CartesianGrid stroke={CHART.grid} strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="name"
              tick={{ fill: CHART.tick, fontSize: 10 }}
              tickLine={false}
              axisLine={false}
              interval={0}
            />
            <YAxis
              allowDecimals={false}
              width={28}
              tick={{ fill: CHART.tick, fontSize: 11 }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              cursor={{ fill: 'hsl(var(--muted) / 0.35)' }}
              content={({ active, payload }) => {
                if (!active || !payload?.[0]) return null;
                const item = payload[0].payload as { fullName: string; value: number };
                return (
                  <ChartTooltip
                    active
                    label={item.fullName}
                    payload={[
                      {
                        name: fr ? 'Visiteurs uniques' : 'Unique visitors',
                        value: item.value,
                        color: CHART.visitors,
                      },
                    ]}
                  />
                );
              }}
            />
            <Bar
              dataKey="value"
              fill={CHART.visitors}
              radius={[6, 6, 0, 0]}
              maxBarSize={40}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
