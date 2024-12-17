import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Users } from "lucide-react";

interface JoinWaitlistProps {
  onJoin: (name: string, size: number) => void;
}

export function JoinWaitlist({ onJoin }: JoinWaitlistProps) {
  const [name, setName] = useState('');
  const [size, setSize] = useState(1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && size > 0) {
      onJoin(name.trim(), size);
      setName('');
      setSize(1);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-6 w-6" />
          Join Waitlist
        </CardTitle>
        <CardDescription>
          Enter your details to join the restaurant's waitlist
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="size">Party Size</Label>
            <Input
              id="size"
              type="number"
              min="1"
              max="10"
              value={size}
              onChange={(e) => setSize(parseInt(e.target.value) || 1)}
              required
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full">
            Join Waitlist
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}