import { z } from 'zod';
import { DefaultColors } from '@/app/lib/enums/index';
import ROUTES from '@/app/lib/globals/routes';

import {
  ControlPanelArchivedTeam,
  ControlPanelListTeam,
  ControlPanelListTeamForDropdown,
  ControlPanelManageTeam,
  ErrorType,
  controlPanelArchivedTeamSchema,
  controlPanelListTeamSchema,
  controlPaneListTeamForDropdownSchema,
  controlPanelManageTeamSchema,
  controlPanelCheckIfTeamIsInSeasonSchema,
  ControlPanelCheckIfTeamIsInSeason,
} from '@/app/lib/types/Responses/control-panel.types';
import { Team, teamSchema } from '@/app/lib/types/Models/Team';
import { PaginationMetaSchema } from '../../types/pagination.types';

export async function controlPanelTeamsRequest({
  token,
  slug,
  params,
  paginate = true,
}: {
  token: string;
  slug: string;
  params: string;
  paginate: boolean;
}) {
  // TODO: possibly add can_remove property

  //TODO: on backend, if there is no season and paginate is false, reject the request... possibly

  const teamsListResponseSchema = z.object({
    data: z.array(controlPanelListTeamSchema),
    meta: PaginationMetaSchema.nullable(),
  });

  type TeamListRepsonse = z.infer<typeof teamsListResponseSchema>;

  return new Promise<TeamListRepsonse>((resolve) => {
    setTimeout(() => {
      const result = teamsListResponseSchema.parse(mockTeamList);
      resolve(result);
    }, 400);
  });
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_KEEPR_API_URL}${ROUTES.CONTROL_PANEL}${ROUTES.LEAGUE}/${slug}?${params}&paginate=${paginate}`,
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

  // return z.array(controlPanelListTeamSchema).parse(data);
}

export async function controlPanelTeamRequest({
  token,
  slug,
  teamId,
}: {
  token: string;
  slug: string;
  teamId: number;
}) {
  return new Promise<Team>((resolve) => {
    setTimeout(() => {
      const result = teamSchema.parse(mockTeam);
      resolve(result);
    }, 630);
  });
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_KEEPR_API_URL}${ROUTES.CONTROL_PANEL}${ROUTES.LEAGUE}/${slug}/teams/${teamId}`,
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

  // return teamSchema.parse(data.data)
}

export async function controlPanelTeamsForManagementRequest({
  token,
  slug,
  params,
}: {
  token: string;
  slug: string;
  params: string;
}) {
  return new Promise<ControlPanelManageTeam[]>((resolve) => {
    setTimeout(() => {
      const result = z
        .array(controlPanelManageTeamSchema)
        .parse(mockTeamForManagementList);
      resolve(result);
    }, 630);
  });
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_KEEPR_API_URL}${ROUTES.CONTROL_PANEL}${ROUTES.LEAGUE}/${slug}${params}`,
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

  // return z
  // .array(controlPanelManageTeamSchema)
  // .parse(data.data);
}

export async function controlPanelArchivedTeamsRequest({
  token,
  slug,
  params,
}: {
  token: string;
  slug: string;
  params: string;
}) {
  const achivedTeamsResponseSchema = z.object({
    data: z.array(controlPanelArchivedTeamSchema),
    meta: PaginationMetaSchema.nullable(),
  });

  type AchivedTeamsResponse = z.infer<typeof achivedTeamsResponseSchema>;

  return new Promise<AchivedTeamsResponse>((resolve) => {
    setTimeout(() => {
      const result = achivedTeamsResponseSchema.parse(mockTeamList);
      resolve(result);
    }, 630);
  });
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_KEEPR_API_URL}${ROUTES.CONTROL_PANEL}${ROUTES.LEAGUE}/${slug}${params}`,
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

  //return z.array(controlPanelArchivedTeamSchema).parse(data.data)
}

export async function controlPanelTeamsForDropdownRequest({
  token,
  slug,
}: {
  token: string;
  slug: string;
}) {
  // TODO: possibly add can_remove property

  return new Promise<ControlPanelListTeamForDropdown[]>((resolve) => {
    setTimeout(() => {
      const result = z
        .array(controlPaneListTeamForDropdownSchema)
        .parse(mockTeamsForDropdown);
      resolve(result);
    }, 400);
  });
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

  // return z.array(controlPanelListTeamSchema).parse(data);
}

export async function checkIfTeamIsInSeasonRequest({
  token,
  teamID,
  seasonID,
  slug,
}: {
  token: string;
  teamID: string;
  seasonID: string;
  slug: string;
}) {
  // TODO: possibly add can_remove property

  //TODO: on backend, if there is no season and paginate is false, reject the request... possibly

  return new Promise<{ is_team_involved_in_season: boolean }>((resolve) => {
    setTimeout(() => {
      resolve({
        is_team_involved_in_season: seasonID !== '1' ? true : false,
      });
    }, 400);
  });

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_KEEPR_API_URL}${ROUTES.CONTROL_PANEL}${ROUTES.LEAGUE}/${slug}/teams/${teamID}/${seasonID}`,
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

  return controlPanelCheckIfTeamIsInSeasonSchema.parse(data);
}

const mockTeamList = {
  meta: null,
  data: [
    {
      id: 1,
      name: 'Toronto Raptors',
      logo: null,
      league_id: 20,
    },
    {
      id: 2,
      name: 'Rip City',
      logo: 'https://images.firstwefeast.com/complex/image/upload/c_limit,fl_progressive,q_80,w_1030/omox9xypgbi5mzqgo8rf.png',
      league_id: 20,
    },
    {
      id: 3,
      name: 'Los Angeles Lakers',
      logo: null,
      league_id: 20,
    },
    {
      id: 4,
      name: 'Chicago Bulls Baybee',
      logo: 'https://images.firstwefeast.com/complex/image/upload/c_limit,fl_progressive,q_80,w_1030/omox9xypgbi5mzqgo8rf.png',
      league_id: 20,
    },
    {
      id: 5,
      name: 'Milwaukee Bucks',
      logo: null,
      league_id: 20,
    },
    {
      id: 6,
      name: 'Long Dong Tigers',
      logo: null,
      league_id: 20,
    },
    {
      id: 7,
      name: 'Miami Heat',
      logo: 'https://images.firstwefeast.com/complex/image/upload/c_limit,fl_progressive,q_80,w_1030/omox9xypgbi5mzqgo8rf.png',
      league_id: 20,
    },
    {
      id: 8,
      name: 'Houston Rockets',
      logo: null,
      league_id: 20,
    },
  ],
};

const mockTeamForManagementList = [
  {
    id: 1,
    name: 'Toronto Raptors',
    logo: null,
    is_in_active_season: true,
    can_remove: false,
  },
  {
    id: 2,
    name: 'Charleotte Hornets',
    logo: 'https://images.firstwefeast.com/complex/image/upload/c_limit,fl_progressive,q_80,w_1030/omox9xypgbi5mzqgo8rf.png',
    is_in_active_season: true,
    can_remove: true,
  },
  {
    id: 3,
    name: 'Denver Nuggies',
    logo: null,
    is_in_active_season: false,
    can_remove: true,
  },
  {
    id: 4,
    name: 'Miami Heat',
    logo: 'https://images.firstwefeast.com/complex/image/upload/c_limit,fl_progressive,q_80,w_1030/omox9xypgbi5mzqgo8rf.png',
    is_in_active_season: true,
    can_remove: true,
  },
  {
    id: 5,
    name: 'Los Angeles Lakers',
    logo: null,
    is_in_active_season: false,
    can_remove: true,
  },
  {
    id: 6,
    name: 'Toronto Raptors',
    logo: null,
    is_in_active_season: true,
    can_remove: true,
  },
  {
    id: 7,
    name: 'Charleotte Hornets',
    logo: 'https://images.firstwefeast.com/complex/image/upload/c_limit,fl_progressive,q_80,w_1030/omox9xypgbi5mzqgo8rf.png',
    is_in_active_season: true,
    can_remove: true,
  },
  {
    id: 8,
    name: 'Denver Nuggies',
    logo: null,
    is_in_active_season: false,
    can_remove: true,
  },
  {
    id: 9,
    name: 'Miami Heat',
    logo: 'https://images.firstwefeast.com/complex/image/upload/c_limit,fl_progressive,q_80,w_1030/omox9xypgbi5mzqgo8rf.png',
    is_in_active_season: true,
    can_remove: false,
  },
  {
    id: 10,
    name: 'Los Angeles Lakers',
    logo: null,
    is_in_active_season: false,
    can_remove: true,
  },
  {
    id: 11,
    name: 'Toronto Raptors',
    logo: null,
    is_in_active_season: true,
    can_remove: false,
  },
  {
    id: 12,
    name: 'Charleotte Hornets',
    logo: 'https://images.firstwefeast.com/complex/image/upload/c_limit,fl_progressive,q_80,w_1030/omox9xypgbi5mzqgo8rf.png',
    is_in_active_season: true,
    can_remove: false,
  },
  {
    id: 13,
    name: 'Denver Nuggies',
    logo: null,
    is_in_active_season: false,
    can_remove: true,
  },
  {
    id: 14,
    name: 'Miami Heat',
    logo: 'https://images.firstwefeast.com/complex/image/upload/c_limit,fl_progressive,q_80,w_1030/omox9xypgbi5mzqgo8rf.png',
    is_in_active_season: true,
    can_remove: false,
  },
  {
    id: 15,
    name: 'Los Angeles Lakers',
    logo: null,
    is_in_active_season: false,
    can_remove: true,
  },
];

const mockTeam = {
  id: 1,
  name: 'Toronto Raptors',
  logo: 'https://images.firstwefeast.com/complex/image/upload/c_limit,fl_progressive,q_80,w_1030/omox9xypgbi5mzqgo8rf.png',
  description: 'Holly molly this team is legiiiiiit',
  primary_color: DefaultColors.Primary,
  secondary_color: DefaultColors.Secondary,
} as Team;

const mockTeamsForDropdown = [
  {
    id: 1,
    name: 'Toronto Raptors',
  },
  {
    id: 2,
    name: 'Charleotte Hornets',
  },
  {
    id: 3,
    name: 'Denver Nuggies',
  },
  {
    id: 4,
    name: 'Miami Heat',
  },
  {
    id: 5,
    name: 'Los Angeles Lakers',
  },
  {
    id: 6,
    name: 'Toronto Raptors',
  },
  {
    id: 7,
    name: 'Charleotte Hornets',
  },
  {
    id: 8,
    name: 'Denver Nuggies',
  },
  {
    id: 9,
    name: 'Miami Heat',
  },
  {
    id: 10,
    name: 'Los Angeles Lakers',
  },
  {
    id: 11,
    name: 'Toronto Raptors',
  },
  {
    id: 12,
    name: 'Charleotte Hornets',
  },
  {
    id: 13,
    name: 'Denver Nuggies',
  },
  {
    id: 14,
    name: 'Miami Heat',
  },
  {
    id: 15,
    name: 'Los Angeles Lakers',
  },
];
