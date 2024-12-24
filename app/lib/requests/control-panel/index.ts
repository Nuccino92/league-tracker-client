import { z } from 'zod';

import ROUTES from '@/app/lib/globals/routes';
import {
  ControlPanelArchivedSeasonsList,
  ControlPanelDetailedSeasonsListItem,
  controlPanelDetailedSeasonsListItemSchema,
  ControlPanelInformation,
  ErrorType,
  SeasonSettings,
  seasonSettingsSchema,
} from '@/app/lib/types/Responses/control-panel.types';
import { seasonSchema } from '@/app/lib/types/Models/Season';

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
    id: 110,
    name: '2014 First season',

    created_at: '2024-03-09 04:15:13',
  },
  {
    id: 1,
    name: '2016-2017 Basketball season',

    created_at: '2024-03-09 04:15:13',
  },
  {
    id: 2,
    name: '2017-2018 Basketball season',
    created_at: '2024-03-09 04:15:13',
  },
  {
    id: 3,
    name: '2018-2019 Basketball season',
    created_at: '2024-03-09 04:15:13',
  },
  {
    id: 4,
    name: '2016-2017 Basketball season',
    created_at: '2024-03-09 04:15:13',
  },
  {
    id: 5,
    name: '2017-2018 Basketball season',
    created_at: '2024-03-09 04:15:13',
  },
  {
    id: 6,
    name: '2018-2019 Basketball season',
    created_at: '2024-03-09 04:15:13',
  },
];

export async function fetchDetailsSeasons({
  token,
  slug,
}: {
  token: string;
  slug: string;
}) {
  return new Promise<ControlPanelDetailedSeasonsListItem[]>((resolve) => {
    setTimeout(() => {
      const result = z
        .array(controlPanelDetailedSeasonsListItemSchema)
        .parse(mockDetailedSeasons);
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

const mockDetailedSeasons = [
  {
    id: 110,
    name: '2014 First season',
    registrants: 53,
    teams: 21,
    players: 54,
    created_at: '2024-03-09 04:15:13',
  },
  {
    id: 1,
    name: '2016-2017 Basketball season',
    registrants: 53,
    teams: 21,
    players: 54,
    created_at: '2024-03-09 04:15:13',
  },
  {
    id: 2,
    name: '2017-2018 Basketball season',
    registrants: 53,
    teams: 21,
    players: 54,
    created_at: '2024-03-09 04:15:13',
  },
  {
    id: 3,
    name: '2018-2019 Basketball season',
    registrants: 53,
    teams: 21,
    players: 54,
    created_at: '2024-03-09 04:15:13',
  },
  {
    id: 4,
    name: '2016-2017 Basketball season',
    registrants: 53,
    teams: 21,
    players: 54,
    created_at: '2024-03-09 04:15:13',
  },
  {
    id: 5,
    name: '2017-2018 Basketball season',
    registrants: 53,
    teams: 21,
    players: 54,
    created_at: '2024-03-09 04:15:13',
  },
  {
    id: 6,
    name: '2018-2019 Basketball season',
    registrants: 53,
    teams: 21,
    players: 54,
    created_at: '2024-03-09 04:15:13',
  },
] as ControlPanelDetailedSeasonsListItem[];

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

export async function getSeasonSettings({
  token,
  slug,
  seasonId,
}: {
  token: string;
  slug: string;
  seasonId: number;
}) {
  return new Promise<SeasonSettings>((resolve) => {
    setTimeout(() => {
      const result = seasonSettingsSchema.parse(mockSeasonSettings);
      resolve(result);
    }, 630);
  });

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

const mockSeasonSettings = {
  registration_enabled: true,
  registration_capacity: 100,
  max_players_per_team: 15,
  max_total_teams: 25,
  season: {
    id: 1,
    name: 'Summer 2024',
    created_at: '2024-03-09 04:15:13',
  },
  created_at: '2024-03-09 04:15:13',
} as SeasonSettings;

export async function updateSeasonSettingsRequest({
  token,
  slug,
  seasonId,
}: {
  token: string;
  slug: string;
  seasonId: number;
  formValues: SeasonSettings;
}) {
  return true;

  // seasonSettingsSchema.parse()

  //TODO: pass in team slugs
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_KEEPR_API_URL}/events/league/${slug}/${seasonId}`,
    {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  );

  const data = await response.json();

  if (!response.ok)
    throw {
      message: data.error as ErrorType,
      statusCode: response.status,
    } as NotOk & { owner_id: string | undefined };

  return data;
}
