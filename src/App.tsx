import { useState } from 'react';
import { JoinWaitlist } from '@/components/JoinWaitlist';
import { PartyList } from '@/components/PartyList';
import { useWaitlist } from '@/hooks/useWaitlist';
import { Utensils } from 'lucide-react';
import { getStoredPartyId, savePartyId } from '@/lib/storage';

export default function App() {
  const { state, addParty, checkInParty, getWaitingParties, getActiveParties } = useWaitlist();
  const [currentPartyId, setCurrentPartyId] = useState<string | null>(() => 
    getStoredPartyId()
  );

  const handleJoinWaitlist = (name: string, size: number) => {
    const partyId = addParty(name, size);
    setCurrentPartyId(partyId);
    savePartyId(partyId);
  };

  const handleCheckIn = (partyId: string) => {
    checkInParty(partyId);
  };

  const waitingParties = getWaitingParties();
  const activeParties = getActiveParties();

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold flex items-center justify-center gap-2">
            <Utensils className="h-8 w-8" />
            Restaurant Waitlist
          </h1>
          <p className="text-muted-foreground">
            Available Seats: {state.availableSeats} / {state.totalSeats}
          </p>
        </div>

        <JoinWaitlist onJoin={handleJoinWaitlist} />
        
        <PartyList 
          waiting={waitingParties}
          active={activeParties}
          availableSeats={state.availableSeats}
          onCheckIn={handleCheckIn}
        />
      </div>
    </div>
  );
}