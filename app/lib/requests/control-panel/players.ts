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
import { PaginationMetaSchema } from '@/app/lib/types/pagination.types';

//TODO schema.parse the data with the schema's you made
export async function fetchControlPanelPlayers({
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
  const controlPanelPlayersSchema = z.object({
    data: z.array(controlPanelListPlayerSchema),
    meta: PaginationMetaSchema.nullable(),
  });

  type ControlPanelPlayers = z.infer<typeof controlPanelPlayersSchema>;

  return new Promise<ControlPanelPlayers>((resolve) => {
    console.log('api hit');
    setTimeout(() => {
      const result = controlPanelPlayersSchema.parse(mockPlayerList);
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
  const controlPanelArchivedPlayerResponseSchema = z.object({
    data: z.array(controlPanelArchivedPlayerSchema),
    meta: PaginationMetaSchema.nullable(),
  });

  type ControlPanelArchivedPlayers = z.infer<
    typeof controlPanelArchivedPlayerResponseSchema
  >;

  return new Promise<ControlPanelArchivedPlayers>((resolve) => {
    setTimeout(() => {
      const result =
        controlPanelArchivedPlayerResponseSchema.parse(mockPlayerList);
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

export async function fetchFreeAgents({
  token,
  slug,
  paginate = true,
  params,
}: {
  token: string;
  slug: string;
  paginate: boolean;
  params: string;
}) {
  const controlPanelPlayersFreeAgentsResponse = z.object({
    data: z.array(controlPanelListPlayerSchema),
    meta: PaginationMetaSchema.nullable(),
  });

  type ControlPanelPlayersFreeAgentsResaponse = z.infer<
    typeof controlPanelPlayersFreeAgentsResponse
  >;

  return new Promise<ControlPanelPlayersFreeAgentsResaponse>((resolve) => {
    setTimeout(() => {
      const result =
        controlPanelPlayersFreeAgentsResponse.parse(mockPlayerList);
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

const mockPlayer = {
  id: 1,
  name: 'Jimmeh Johns',
  avatar: null,
  email: 'cashNasty@gmail.com',
  phoneNumber: '423424234',
  emergencyContactName: 'Anthony Garry',
  emergencyContactPhone: '423424234',
} as Player;

const mockPlayerList = {
  meta: null,
  data: [
    {
      id: 1,
      name: 'Leaky Black',
      email: 'leakyb@gmail.com',
      avatar: null,
    },
    {
      id: 2,
      name: 'Jimmy Smithers',
      email: 'jimmy@gmail.com',
      avatar:
        'https://images.firstwefeast.com/complex/image/upload/c_limit,fl_progressive,q_80,w_1030/omox9xypgbi5mzqgo8rf.png',
    },
    {
      id: 3,
      name: 'Anthony Ronaldo',
      email: 'ar99@gmail.com',
      avatar: null,
    },
    {
      id: 4,
      name: 'Corey Hamal',
      email: 'corey@gmail.com',
      avatar: null,
    },
    {
      id: 5,
      name: 'Luke Walton',
      email: 'luke@gmail.com',
      avatar: null,
    },
    {
      id: 6,
      name: 'Jerry Jones',
      email: 'jjones@gmail.com',
      avatar:
        'https://images.firstwefeast.com/complex/image/upload/c_limit,fl_progressive,q_80,w_1030/omox9xypgbi5mzqgo8rf.png',
    },
    {
      id: 7,
      name: 'Colin Jones',
      email: 'colinj@gmail.com',
      avatar:
        'https://images.firstwefeast.com/complex/image/upload/c_limit,fl_progressive,q_80,w_1030/omox9xypgbi5mzqgo8rf.png',
    },
    {
      id: 8,
      name: 'Zack Wilson',
      email: 'wilsonz@gmail.com',
      avatar: null,
    },
    {
      id: 9,
      name: 'Harriet Tubman',
      email: 'htubb@gmail.com',
      avatar: null,
    },
    {
      id: 10,
      name: 'Bill Walton',
      email: 'billyw@gmail.com',
      avatar:
        'https://images.firstwefeast.com/complex/image/upload/c_limit,fl_progressive,q_80,w_1030/omox9xypgbi5mzqgo8rf.png',
    },
    {
      id: 11,
      name: 'Truman Larold',
      email: 'trul@gmail.com',
      avatar: null,
    },
    {
      id: 12,
      name: 'Harry Potter',
      email: 'hpp@gmail.com',
      avatar:
        'https://images.firstwefeast.com/complex/image/upload/c_limit,fl_progressive,q_80,w_1030/omox9xypgbi5mzqgo8rf.png',
    },
  ],
};
