import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { Party } from '@/types';
import * as waitlistService from '@/services/waitlistService';
import * as activeTablesService from '@/services/activeTablesService';

export function useWaitlist(userId: string) {
  const queryClient = useQueryClient();
  const [availableSeats, setAvailableSeats] = useState(0);

  // Fetch waiting parties
  const { data: waitingParties = [] } = useQuery(
    'waitlist',
    waitlistService.fetchWaitingParties,
    { refetchInterval: 5000 }
  );

  // Fetch user waiting parties
  const { data: userWaitingParties = [] } = useQuery(
    ['userWaitlist', userId],
    () => waitlistService.fetchUserWaitingParties({ userId }),
    {
      enabled: !!userId,
      refetchInterval: 5000
    }
  );

  // Fetch active parties
  const { data: activeParties = [] } = useQuery(
    'activeTables',
    activeTablesService.fetchActiveParties,
    { refetchInterval: 5000 }
  );

  // Fetch user active parties
  const { data: userActiveParties = [] } = useQuery(
    ['userActiveTables', userId],
    () => activeTablesService.fetchUserActiveParties({ userId }),
    {
      enabled: !!userId,
      refetchInterval: 5000
    }
  );

  // Fetch available seats
  useQuery(
    'availableSeats',
    activeTablesService.getAvailableSeats,
    {
      refetchInterval: 5000,
      onSuccess: (data) => setAvailableSeats(data)
    }
  );

  // Add party to waitlist
  const addPartyMutation = useMutation(waitlistService.addToWaitlist, {
    onSuccess: () => {
      queryClient.invalidateQueries('waitlist');
      queryClient.invalidateQueries(['userWaitlist', userId]);
    },
  });

  // Check in party
  const checkInPartyMutation = useMutation(
    async (partyId: string) => {
      // First remove from waitlist
      // await waitlistService.removeFromWaitlist(partyId);
      // Then check in the party
      return activeTablesService.checkInParty(partyId);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('waitlist');
        queryClient.invalidateQueries(['userWaitlist', userId]);
        queryClient.invalidateQueries('activeTables');
        queryClient.invalidateQueries(['userActiveTables', userId]);
        queryClient.invalidateQueries('availableSeats');
      },
    }
  );

  // Check for completed parties and remove them
  useEffect(() => {
    const interval = setInterval(async () => {
      const now = Date.now();
      const completedParties = activeParties.filter(
        party => party.serviceEndTime && party.serviceEndTime <= now
      );

      for (const party of completedParties) {
        try {
          await activeTablesService.completeParty(party.id);
          queryClient.invalidateQueries('activeTables');
          queryClient.invalidateQueries(['userActiveTables', userId]);
          queryClient.invalidateQueries('availableSeats');
        } catch (error) {
          console.error('Error completing party:', error);
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [activeParties, queryClient, userId]);

  return {
    waitingParties,
    userWaitingParties,
    activeParties,
    userActiveParties,
    availableSeats,
    addParty: (name: string, size: number, userId: string) => 
      addPartyMutation.mutate({ name, size, userId }),
    checkInParty: (partyId: string) => checkInPartyMutation.mutate(partyId),
  };
}