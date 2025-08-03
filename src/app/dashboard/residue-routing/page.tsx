import Image from 'next/image';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ecoBurnUnits, type EcoBurnUnit } from '@/lib/data';
import { cn } from '@/lib/utils';
import { MapPin, Power, Flame } from 'lucide-react';

const getStatusClass = (status: EcoBurnUnit['status']) => {
  switch (status) {
    case 'Online':
      return 'bg-green-500';
    case 'Offline':
      return 'bg-red-500';
    case 'Maintenance':
      return 'bg-yellow-500';
  }
};

export default function ResidueRoutingPage() {
  return (
    <>
      <PageHeader
        title="Residue Routing"
        description="Find the nearest EcoBurn unit for non-recyclable components."
      />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {ecoBurnUnits.map((unit) => (
            <Card key={unit.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row justify-between items-start">
                <div>
                  <CardTitle className="font-headline">{unit.name}</CardTitle>
                  <CardDescription className="flex items-center gap-2 pt-1">
                    <MapPin className="h-4 w-4" />
                    {unit.location}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2 text-sm font-medium">
                  <span
                    className={cn(
                      'h-3 w-3 rounded-full animate-pulse',
                      getStatusClass(unit.status)
                    )}
                  />
                  <span>{unit.status}</span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-6 text-sm text-muted-foreground">
                    <div className='flex items-center gap-2'>
                        <Power className="h-4 w-4 text-primary" />
                        <span>CO₂: {unit.emissions.co2} kg/h</span>
                    </div>
                    <div className='flex items-center gap-2'>
                        <Flame className="h-4 w-4 text-accent" />
                        <span>NOx: {unit.emissions.nox} kg/h</span>
                    </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-2">
                <div className="aspect-square relative w-full">
                    <Image
                    src="https://placehold.co/600x600"
                    alt="Map of EcoBurn units"
                    layout="fill"
                    objectFit="cover"
                    className="rounded-md"
                    data-ai-hint="city map"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-md" />
                    <div className="absolute bottom-4 left-4 text-primary-foreground">
                        <h3 className="font-bold text-lg font-headline">4 Units Nearby</h3>
                        <p className="text-sm">Map view coming soon</p>
                    </div>
                </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
