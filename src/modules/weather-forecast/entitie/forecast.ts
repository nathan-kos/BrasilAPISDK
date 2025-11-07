interface Forecast {
  date: Date;
  condition: string;
  minTemperature: number;
  maxTemperature: number;
  UVIndex: number;
  conditionDescription: string;
}

export { Forecast };
