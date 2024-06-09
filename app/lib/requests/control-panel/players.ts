import ROUTES from '@/app/lib/globals/routes';
import {
  ControlPanelPlayer,
  ErrorType,
} from '@/app/lib/types/Responses/control-panel.types';

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
  return new Promise<ControlPanelPlayer[]>((resolve) => {
    setTimeout(() => {
      resolve(mockPlayerList);
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

  //  return data.data as ControlPanelListTeam[];
}

const mockPlayerList = [
  {
    id: 1,
    name: 'Jimmy Smithers',
    avatar: null,
  },
  {
    id: 2,
    name: 'Jimmy Smithers',
    avatar:
      'https://images.firstwefeast.com/complex/image/upload/c_limit,fl_progressive,q_80,w_1030/omox9xypgbi5mzqgo8rf.png',
  },
  {
    id: 3,
    name: 'Jimmy Smithers',
    avatar: null,
  },
  {
    id: 4,
    name: 'Jimmy Smithers',
    avatar: null,
  },
  {
    id: 5,
    name: 'Jimmy Smithers',
    avatar: null,
  },
  {
    id: 6,
    name: 'Jimmy Smithers',
    avatar:
      'https://images.firstwefeast.com/complex/image/upload/c_limit,fl_progressive,q_80,w_1030/omox9xypgbi5mzqgo8rf.png',
  },
  {
    id: 7,
    name: 'Jimmy Smithers',
    avatar:
      'https://images.firstwefeast.com/complex/image/upload/c_limit,fl_progressive,q_80,w_1030/omox9xypgbi5mzqgo8rf.png',
  },
  {
    id: 8,
    name: 'Jimmy Smithers',
    avatar: null,
  },
  {
    id: 9,
    name: 'Jimmy Smithers',
    avatar: null,
  },
  {
    id: 10,
    name: 'Jimmy Smithers',
    avatar:
      'https://images.firstwefeast.com/complex/image/upload/c_limit,fl_progressive,q_80,w_1030/omox9xypgbi5mzqgo8rf.png',
  },
  {
    id: 11,
    name: 'Jimmy Smithers',
    avatar: null,
  },
  {
    id: 12,
    name: 'Jimmy Smithers',
    avatar:
      'https://images.firstwefeast.com/complex/image/upload/c_limit,fl_progressive,q_80,w_1030/omox9xypgbi5mzqgo8rf.png',
  },
] as ControlPanelPlayer[];
