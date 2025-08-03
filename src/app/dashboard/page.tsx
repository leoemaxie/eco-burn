import { PageHeader } from '@/components/page-header';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  Award,
  CircleDollarSign,
  Cpu,
  Recycle,
  Star,
  Trophy,
} from 'lucide-react';

const stats = [
  {
    title: 'E-Waste Processed',
    value: '14.2 kg',
    icon: Recycle,
    change: '+1.5kg this month',
  },
  {
    title: 'CO2 Saved',
    value: '88.7 kg',
    icon: Cpu,
    change: 'Equivalent to planting 3 trees',
  },
  {
    title: 'Income Earned',
    value: '$125.50',
    icon: CircleDollarSign,
    change: '+$25 from last sale',
  },
  {
    title: 'Community Rank',
    value: '#1,245',
    icon: Trophy,
    change: 'Top 15%',
  },
];

const badges = [
  { name: 'First Scan', icon: Star, color: 'text-yellow-500' },
  { name: 'Tinker Master', icon: Award, color: 'text-blue-500' },
  { name: 'Eco Pioneer', icon: Recycle, color: 'text-primary' },
  { name: 'Marketplace Mogul', icon: CircleDollarSign, color: 'text-amber-600' },
];

const leaderboard = [
  { rank: 1, user: 'CaptainCircuit', points: 12500, avatar: 'https://placehold.co/40x40' },
  { rank: 2, user: 'MotherboardMary', points: 11800, avatar: 'https://placehold.co/40x40' },
  { rank: 3, user: 'ResistorRick', points: 10500, avatar: 'https://placehold.co/40x40' },
  { rank: 4, user: 'Eco Warrior', points: 9800, avatar: 'https://placehold.co/40x40' },
  { rank: 5, user: 'DiodeDave', points: 9200, avatar: 'https://placehold.co/40x40' },
];

export default function DashboardPage() {
  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Welcome back, Eco Warrior! Here's your impact summary."
      />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-headline">
                {stat.value}
              </div>
              <p className="text-xs text-muted-foreground">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid gap-6 mt-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Community Leaderboard</CardTitle>
            <CardDescription>
              See how you stack up against other upcyclers.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">Rank</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead className="text-right">Points</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leaderboard.map((player) => (
                  <TableRow key={player.rank} className={player.user === 'Eco Warrior' ? 'bg-primary/10' : ''}>
                    <TableCell className="font-medium">{player.rank}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={player.avatar} data-ai-hint="profile photo"/>
                          <AvatarFallback>
                            {player.user.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <span>{player.user}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">{player.points.toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Reward Badges</CardTitle>
            <CardDescription>Your collected achievements.</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            {badges.map((badge) => (
              <div key={badge.name} className="flex flex-col items-center justify-center gap-2 p-4 rounded-lg bg-secondary/50 text-center">
                <badge.icon className={`h-8 w-8 ${badge.color}`} />
                <p className="text-sm font-medium">{badge.name}</p>
              </div>
            ))}
             <div className="flex flex-col items-center justify-center gap-2 p-4 rounded-lg bg-secondary/20 text-center border-2 border-dashed">
                <div className="h-8 w-8 bg-muted-foreground/20 rounded-full"/>
                <p className="text-sm font-medium text-muted-foreground">Next Badge</p>
              </div>
              <div className="flex flex-col items-center justify-center gap-2 p-4 rounded-lg bg-secondary/20 text-center border-2 border-dashed">
                <div className="h-8 w-8 bg-muted-foreground/20 rounded-full"/>
                <p className="text-sm font-medium text-muted-foreground">Next Badge</p>
              </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
