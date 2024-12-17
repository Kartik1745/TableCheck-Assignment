import { useState, useEffect } from 'react';
import { Party, WaitlistState } from '@/types';
import { TOTAL_SEATS, SERVICE_TIME_PER_PERSON } from '@/lib/constants';
import { getStoredWaitlistState, saveWaitlistState } from '@/lib/storage';
import { calculateServiceEndTime, getCompletedParties } from '@/lib/waitlist';

const initialState: WaitlistState = {
  parties: [],
  availableSeats: TOTAL_SEATS,
  totalSeats: TOTAL_SEATS,
  serviceTimePerPerson: SERVICE_TIME_PER_PERSON,
};

export function useWaitlist() {
  const [state, setState] = useState<WaitlistState>(() => 
    getStoredWaitlistState() || initialState
  );

  useEffect(() => {
    saveWaitlistState(state);
  }, [state]);

  // Handle completed parties
  useEffect(() => {
    const interval = setInterval(() => {
      setState(current => {
        const completedParties = getCompletedParties(current.parties);
        if (completedParties.length === 0) return current;

        const freedSeats = completedParties.reduce((acc, p) => acc + p.size, 0);
        const updatedParties = current.parties.filter(p => !completedParties.includes(p));
        
        return {
          ...current,
          parties: updatedParties,
          availableSeats: current.availableSeats + freedSeats,
        };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const addParty = (name: string, size: number) => {
    const party: Party = {
      id: Date.now().toString(),
      name,
      size,
      status: 'waiting',
      timestamp: Date.now(),
    };

    setState(current => ({
      ...current,
      parties: [...current.parties, party],
    }));

    return party.id;
  };

  const checkInParty = (partyId: string) => {
    setState(current => {
      const party = current.parties.find(p => p.id === partyId);
      if (!party || party.size > current.availableSeats) return current;

      const serviceEndTime = calculateServiceEndTime(party.size, current.serviceTimePerPerson);
      
      return {
        ...current,
        parties: current.parties.map(p => 
          p.id === partyId
            ? { ...p, status: 'checked-in', serviceEndTime }
            : p
        ),
        availableSeats: current.availableSeats - party.size,
      };
    });
  };

  const getWaitingParties = () => {
    return state.parties.filter(p => p.status === 'waiting')
      .sort((a, b) => a.timestamp - b.timestamp);
  };

  const getActiveParties = () => {
    return state.parties.filter(p => p.status === 'checked-in')
      .sort((a, b) => (a.serviceEndTime || 0) - (b.serviceEndTime || 0));
  };

  return {
    state,
    addParty,
    checkInParty,
    getWaitingParties,
    getActiveParties,
  };
}