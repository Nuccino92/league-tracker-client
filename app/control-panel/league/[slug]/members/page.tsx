import Container from '@/app/control-panel/_components/Container';
import MembersList from '@/app/control-panel/league/[slug]/members/_components/MembersList';
import MembersHeader from '@/app/control-panel/league/[slug]/members/_components/MembersHeader';

/**
 *
 * @param param0
 * @returns
 *
 * @todo
 * explain what each role is capable of, also explain that the super admins are able to see the stats of the season
 */

// will have member statuses, pending, accepted, declined etc

/**
 * @flow
 *
 *
 */

export default function MembersPage({
  params,
  searchParams,
}: {
  params: { ['slug']: string };
  searchParams: Record<string, string | undefined>;
}) {
  return (
    <Container view='league'>
      <div className='space-y-4'>
        <MembersHeader />
        <main className='h-[calc(100%-104px)]'>
          <MembersList />
        </main>
      </div>
    </Container>
  );
}
