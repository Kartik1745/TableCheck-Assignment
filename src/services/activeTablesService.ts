import { Party } from '@/types';
import { STORAGE_KEYS } from '@/lib/constants';

interface ActiveTablesState {
  parties: Party[];
  availableSeats: number;
}

export function getActiveTablesState(): ActiveTablesState {
  const stored = localStorage.getItem(STORAGE_KEYS.ACTIVE_TABLES);
  return stored ? JSON.parse(stored) : { parties: [], availableSeats: 10 };
}

export function saveActiveTablesState(state: ActiveTablesState): void {
  localStorage.setItem(STORAGE_KEYS.ACTIVE_TABLES, JSON.stringify(state));
}

export function addToActiveTables(party: Party): void {
  const state = getActiveTablesState();
  state.parties.push(party);
  state.availableSeats -= party.size;
  saveActiveTablesState(state);
}

export function removeFromActiveTables(partyId: string): void {
  const state = getActiveTablesState();
  const party = state.parties.find(p => p.id === partyId);
  if (party) {
    state.parties = state.parties.filter(p => p.id !== partyId);
    state.availableSeats += party.size;
    saveActiveTablesState(state);
  }
}