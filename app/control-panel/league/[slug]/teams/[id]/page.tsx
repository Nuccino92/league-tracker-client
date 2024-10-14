import Container from '@/app/control-panel/_components/Container';
import PageHeader from '@/app/control-panel/_components/PageHeader';
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

  /**
   * remaining todo's
   *
   * roster tab
   * add breadcrumb to lead back to teams page
   */

  return (
    <Container view='league'>
      <div className='mb-6'>breadcrumb</div>
      <div className='flex w-full justify-center'>
        <div className='w-full max-w-[1200px] space-y-6'>
          <TeamInformation slug={params.slug} id={params.id} />
          {/* Calendar */}
          <TeamManagementSection slug={params.slug} />
        </div>{' '}
      </div>
    </Container>
  );
}
