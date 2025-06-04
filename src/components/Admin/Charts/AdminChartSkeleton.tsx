'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface Props {
  title?: string;
  description?: string;
  footerText?: string;
}

const AdminChartSkeleton = ({
  title = 'Loading chart...',
  description = 'Please wait while we load the data',
  footerText = 'Chart data is loading',
}: Props) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center h-[280px] w-full">
          <Skeleton className="w-full h-full rounded-md" />
        </div>
      </CardContent>
      <CardFooter>
        <div className="text-muted-foreground text-sm">{footerText}</div>
      </CardFooter>
    </Card>
  );
};

export default AdminChartSkeleton;
