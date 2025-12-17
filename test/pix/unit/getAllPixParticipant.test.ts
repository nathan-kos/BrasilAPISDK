/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
    getAllPixParticipant,
    ParticipationModality,
    ParticipationType,
    PixParticipant,
} from '@src/index';
import { TimeoutError } from '@src/shared/exceptions/TimeoutError';
import { describe, expect, it, vi } from 'vitest';

describe('get all pix participant - unit', () => {
  it('should return mocked data for pix participants', async () => {
    const mockedParticipants: {
      ispb: string;
      nome: string;
      nome_reduzido: string;
      modalidade_participacao: string;
      tipo_participacao: string;
      inicio_operacao: string;
    }[] = [
      {
        ispb: '12345678',
        nome: 'Banco Exemplo S.A.',
        nome_reduzido: 'Banco Exemplo',
        modalidade_participacao: 'PDCT',
        tipo_participacao: 'IDRT',
        inicio_operacao: '2020-01-01T00:00:00Z',
      },
      {
        ispb: '87654321',
        nome: 'Instituição Exemplo S.A.',
        nome_reduzido: 'Instituição Exemplo',
        modalidade_participacao: 'LESP',
        tipo_participacao: 'DRCT',
        inicio_operacao: '2021-06-15T00:00:00Z',
      },
    ];

    const participantsResponse: PixParticipant[] = [
      {
        ispb: '12345678',
        name: 'Banco Exemplo S.A.',
        reducedName: 'Banco Exemplo',
        participationModality: ParticipationModality.PDCT,
        participationType: ParticipationType.IDRT,
        operationStartDate: new Date('2020-01-01T00:00:00Z'),
      },
      {
        ispb: '87654321',
        name: 'Instituição Exemplo S.A.',
        reducedName: 'Instituição Exemplo',
        participationModality: ParticipationModality.LESP,
        participationType: ParticipationType.DRCT,
        operationStartDate: new Date('2021-06-15T00:00:00Z'),
      },
    ];

    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockedParticipants),
    });

    global.fetch = mockFetch;

    const participants = await getAllPixParticipant();

    expect(participants).toEqual(participantsResponse);
    expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining('/pix/v1/participants'), {
      signal: expect.any(AbortSignal),
    });
  });

  it('should throw TimeoutError if fetch is aborted', async () => {
    const abortError = new Error('AbortError');
    abortError.name = 'AbortError';

    const mockFetch = vi.fn().mockRejectedValue(abortError);

    global.fetch = mockFetch;

    await expect(getAllPixParticipant()).rejects.toBeInstanceOf(TimeoutError);
  });
});
