import { Party } from '@/types';

export function getPartyPosition(parties: Party[], currentParty: Party): number {
  return parties.filter(p => 
    p.status === 'waiting' && 
    p.timestamp < currentParty.timestamp
  ).length + 1;
}

export function calculateServiceEndTime(partySize: number, timePerPerson: number): number {
  return Date.now() + (partySize * timePerPerson);
}

export function isPartyEligibleForCheckIn(
  party: Party,
  parties: Party[],
  availableSeats: number
): boolean {
  if (party.status !== 'waiting' || party.size > availableSeats) return false;

  const partiesAhead = parties.filter(p => 
    p.status === 'waiting' && 
    p.timestamp < party.timestamp &&
    p.size <= availableSeats
  );

  return partiesAhead.length === 0;
}

export function getCompletedParties(parties: Party[]): Party[] {
  const now = Date.now();
  return parties.filter(party => 
    party.status === 'checked-in' && 
    party.serviceEndTime && 
    now >= party.serviceEndTime
  );
}

export function getNextEligibleParty(parties: Party[], availableSeats: number): Party | null {
  return parties.find(party => 
    party.status === 'waiting' && 
    party.size <= availableSeats &&
    isPartyEligibleForCheckIn(party, parties, availableSeats)
  ) || null;
}