import { z } from 'zod';

import ROUTES from '@/app/lib/globals/routes';
import {
  controlPanelMemberForEdit,
  ControlPanelMemberForEdit,
  ControlPanelMembersList,
  ErrorType,
} from '@/app/lib/types/Responses/control-panel.types';
import { memberSchema } from '@/app/lib/types/Models/Member';
import { PaginationMetaSchema } from '@/app/lib/types/pagination.types';
import {
  AddMemberSaveValues,
  ModifyMemberSaveValues,
} from '@/app/lib/types/Resources/CreateMemberResource';

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

  const memberListResponseSchema = z.object({
    data: z.array(memberSchema),
    meta: PaginationMetaSchema.nullable(),
  });

  type MemberListResponse = z.infer<typeof memberListResponseSchema>;

  return new Promise<MemberListResponse>((resolve) => {
    setTimeout(() => {
      const result = memberListResponseSchema.parse(mockMembersList);
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
const mockMembersList = {
  meta: {
    current_page: 1,
    last_page: 4,
    to: 0,
    from: 0,
    path: '',
    per_page: 0,
    total: 11,
    links: [],
  },
  data: [
    {
      id: 1234,
      user_id: 3,
      name: 'Johnny Bravoso',
      role: 'admin',
      avatar: null,
      email: 'skibidi@hotmail.com',
      status: 'accepted',
    },
    {
      id: 1237,
      user_id: 4,
      name: 'Carl Weathers',
      role: 'admin',
      avatar: null,
      email: 'skibidi@hotmail.com',
      status: 'suspended',
    },
    {
      id: 1334,
      user_id: 5,
      name: 'Victor Jones',
      role: 'scorekeeper',
      avatar:
        'https://images.firstwefeast.com/complex/image/upload/c_limit,fl_progressive,q_80,w_1030/omox9xypgbi5mzqgo8rf.png',
      email: 'skibidi@hotmail.com',
      status: 'pending',
    },
    {
      id: 1884,
      user_id: 6,
      name: 'Larry Terry',
      role: 'admin',
      avatar: null,
      email: 'skibidi@hotmail.com',
      status: 'accepted',
    },
    {
      id: 6066,
      user_id: 7,
      name: 'Antonio Barbosa',
      role: 'super-admin',
      avatar:
        'https://images.firstwefeast.com/complex/image/upload/c_limit,fl_progressive,q_80,w_1030/omox9xypgbi5mzqgo8rf.png',
      email: 'skibidi@hotmail.com',
      status: 'pending',
    },
    {
      id: 1,
      user_id: 8,
      name: 'Anthony Nucci',
      role: 'owner',
      avatar:
        'https://images.firstwefeast.com/complex/image/upload/c_limit,fl_progressive,q_80,w_1030/omox9xypgbi5mzqgo8rf.png',
      email: 'skibidi@hotmail.com',
      status: 'declined',
    },
  ],
};

export async function fetchControlPanelMember({
  token,
  slug,
  memberId,
}: {
  token: string;
  slug: string;
  memberId: number;
}) {
  return new Promise<ControlPanelMemberForEdit>((resolve) => {
    setTimeout(() => {
      const result = controlPanelMemberForEdit.parse(mockMember);
      resolve(result);
    }, 630);
  });
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_KEEPR_API_URL}${ROUTES.CONTROL_PANEL}${ROUTES.LEAGUE}/${slug}/teams/${memberId}`,
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

const mockMember = {
  id: 432413,
  name: 'Antonio Barbosa',
  role: 'admin',
  email: 'anthony@hotmail.com',
  status: 'accepted',
} as ControlPanelMemberForEdit;

export async function validateEmailForMembersRequest({
  email,
  token,
}: {
  email: string;
  token: string;
}) {
  // need to also validate if the email is already a member of the league

  return new Promise<{ is_valid_email: boolean }>((resolve) => {
    setTimeout(() => {
      resolve({ is_valid_email: true });
    }, 630);
  });
}

export async function addMemberRequest({
  token,
  values,
}: {
  token: string;
  values: AddMemberSaveValues;
}) {
  return new Promise<boolean>((resolve) => {
    setTimeout(() => {
      console.log('add member values', values);
      resolve(true);
    }, 810);
  });
}

export async function modifyMemberRequest({
  token,
  values,
}: {
  token: string;
  values: ModifyMemberSaveValues;
}) {
  return new Promise<boolean>((resolve) => {
    setTimeout(() => {
      console.log('modify member values', values);
      resolve(true);
    }, 810);
  });
}

export async function removeMemberRequest({
  token,
  id,
}: {
  token: string;
  id: number;
}) {
  return new Promise<boolean>((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, 810);
  });
}
