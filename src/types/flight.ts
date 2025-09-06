export interface Flight {
  date: string; // e.g. "2021-06-10"
  page: number;

  // Flight times
  asel?: number;
  sim?: number;
  landingDay?: number;
  landingNight?: number;
  hood?: number;
  imc?: number;
  xc?: number;
  dual?: number;
  night?: number;
  pic?: number;
  picXc?: number;

  // Aircraft-specific
  ownedTach?: number;
  ownedHobb?: number;

  // Fuel + costs
  month: string; // e.g. "2021/06"
  fuelGal?: number;
  fuelDollars?: number;

  tachStart?: number;
  tachStop?: number;
  hobbStart?: number;
  hobbStop?: number;

  fuelUsd?: number;

  notes?: string;
}