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
} from '@/app/lib/types/Responses/control-panel.types';
import { Team, teamSchema } from '@/app/lib/types/Models/Team';

export async function fetchControlPanelTeams({
  token,
  slug,
  params,
}: {
  token: string;
  slug: string;
  params: string;
}) {
  // TODO: possibly add can_remove property

  return new Promise<ControlPanelListTeam[]>((resolve) => {
    setTimeout(() => {
      const result = z.array(controlPanelListTeamSchema).parse(mockTeamList);
      resolve(result);
    }, 400);
  });
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_KEEPR_API_URL}${ROUTES.CONTROL_PANEL}${ROUTES.LEAGUE}/${slug}?${params}`,
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

export async function fetchControlPanelTeam({
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

export async function fetchControlPanelTeamsForManagement({
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

export async function fetchControlPanelArchivedTeams({
  token,
  slug,
  params,
}: {
  token: string;
  slug: string;
  params: string;
}) {
  return new Promise<ControlPanelArchivedTeam[]>((resolve) => {
    setTimeout(() => {
      const result = z
        .array(controlPanelArchivedTeamSchema)
        .parse(mockTeamList);
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

export async function fetchControlPanelTeamsForDropdown({
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

const mockTeamList = [
  {
    id: 1,
    name: 'Toronto Raptors',
    logo: null,
    league_id: 20,
  },
  {
    id: 2,
    name: 'Toronto Raptors',
    logo: 'https://images.firstwefeast.com/complex/image/upload/c_limit,fl_progressive,q_80,w_1030/omox9xypgbi5mzqgo8rf.png',
    league_id: 20,
  },
  {
    id: 3,
    name: 'Toronto Raptors',
    logo: null,
    league_id: 20,
  },
  {
    id: 4,
    name: 'Toronto Raptors',
    logo: 'https://images.firstwefeast.com/complex/image/upload/c_limit,fl_progressive,q_80,w_1030/omox9xypgbi5mzqgo8rf.png',
    league_id: 20,
  },
  {
    id: 5,
    name: 'Toronto Raptors',
    logo: null,
    league_id: 20,
  },
];

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
  id: 4,
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
