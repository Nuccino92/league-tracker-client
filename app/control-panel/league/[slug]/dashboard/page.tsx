import Container from '@/app/control-panel/_components/Container';
import WebsiteStatistics from '@/app/control-panel/league/[slug]/dashboard/_components/WebsiteStatistics';
import NoticeStats from '@/app/control-panel/league/[slug]/notices/_components/NoticeStats';
import DashboardRegistrationStatistics from '@/app/control-panel/league/[slug]/dashboard/_components/DashboardRegistrationStatistics';
import DashboardSeasonContainer from '@/app/control-panel/league/[slug]/dashboard/_components/DashboardSeasonContainer';
import DashboardHeader from '@/app/control-panel/league/[slug]/dashboard/_components/DashboardHeaderr';
import DashboardAccountInfo from '@/app/control-panel/league/[slug]/dashboard/_components/DashboardAccountInfo';
import StyledBox from '@/app/lib/components/StyledBox';
import DashboardLeagueSubscriptionInformation from '@/app/control-panel/league/[slug]/dashboard/_components/DashboardLeagueSubscriptionInformation';

/**
 *
 * @param param0
 * @returns
 *
 * @adding
 * notice statistics
 * website views?
 * registrations to new season?
 * revenue earned
 * create a game
 */

// todo: put new placeholder ui if the user is only an admin
// should maybe check to see how i manage memembers, we could do a feature check on certain things before rendering them

// todo: handle when no active season
// todo: put the website subscription informatin in

export default async function DashboardPage({
  params,
}: {
  params: { ['slug']: string };
}) {
  return (
    <Container view='league'>
      <div className='mb-6'>
        <DashboardHeader />
      </div>

      <div className='flex justify-between gap-6'>
        {/* Main content */}
        <div className='w-full space-y-6'>
          <StyledBox classes='p-6 w-full space-y-6' boxShadow>
            <NoticeStats />
            <DashboardRegistrationStatistics />{' '}
          </StyledBox>{' '}
          <WebsiteStatistics />
        </div>

        {/* Sidepanel */}
        <StyledBox classes='flex flex-col gap-4 p-6 w-[300px] min-w-[300px] h-max'>
          <DashboardAccountInfo />
          <DashboardLeagueSubscriptionInformation />
          <DashboardSeasonContainer />
        </StyledBox>
      </div>
    </Container>
  );
}
