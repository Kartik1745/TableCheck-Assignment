/*

This module provides utility functions to interact with the API for managing parties, 
including fetching active parties, checking in, completing, and querying available seats.

 */

import { Party } from '@/types';

const API_URL = 'http://localhost:3000/api';

export async function fetchActiveParties(): Promise<Party[]> {
  try {
    const response = await fetch(`${API_URL}/active-tables`);
    if (!response.ok) throw new Error('Failed to fetch active parties');
    return response.json();
  } catch (error) {
    console.error('Error fetching active parties:', error);
    return [];
  }
}

export async function fetchUserActiveParties({ userId }: { userId: string }): Promise<Party[]> {
  try {
    const response = await fetch(`${API_URL}/active-tables?userId=${encodeURIComponent(userId)}`);
    if (!response.ok) throw new Error('Failed to fetch user active parties');
    return response.json();
  } catch (error) {
    console.error('Error fetching user active parties:', error);
    return [];
  }
}

export async function checkInParty(partyId: string): Promise<Party> {
  const response = await fetch(`${API_URL}/active-tables/${partyId}/check-in`, {
    method: 'POST',
  });
  console.log("Inside checkInParty >> ", response);
  if (!response.ok) throw new Error('Failed to check in party');
  return response.json();
}

export async function completeParty(partyId: string): Promise<void> {
  const response = await fetch(`${API_URL}/active-tables/${partyId}/complete`, {
    method: 'POST',
  });
  if (!response.ok) throw new Error('Failed to complete party');
}

export async function getAvailableSeats(): Promise<number> {
  try {
    const response = await fetch(`${API_URL}/active-tables/available-seats`);
    if (!response.ok) throw new Error('Failed to fetch available seats');
    const data = await response.json();
    return data.availableSeats;
  } catch (error) {
    console.error('Error fetching available seats:', error);
    return 0;
  }
}