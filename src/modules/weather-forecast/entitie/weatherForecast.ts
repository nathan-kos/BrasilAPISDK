import { Uf } from '@src/shared/enums/uf';
import { Forecast } from './forecast';

interface WeatherForecast {
  city: string;
  uf: Uf;
  updatedAt: Date;
  forecast: Forecast[];
}

export { WeatherForecast };
