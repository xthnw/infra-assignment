export interface Booking {
  id: number;
  name: string;
  email: string;
  createdAt: string;
}

export interface APIResponse {
  bookings: Booking[];
  count: number;
  availableSeats: number;
  status: 'available' | 'full';
}