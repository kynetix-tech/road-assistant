export interface Coordinates {
  latitude: number;
  longtitude: number;
}

export interface SignItem {
  coordinates: Coordinates;
  signClass: string;
}
