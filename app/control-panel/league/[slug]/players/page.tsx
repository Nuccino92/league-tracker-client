import Container from '@/app/control-panel/_components/Container';
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
        <Players slug={params['slug']} />{' '}
      </div>
    </Container>
  );
}
