import { z } from 'zod';

import ROUTES from '@/app/lib/globals/routes';
import {
  ControlPanelMembersList,
  ErrorType,
} from '../../types/Responses/control-panel.types';
import { memberSchema } from '../../types/Models/Member';

export async function fetchControlPanelMembers({
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

  return new Promise<ControlPanelMembersList[]>((resolve) => {
    setTimeout(() => {
      const result = z.array(memberSchema).parse(mockMembersList);
      resolve(result);
    }, 400);
  });
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_KEEPR_API_URL}${ROUTES.CONTROL_PANEL}${ROUTES.LEAGUE}/${slug}?${params}&paginate=${paginate}}`,
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

// TODO: possibly sort by role, super admin -> admin -> member
const mockMembersList = [
  { id: 1234, name: 'Johnny Bravoso', role: 'member' },
  { id: 1884, name: 'Larry Terry', role: 'admin' },
  { id: 6066, name: 'Antonio Barbosa', role: 'super-admin' },
];
