import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Clock, Users } from "lucide-react";
import { Party } from '@/types';

interface WaitlistStatusProps {
  party: Party;
  position: number;
  canCheckIn: boolean;
  onCheckIn: () => void;
}

export function WaitlistStatus({ party, position, canCheckIn, onCheckIn }: WaitlistStatusProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (party.status === 'checked-in' && party.serviceEndTime) {
      const interval = setInterval(() => {
        const now = Date.now();
        const start = party.serviceEndTime! - (party.size * 3000);
        const total = party.serviceEndTime! - start;
        const elapsed = now - start;
        setProgress(Math.min(100, (elapsed / total) * 100));
      }, 100);

      return () => clearInterval(interval);
    }
  }, [party]);

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Users className="h-6 w-6" />
            {party.name}'s Party
          </span>
          <span className="text-sm font-normal text-muted-foreground">
            {party.size} {party.size === 1 ? 'person' : 'people'}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {party.status === 'waiting' && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>Position in queue: {position}</span>
          </div>
        )}
        {party.status === 'checked-in' && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Service Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} />
          </div>
        )}
      </CardContent>
      <CardFooter>
        {party.status === 'waiting' && canCheckIn && (
          <Button onClick={onCheckIn} className="w-full">
            Check In
          </Button>
        )}
        {party.status === 'checked-in' && (
          <Button disabled className="w-full">
            Service in Progress
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}