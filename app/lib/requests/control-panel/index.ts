import { z } from 'zod';

import ROUTES from '@/app/lib/globals/routes';
import {
  ControlPanelArchivedSeasonsList,
  ControlPanelInformation,
  ErrorType,
} from '@/app/lib/types/Responses/control-panel.types';
import { seasonSchema } from '../../types/Models/Season';

export async function leagueControlPanelInformationRequest({
  token,
  slug,
}: {
  token: string;
  slug: string;
}) {
  // TOOD: possibly return the archived season in the all_seasons array w/ flag
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_KEEPR_API_URL}${ROUTES.CONTROL_PANEL}${ROUTES.LEAGUE}/${slug}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok)
    throw {
      message: data.error as ErrorType,
      statusCode: response.status,
      owner_id: data.owner_id,
    } as NotOk & { owner_id: string | undefined };

  return data.data as ControlPanelInformation;
}

export async function fetchControlPanelArchivedSeasons({
  token,
  slug,
}: {
  token: string;
  slug: string;
}) {
  return new Promise<ControlPanelArchivedSeasonsList[]>((resolve) => {
    setTimeout(() => {
      const result = z.array(seasonSchema).parse(mockRestoreSeasonsData);
      resolve(result);
    }, 630);
  });

  // TOOD: possibly return the archived season in the all_seasons array w/ flag
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_KEEPR_API_URL}${ROUTES.CONTROL_PANEL}${ROUTES.LEAGUE}/${slug}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  //TODO: parse the data

  if (!response.ok)
    throw {
      message: data.error as ErrorType,
      statusCode: response.status,
      owner_id: data.owner_id,
    } as NotOk & { owner_id: string | undefined };

  //return z.array(controlPanelArchivedTeamSchema).parse(data.data)
}

const mockRestoreSeasonsData = [
  {
    id: 0,
    name: '2014 First season',
  },
  {
    id: 1,
    name: '2016-2017 Basketball season',
  },
  {
    id: 2,
    name: '2017-2018 Basketball season',
  },
  {
    id: 3,
    name: '2018-2019 Basketball season',
  },
  {
    id: 4,
    name: '2016-2017 Basketball season',
  },
  {
    id: 5,
    name: '2017-2018 Basketball season',
  },
  {
    id: 6,
    name: '2018-2019 Basketball season',
  },
];

export async function generateGameSchedule({
  token,
  slug,
}: {
  token: string;
  slug: string;
}) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_KEEPR_API_URL}/control-panel/league/${slug}/generate-game-schedule`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) throw Error('Failed to retrieve league');
}
