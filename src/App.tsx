import { QueryClient, QueryClientProvider } from 'react-query';
import { JoinWaitlist } from '@/components/JoinWaitlist';
import { PartyList } from '@/components/PartyList';
import { useWaitlist } from '@/hooks/useWaitlist';
import { Utensils } from 'lucide-react';
import { useEffect, useState } from 'react';
import { SignIn, useUser } from '@clerk/clerk-react';

const queryClient = new QueryClient();

function WaitlistApp({ userId }: { userId: string; setUserId: (id: string) => void }) {
  const { waitingParties, activeParties, availableSeats, userWaitingParties, addParty, checkInParty, userActiveParties  } = useWaitlist(userId);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold flex items-center justify-center gap-2">
            <Utensils className="h-8 w-8" />
            Restaurant Waitlist
          </h1>
          <p className="text-muted-foreground">
            Available Seats: {availableSeats} / {10}
          </p>
        </div>

        <JoinWaitlist onJoin={addParty} userId={userId} />

        <PartyList 
          waiting={userWaitingParties}
          active={userActiveParties}
          availableSeats={availableSeats}
          onCheckIn={checkInParty}
          showOnlyUserParties={true}
        />
        
        <PartyList 
          waiting={waitingParties}
          active={activeParties}
          availableSeats={availableSeats}
          onCheckIn={checkInParty}
        />
      </div>
    </div>
  );
}

export default function App() {
  const user = useUser();
  const [userId, setUserId] = useState('');

  useEffect(() => {
    if (user.user) {
      setUserId(user.user.id);
    }
  }, [user.user]);

  if (!user.user) {
    return (
      <>
        <SignIn />
      </>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <WaitlistApp userId={userId} setUserId={setUserId} />
    </QueryClientProvider>
  );
}
