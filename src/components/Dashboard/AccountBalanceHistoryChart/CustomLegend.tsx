import { type LegendProps } from 'recharts';

export default function CustomLegend({ payload }: LegendProps) {
  if (!payload) return null;

  return (
    <div className="flex gap-4 px-2 pb-4 text-sm items-center w-full justify-center">
      {payload.map((entry) => (
        <div key={entry.value} className="flex items-center gap-2">
          <span
            className="inline-block h-2 w-2 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="capitalize text-muted-foreground">{entry.value}</span>
        </div>
      ))}
    </div>
  );
}
