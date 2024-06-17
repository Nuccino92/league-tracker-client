// import { cookies } from 'next/headers';
// import { dehydrate, Hydrate } from '@tanstack/react-query';

// import getQueryClient from '@/app/getQueryClient';
import Container from '@/app/control-panel/_components/Container';
import PageHeader from '@/app/control-panel/_components/PageHeader';
import Teams from './_components/Teams';
// import { fetchControlPanelTeams } from '@/app/lib/requests/control-panel/teams';
// import { createQueryString } from '@/app/lib/utils/createQueryString';
// import QUERY_KEYS from '@/app/lib/globals/queryKeys';

//TODO: check if no active season and provide disclaimer telling user that they can only assign a team to an active season

export default async function TeamsPage({
  params,
  searchParams,
}: {
  params: { ['slug']: string };
  searchParams: Record<string, string | undefined>;
}) {
  // todo: might need to change session token string for production
  // const token = cookies().get('next-auth.session-token')?.value;

  // const queryClient = getQueryClient();
  // await queryClient.prefetchQuery({
  //   queryKey: [
  //     QUERY_KEYS.CONTROL_PANEL.TEAMS,
  //     params.slug,
  //     createQueryString(searchParams),
  //   ],
  //   queryFn: () =>
  //     fetchControlPanelTeams({
  //       token: token as string,
  //       slug: params.slug,
  //       params: createQueryString(searchParams),
  //     }),
  // });
  // const dehydratedState = dehydrate(queryClient);

  return (
    <Container view='league'>
      {/* <Hydrate state={dehydratedState}> */}
      <div className='h-[calc(100%-104px)] space-y-4'>
        <PageHeader text='League Teams' />
        <Teams slug={params['slug']} />
      </div>
      {/* </Hydrate> */}
    </Container>
  );
}
