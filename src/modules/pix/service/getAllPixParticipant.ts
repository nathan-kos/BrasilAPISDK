import { getBaseUrl, getTimeout } from '@src/shared/config/ApiConfig';
import { AppError } from '@src/shared/exceptions/AppError';
import { handleResponseError } from '@src/shared/exceptions/HandlerResponseError';
import { ServerError } from '@src/shared/exceptions/ServerError';
import { TimeoutError } from '@src/shared/exceptions/TimeoutError';
import { ParticipationModality } from '../entities/participationModality';
import { ParticipationType } from '../entities/participationType';
import { PixParticipant } from '../entities/pixParticipant';

async function getAllPixParticipant(): Promise<PixParticipant[]> {
  const url = `${getBaseUrl()}/pix/v1/participants`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), getTimeout());

    const response = await fetch(url, {
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      await handleResponseError(response);
    }

    const participantData = (await response.json()) as rawPixParticipant[];

    const participants: PixParticipant[] = participantData.map((item) => ({
      ispb: item.ispb,
      name: item.nome,
      reducedName: item.nome_reduzido,
      participationModality: item.modalidade_participacao as ParticipationModality,
      participationType: item.tipo_participacao as ParticipationType,
      operationStartDate: new Date(item.inicio_operacao),
    }));

    return participants;
  } catch (error) {
    if ((error as Error).name === 'AbortError') {
      throw new TimeoutError('timeout fetching Pix Participant data');
    }
    if (error instanceof AppError) {
      throw error;
    } else {
      throw new ServerError('Error fetching Pix Participant data');
    }
  }
}

export { getAllPixParticipant };

type rawPixParticipant = {
  ispb: string;
  nome: string;
  nome_reduzido: string;
  modalidade_participacao: string;
  tipo_participacao: string;
  inicio_operacao: string;
};
