import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Party } from "@/types";
import { Clock, Users } from "lucide-react";
import { WaitingParty } from "./WaitingParty";
import { ActiveParty } from "./ActiveParty";

interface PartyListProps {
  waiting: Party[];
  active: Party[];
  availableSeats: number;
  onCheckIn: (partyId: string) => void;
}

export function PartyList({ waiting, active, availableSeats, onCheckIn }: PartyListProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Waiting List
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {waiting.length === 0 ? (
            <p className="text-muted-foreground text-sm">No parties waiting</p>
          ) : (
            waiting.map((party, index) => (
              <WaitingParty
                key={party.id}
                party={party}
                position={index + 1}
                canCheckIn={party.size <= availableSeats}
                onCheckIn={onCheckIn}
              />
            ))
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Active Tables
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {active.length === 0 ? (
            <p className="text-muted-foreground text-sm">No active tables</p>
          ) : (
            active.map((party) => (
              <ActiveParty key={party.id} party={party} />
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}