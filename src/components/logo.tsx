import { Recycle } from 'lucide-react';

export function Logo() {
  return (
    <div className="flex items-center gap-2">
      <Recycle className="h-7 w-7 text-primary" />
      <h1 className="text-2xl font-bold font-headline text-primary">UpCycleX</h1>
    </div>
  );
}
