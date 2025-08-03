'use client';

import { useState } from 'react';
import Image from 'next/image';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Bookmark } from 'lucide-react';
import { cn } from '@/lib/utils';
import { tutorials, type Tutorial } from '@/lib/data';

type SkillLevel = 'All' | 'Beginner' | 'Intermediate' | 'Advanced';

export default function UpcyclePage() {
  const [filter, setFilter] = useState<SkillLevel>('All');
  const [saved, setSaved] = useState<Set<string>>(new Set());

  const toggleSaved = (id: string) => {
    setSaved((prev) => {
      const newSaved = new Set(prev);
      if (newSaved.has(id)) {
        newSaved.delete(id);
      } else {
        newSaved.add(id);
      }
      return newSaved;
    });
  };

  const filteredTutorials =
    filter === 'All'
      ? tutorials
      : tutorials.filter((t) => t.skillLevel === filter);

  const skillLevels: SkillLevel[] = [
    'All',
    'Beginner',
    'Intermediate',
    'Advanced',
  ];

  const getBadgeVariant = (level: Tutorial['skillLevel']) => {
    switch (level) {
      case 'Beginner':
        return 'default';
      case 'Intermediate':
        return 'secondary';
      case 'Advanced':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  return (
    <>
      <PageHeader
        title="Upcycling Assistant"
        description="Find inspiration and step-by-step guides for your next project."
      >
        <div className="flex items-center gap-2 rounded-lg bg-card p-1 border">
          {skillLevels.map((level) => (
            <Button
              key={level}
              variant={filter === level ? 'default' : 'ghost'}
              onClick={() => setFilter(level)}
              className={cn(
                'capitalize h-8 px-4',
                filter === level &&
                  'bg-primary text-primary-foreground hover:bg-primary/90'
              )}
            >
              {level}
            </Button>
          ))}
        </div>
      </PageHeader>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredTutorials.map((tutorial) => (
          <Card key={tutorial.id} className="flex flex-col">
            <CardHeader className="p-0">
               <div className="aspect-video relative">
                 <Image
                    src={tutorial.imageUrl}
                    alt={tutorial.title}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-t-lg"
                    data-ai-hint="upcycling electronics"
                  />
               </div>
            </CardHeader>
            <CardContent className="p-4 flex-grow">
              <Badge variant={getBadgeVariant(tutorial.skillLevel)} className="mb-2">{tutorial.skillLevel}</Badge>
              <CardTitle className="text-lg font-headline mb-2">{tutorial.title}</CardTitle>
              <p className="text-sm text-muted-foreground">{tutorial.description}</p>
            </CardContent>
            <CardFooter className="p-4 pt-0">
                <Button variant="outline" className="w-full" onClick={() => toggleSaved(tutorial.id)}>
                    <Bookmark className={cn('mr-2 h-4 w-4', saved.has(tutorial.id) && 'fill-current text-primary')} />
                    {saved.has(tutorial.id) ? 'Saved' : 'Save for Later'}
                </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </>
  );
}
