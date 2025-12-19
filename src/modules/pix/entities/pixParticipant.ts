import { ParticipationModality } from './participationModality';
import { ParticipationType } from './participationType';

interface PixParticipant {
  ispb: string;
  name: string;
  reducedName: string;
  participationModality: ParticipationModality;
  participationType: ParticipationType;
  operationStartDate: Date;
}

export { PixParticipant };
