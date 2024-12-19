import { QueryClient, QueryClientProvider } from 'react-query';
import { JoinWaitlist } from '@/components/JoinWaitlist';
import { PartyList } from '@/components/PartyList';
import { useWaitlist } from '@/hooks/useWaitlist';
import { Utensils } from 'lucide-react';
import { useEffect, useState } from 'react';
import { SignIn, useUser } from '@clerk/clerk-react';

const queryClient = new QueryClient();

function WaitlistApp({ userId }: { userId: string; setUserId: (id: string) => void }) {
  const { waitingParties, activeParties, availableSeats, userWaitingParties, addParty, checkInParty, userActiveParties } = useWaitlist(userId);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <div className="text-center md:text-left space-y-4 mb-8">
                <h1 className="text-4xl font-bold flex items-center md:justify-start justify-center gap-2">
                  <Utensils className="h-8 w-8" />
                  Restaurant Waitlist
                </h1>
                <p className="text-gray-600">
                  Available Seats: {availableSeats} / {10}
                </p>
              </div>
              <JoinWaitlist onJoin={addParty} userId={userId} />
              <div className="mt-8">
                <PartyList 
                  waiting={userWaitingParties}
                  active={userActiveParties}
                  availableSeats={availableSeats}
                  onCheckIn={checkInParty}
                  showOnlyUserParties={true}
                />
              </div>
            </div>

            <div>
              <div className="text-center md:text-left space-y-4 mb-8">
                <h1 className="text-4xl font-bold flex items-center md:justify-start justify-center gap-2">
                  <Utensils className="h-8 w-8" />
                  Restaurant Dashboard View
                </h1>
                <p className="text-gray-600">
                  All Active Parties of restaurant for demonstration purpose
                </p>
              </div>
              <PartyList 
                waiting={waitingParties}
                active={activeParties}
                availableSeats={availableSeats}
                onCheckIn={checkInParty}
              />
            </div>
          </div>
        </div>
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="w-full max-w-md px-8 py-12 mx-4">
          <div className="flex flex-col items-center space-y-6 mb-8">
            <div className="p-3 rounded-full bg-primary/10">
              <Utensils className="w-8 h-8 text-primary" />
            </div>
            <div className="text-center space-y-2">
              <h1 className="text-2xl font-semibold tracking-tight">Welcome to Restaurant Waitlist</h1>
            </div>
          </div>
            <SignIn />
        </div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <WaitlistApp userId={userId} setUserId={setUserId} />
    </QueryClientProvider>
  );
}