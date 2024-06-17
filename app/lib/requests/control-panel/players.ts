import { z } from 'zod';

import ROUTES from '@/app/lib/globals/routes';
import {
  ControlPanelArchivedPlayer,
  ControlPanelListPlayer,
  ErrorType,
  controlPanelArchivedPlayerSchema,
  controlPanelListPlayerSchema,
} from '@/app/lib/types/Responses/control-panel.types';
import { Player, playerSchema } from '@/app/lib/types/Models/Player';

//TODO schema.parse the data with the schema's you made
export async function fetchControlPanelPlayers({
  token,
  slug,
  params,
}: {
  token: string;
  slug: string;
  params: string;
}) {
  // TODO: possibly add can_remove property
  return new Promise<ControlPanelListPlayer[]>((resolve) => {
    setTimeout(() => {
      const result = z
        .array(controlPanelListPlayerSchema)
        .parse(mockPlayerList);
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
      cache: 'no-store',
    }
  );

  const data = await response.json();

  if (!response.ok)
    throw {
      message: data.error as ErrorType,
      statusCode: response.status,
      owner_id: data.owner_id,
    } as NotOk & { owner_id: string | undefined };

  //  return z.array(controlPanelListPlayerSchema).parse(mockPlayerList);
}

export async function fetchControlPanelPlayer({
  token,
  slug,
  playerId,
}: {
  token: string;
  slug: string;
  playerId: number;
}) {
  return new Promise<Player>((resolve) => {
    setTimeout(() => {
      const result = playerSchema.parse(mockPlayer);
      resolve(result);
    }, 630);
  });
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_KEEPR_API_URL}${ROUTES.CONTROL_PANEL}${ROUTES.LEAGUE}/${slug}/teams/${playerId}`,
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

export async function fetchControlPanelArchivedPlayers({
  token,
  slug,
  params,
}: {
  token: string;
  slug: string;
  params: string;
}) {
  return new Promise<ControlPanelArchivedPlayer[]>((resolve) => {
    setTimeout(() => {
      const result = z
        .array(controlPanelArchivedPlayerSchema)
        .parse(mockPlayerList);
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

const mockPlayer = {
  id: 1,
  name: 'Jimmeh Johns',
  avatar: null,
  number: 43,
  age: 27,
} as Player;

const mockPlayerList = [
  {
    id: 1,
    name: 'Jimmy Smithers',
    avatar: null,
    team: null,
  },
  {
    id: 2,
    name: 'Jimmy Smithers',
    avatar:
      'https://images.firstwefeast.com/complex/image/upload/c_limit,fl_progressive,q_80,w_1030/omox9xypgbi5mzqgo8rf.png',
    team: 'Brooklyn Nets',
  },
  {
    id: 3,
    name: 'Jimmy Smithers',
    avatar: null,
    team: null,
  },
  {
    id: 4,
    name: 'Jimmy Smithers',
    avatar: null,
    team: 'Toronto Raptors',
  },
  {
    id: 5,
    name: 'Jimmy Smithers',
    avatar: null,
    team: null,
  },
  {
    id: 6,
    name: 'Jimmy Smithers',
    avatar:
      'https://images.firstwefeast.com/complex/image/upload/c_limit,fl_progressive,q_80,w_1030/omox9xypgbi5mzqgo8rf.png',
    team: 'Brooklyn Nets',
  },
  {
    id: 7,
    name: 'Jimmy Smithers',
    avatar:
      'https://images.firstwefeast.com/complex/image/upload/c_limit,fl_progressive,q_80,w_1030/omox9xypgbi5mzqgo8rf.png',
    team: 'Brooklyn Nets',
  },
  {
    id: 8,
    name: 'Jimmy Smithers',
    avatar: null,
    team: null,
  },
  {
    id: 9,
    name: 'Jimmy Smithers',
    avatar: null,
    team: null,
  },
  {
    id: 10,
    name: 'Jimmy Smithers',
    avatar:
      'https://images.firstwefeast.com/complex/image/upload/c_limit,fl_progressive,q_80,w_1030/omox9xypgbi5mzqgo8rf.png',
    team: null,
  },
  {
    id: 11,
    name: 'Jimmy Smithers',
    avatar: null,
    team: 'Toronto Raptors',
  },
  {
    id: 12,
    name: 'Jimmy Smithers',
    avatar:
      'https://images.firstwefeast.com/complex/image/upload/c_limit,fl_progressive,q_80,w_1030/omox9xypgbi5mzqgo8rf.png',
    team: null,
  },
] as ControlPanelListPlayer[];
