import { Users, Clock } from "lucide-react";
import { Party } from "@/types";
import { useEffect, useState } from "react";

interface ActivePartyProps {
  party: Party;
}

export function ActiveParty({ party }: ActivePartyProps) {
  const [timeLeft, setTimeLeft] = useState<string>("");

  useEffect(() => {
    const interval = setInterval(() => {
      if (party.serviceEndTime) {
        const remaining = Math.max(0, party.serviceEndTime - Date.now());
        const minutes = Math.floor(remaining / 60000);
        const seconds = Math.floor((remaining % 60000) / 1000);
        setTimeLeft(`${minutes}:${seconds.toString().padStart(2, '0')}`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [party.serviceEndTime]);

  return (
    <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
      <div>
        <p className="font-medium">{party.name}</p>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Users className="h-4 w-4" />
          <span>{party.size} guests</span>
        </div>
      </div>
      <div className="flex items-center gap-2 text-muted-foreground">
        <Clock className="h-4 w-4" />
        <span>{timeLeft}</span>
      </div>
    </div>
  );
}