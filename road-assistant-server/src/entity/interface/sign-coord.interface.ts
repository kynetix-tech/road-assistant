export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface SignItem {
  coordinates: Coordinates;
  signClass: string;
}
