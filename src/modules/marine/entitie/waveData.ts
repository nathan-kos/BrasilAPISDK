import { Direction } from './directions';

interface WaveData {
  wind: string;
  windDirection: Direction;
  windDirectionDesc: string;
  waveHeight: string;
  waveDirection: Direction;
  waveDirectionDesc: string;
  agitation: string;
  time: string;
}

export { WaveData };
