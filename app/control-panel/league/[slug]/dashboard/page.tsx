import Container from '@/app/control-panel/_components/Container';
import PageHeader from '@/app/control-panel/_components/PageHeader';
import WebsiteStatistics from '@/app/control-panel/league/[slug]/dashboard/_components/WebsiteStatistics';
import NoticeStats from '@/app/control-panel/league/[slug]/notices/_components/NoticeStats';

/**
 *
 * @param param0
 * @returns
 *
 * @adding
 * notice statistics
 * website views?
 * registrations to new season?
 * create a game
 */

export default async function DashboardPage({
  params,
}: {
  params: { ['slug']: string };
}) {
  return (
    <Container view='league'>
      <PageHeader text='Dashboard' />
      <WebsiteStatistics />

      <NoticeStats />
    </Container>
  );
}
