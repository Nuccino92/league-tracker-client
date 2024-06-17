import Container from '@/app/control-panel/_components/Container';
import PageHeader from '@/app/control-panel/_components/PageHeader';
import Players from '@/app/control-panel/league/[slug]/players/_components/Players';

export default async function PlayersPage({
  params,
  searchParams,
}: {
  params: { ['slug']: string };
  searchParams: Record<string, string | undefined>;
}) {
  return (
    <Container view='league'>
      <div className='h-[calc(100%-104px)] space-y-4'>
        <PageHeader text='League Players' />
        <Players slug={params['slug']} />{' '}
      </div>
    </Container>
  );
}
