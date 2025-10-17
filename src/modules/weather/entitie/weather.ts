interface Weather {
  ICAOCode: string;
  updatedAt: Date;
  atmosphericPressure: string | null;
  visibility: string | null;
  wind: string | null;
  windDirection: string | null;
  humidity: string | null;
  condition: string | null;
  conditionDescription: string | null;
  temperature: string | null;
}

export { Weather };
