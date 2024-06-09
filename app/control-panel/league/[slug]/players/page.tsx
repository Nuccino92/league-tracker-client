import { cookies } from 'next/headers';
import { dehydrate, Hydrate } from '@tanstack/react-query';

import Container from '@/app/control-panel/_components/Container';
import PageHeader from '@/app/control-panel/_components/PageHeader';
import Players from '@/app/control-panel/league/[slug]/players/_components/Players';
import getQueryClient from '@/app/getQueryClient';
import QUERY_KEYS from '@/app/lib/globals/queryKeys';
import { createQueryString } from '@/app/lib/utils/createQueryString';
import { fetchControlPanelPlayers } from '@/app/lib/requests/control-panel/players';

export default async function PlayersPage({
  params,
  searchParams,
}: {
  params: { ['slug']: string };
  searchParams: Record<string, string | undefined>;
}) {
  // todo: might need to change session token string for production
  const token = cookies().get('next-auth.session-token')?.value;

  const queryClient = getQueryClient();
  await queryClient.prefetchQuery({
    queryKey: [
      QUERY_KEYS.CONTROL_PANEL.PLAYERS,
      params.slug,
      createQueryString(searchParams),
    ],
    queryFn: () =>
      fetchControlPanelPlayers({
        token: token as string,
        slug: params.slug,
        params: createQueryString(searchParams),
      }),
  });
  const dehydratedState = dehydrate(queryClient);

  return (
    <Container view='league'>
      <Hydrate state={dehydratedState}>
        <div className='space-y-4'>
          <PageHeader text='Players' />
          <Players slug={params['slug']} />
        </div>
      </Hydrate>
    </Container>
  );
}
