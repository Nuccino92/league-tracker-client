import Container from '@/app/control-panel/_components/Container';
import TeamInformation from '@/app/control-panel/league/[slug]/teams/[id]/_components/TeamInformation';
import TeamManagementSection from '@/app/control-panel/league/[slug]/teams/[id]/_components/TeamManagementSection';

export default function TeamPage({
  params,
  searchParams,
}: {
  params: { ['slug']: string; ['id']: string };
  searchParams: Record<string, string | undefined>;
}) {
  //Page is restricted to min admin level access or member with team permission scope

  return (
    <Container view='league'>
      <div className='flex w-full justify-center'>
        <div className='w-full max-w-[1200px] space-y-6'>
          <TeamInformation slug={params.slug} id={params.id} />
          {/* Calendar */}
          <TeamManagementSection slug={params.slug} id={params.id} />
        </div>{' '}
      </div>
    </Container>
  );
}
