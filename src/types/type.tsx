export interface Office {
  id: number;
  price: number;
  duration: number;
  name: string;
  slug: string;
  address: string;
  city: City;
  thumbnail: string;
  photos: Photo[];
  benefits: Benefit[];
  features: Feature[];
  sales: Sales[];
  about: string;
  ratings_count : number;
  ratings_avg : number;
}

interface Photo {
  id: number;
  photo: string;
}

interface Benefit {
  id: number;
  name: string;
}
interface Feature {
  id: number;
  name: string;
  icon: string;
  description: string;
}
interface Sales {
  id: number;
  name: string;
  position: string;
  phonenumber: string;
  image: string;
}

export interface City {
  id: number;
  name: string;
  slug: string;
  photo: string;
  officeSpaces_count: number;
  officeSpaces: Office[];
}

export interface BookingDetails {
  id: number;
  name: string;
  phone_number: string;
  booking_trx_id: string;
  is_paid: boolean;
  duration: number;
  total_amount: number;
  started_at: string;
  ended_at: string;
  office: Office;
}
