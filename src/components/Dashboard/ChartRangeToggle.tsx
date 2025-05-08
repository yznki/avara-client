import { useTransactionRange } from '@/context/TransactionRangeContext';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

export function ChartRangeToggle() {
  const { range, setRange } = useTransactionRange();

  return (
    <div className="flex items-center justify-end px-2">
      <ToggleGroup
        type="single"
        value={range}
        onValueChange={(val) => {
          if (val) setRange(val as '30D' | '6M' | '1Y');
        }}
        className="rounded-md border border-muted text-xs data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
      >
        <ToggleGroupItem value="30D" className="px-4 py-2">
          30D
        </ToggleGroupItem>
        <ToggleGroupItem value="6M" className="px-4 py-2">
          6M
        </ToggleGroupItem>
        <ToggleGroupItem value="1Y" className="px-4 py-2">
          1Y
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
}
