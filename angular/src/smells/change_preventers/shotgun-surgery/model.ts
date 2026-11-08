export interface FlightBooking {
  route: string;
  netCents: number;
}

export interface HotelBooking {
  hotel: string;
  nights: number;
  nightlyNetCents: number;
}

export interface CarRental {
  model: string;
  days: number;
  dailyNetCents: number;
}
