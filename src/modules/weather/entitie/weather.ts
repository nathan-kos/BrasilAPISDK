interface Weather {
  ICAOCode: string;
  updatedAt: Date;
  atmosphericPressure: string;
  visibility: string;
  wind: string;
  windDirection: string;
  humidity: string;
  condition: string;
  conditionDescription: string;
  temperature: string;
}

export { Weather };
