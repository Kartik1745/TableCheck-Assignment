import { Party } from '@/types';

const API_URL = 'http://localhost:3000/api';

export async function fetchWaitingParties(): Promise<Party[]> {
  try {
    const response = await fetch(`${API_URL}/waitlist`);
    if (!response.ok) throw new Error('Failed to fetch waiting parties');
    return response.json();
  } catch (error) {
    console.error('Error fetching waiting parties:', error);
    return [];
  }
}

export async function addToWaitlist(party: Omit<Party, 'id' | 'status' | 'timestamp'>): Promise<Party> {
  const response = await fetch(`${API_URL}/waitlist`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(party),
  });
  if (!response.ok) throw new Error('Failed to add party to waitlist');
  return response.json();
}

export async function removeFromWaitlist(partyId: string): Promise<void> {
  const response = await fetch(`${API_URL}/waitlist/${partyId}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Failed to remove party from waitlist');
}