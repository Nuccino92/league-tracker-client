import Container from '@/app/control-panel/_components/Container';
import Seasons from '@/app/control-panel/league/[slug]/seasons/_components/Seasons';
import SeasonContent from '@/app/control-panel/league/[slug]/seasons/_components/SeasonContent';

export default async function SeasonsPage({
  params,
  searchParams,
}: {
  params: { ['slug']: string };
  searchParams: Record<string, string | undefined>;
}) {
  /**
   * Page structure
   * Header:
   * going to have the index pages seasons information. can add/remove & manage each season. Also make an active season
   * below:
   * possibly have stats.. standings not sure (maybe not...)
   * going to have a focused season. Fetches a seaons data and returns the teams/players in that season
   * be able to select a team.
   * show roster to remove teams (move the teams manage active season modal into here)
   * maybe have add player button/if add player get available players without teams
   */

  return (
    <Container view='league'>
      <div className='h-[calc(100%-104px)] space-y-4'>
        <Seasons slug={params['slug']} />
        <SeasonContent slug={params['slug']} />
      </div>
    </Container>
  );
}
