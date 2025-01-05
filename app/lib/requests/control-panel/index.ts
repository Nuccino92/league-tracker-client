import { z } from 'zod';

import ROUTES from '@/app/lib/globals/routes';
import {
  ControlPanelArchivedSeasonsList,
  ControlPanelDetailedSeasonsListItem,
  controlPanelDetailedSeasonsListItemSchema,
  ControlPanelDetailedSeasonTeams,
  controlPanelDetailedSeasonTeamsSchema,
  ControlPanelInformation,
  ControlPanelSportSettingsSchema,
  controlPanelSportSettingsSchema,
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

export async function fetchDetailedSeasonTeams({
  token,
  slug,
}: {
  token: string;
  slug: string;
}) {
  return new Promise<ControlPanelDetailedSeasonTeams[]>((resolve) => {
    setTimeout(() => {
      const result = z
        .array(controlPanelDetailedSeasonTeamsSchema)
        .parse(mockDetailedTeams);
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

  //return z.array(controlPanelDetailedSeasonTeamsSchema).parse(data.data)
}

const mockDetailedTeams = [
  {
    id: 1,
    name: 'Thunder Dragons',
    logo: 'https://images.firstwefeast.com/complex/image/upload/c_limit,fl_progressive,q_80,w_1030/omox9xypgbi5mzqgo8rf.png',
    players: 12,
    created_at: '2024-03-09 04:15:13',
  },
  {
    id: 2,
    name: 'Phoenix Flyers',
    logo: null,
    players: 8,
    created_at: '2024-03-10 15:30:22',
  },
  {
    id: 3,
    name: 'Lightning Lions',
    logo: null,
    players: 15,
    created_at: '2024-03-11 09:45:17',
  },
  {
    id: 4,
    name: 'Crimson Crushers',
    logo: null,
    players: 10,
    created_at: '2024-03-12 14:20:45',
  },
  {
    id: 5,
    name: 'Shadow Strikers',
    logo: 'https://images.firstwefeast.com/complex/image/upload/c_limit,fl_progressive,q_80,w_1030/omox9xypgbi5mzqgo8rf.png',
    players: 13,
    created_at: '2024-03-13 11:05:30',
  },
] as ControlPanelDetailedSeasonTeams[];

export async function getSportSettingsRequest({
  slug,
  token,
}: {
  slug: string;
  token: string;
}) {
  return new Promise<ControlPanelSportSettingsSchema>((resolve) => {
    setTimeout(() => {
      const result = controlPanelSportSettingsSchema.parse(
        mockSportSettingsData
      );
      resolve(result);
    }, 630);
  });
}

const mockSportSettingsData: ControlPanelSportSettingsSchema = {
  info: {
    name: 'Hockey',
    value: 'hockey',
  },
  selected_stat_ids: [39, 36, 35, 41],
  stat_categories: ['skater', 'goalie'],
  stat_options: [
    // Skater Stats
    {
      id: 32,
      name: 'Goals',
      code: 'G',
      sport_type: 'hockey',
      is_locked: true,
      description: 'Goals scored',
      category: 'skater',
    },
    {
      id: 33,
      name: 'Assists',
      code: 'A',
      sport_type: 'hockey',
      is_locked: true,
      description: 'Assists',
      category: 'skater',
    },
    {
      id: 34,
      name: 'Plus/Minus',
      code: '+/-',
      sport_type: 'hockey',
      is_locked: false,
      description: 'Plus/minus rating',
      category: 'skater',
    },
    {
      id: 35,
      name: 'Penalty Minutes',
      code: 'PIM',
      sport_type: 'hockey',
      is_locked: false,
      description: 'Penalty minutes',
      category: 'skater',
    },
    {
      id: 36,
      name: 'Shots on Goal',
      code: 'SOG',
      sport_type: 'hockey',
      is_locked: false,
      description: 'Shots on goal',
      category: 'skater',
    },
    {
      id: 37,
      name: 'Hits',
      code: 'HIT',
      sport_type: 'hockey',
      is_locked: false,
      description: 'Number of hits',
      category: 'skater',
    },
    {
      id: 38,
      name: 'Blocks',
      code: 'BLK',
      sport_type: 'hockey',
      is_locked: false,
      description: 'Shots blocked',
      category: 'skater',
    },
    // Goalie Stats
    {
      id: 39,
      name: 'Saves',
      code: 'SV',
      sport_type: 'hockey',
      is_locked: true,
      description: 'Number of saves',
      category: 'goalie',
    },
    {
      id: 40,
      name: 'Goals Against',
      code: 'GA',
      sport_type: 'hockey',
      is_locked: true,
      description: 'Goals allowed',
      category: 'goalie',
    },
    {
      id: 41,
      name: 'Shots Against',
      code: 'SA',
      sport_type: 'hockey',
      is_locked: false,
      description: 'Shots faced',
      category: 'goalie',
    },
    {
      id: 42,
      name: 'Minutes Played',
      code: 'MIN',
      sport_type: 'hockey',
      is_locked: false,
      description: 'Minutes played',
    },
  ],
};

export async function updateLeagueSportSettings({
  slug,
  token,
  selected_stat_ids,
}: {
  slug: string;
  token: string;
  selected_stat_ids: number[];
}) {
  return new Promise<boolean>((resolve) => {
    setTimeout(() => {
      console.log('Updating stats');
      resolve(true);
    }, 630);
  });
}
