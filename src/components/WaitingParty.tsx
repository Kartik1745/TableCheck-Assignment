import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";
import { Party } from "@/types";

interface WaitingPartyProps {
  party: Party;
  position: number;
  canCheckIn: boolean;
  onCheckIn: (partyId: string) => void;
}

export function WaitingParty({ party, position, canCheckIn, onCheckIn }: WaitingPartyProps) {
  return (
    <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
      <div className="flex items-center gap-3">
        <span className="text-muted-foreground">#{position}</span>
        <div>
          <p className="font-medium">{party.name}</p>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>{party.size} guests</span>
          </div>
        </div>
      </div>
      {canCheckIn && (
        <Button 
          variant="secondary"
          onClick={() => onCheckIn(party.id)}
        >
          Check In
        </Button>
      )}
    </div>
  );
}