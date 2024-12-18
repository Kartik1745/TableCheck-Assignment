export interface Party {
  userId: string;
  id: string;
  name: string;
  size: number;
  status: 'waiting' | 'checked-in' | 'completed';
  timestamp: number;
  serviceEndTime?: number;
}

export interface WaitlistState {
  parties: Party[];
  availableSeats: number;
  totalSeats: number;
  serviceTimePerPerson: number;
}