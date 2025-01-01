import Container from '@/app/control-panel/_components/Container';
import PageHeader from '@/app/control-panel/_components/PageHeader';
import StyledBox from '@/app/lib/components/StyledBox';
import NoticeStats from '@/app/control-panel/league/[slug]/notices/_components/NoticeStats';
import CreateAnnouncement from '@/app/control-panel/league/[slug]/notices/_components/CreateAnnouncements';
import AnnouncementsList from '@/app/control-panel/league/[slug]/notices/_components/AnnoncementsList';

export default function NoticesPage() {
  /**
   * this is a page to allow admins to manage notices for the league
   */

  /**
   * what does this page do?
   *
   * Create announcement
   *
   * View/manage announcements
   *
   * Message center
   *1.Compose using templates (game cancellations, schedule changes)
    2.Character count for SMS
    3.Preview before sending
    4.Track message credit usage
   * 
   * Message History
   *
   */

  /**
   *
   * can create message for entire season, or for specific teams, or for specific players
   *
   * season:
   * - league website (global announcement on the league website)
   * - all teams, specific teams. (teams web page or players on teams sms or email. accepts combination of each)
   * - all players, specific players. (players web page or player sms or email. accepts combination of each)
   * - all registrants, specific registrants. (registrants sms or email. accepts combination of each)
   *
   * global:
   * - league website (global announcement on the league website)
   * - all players, specific players. (players web page or player sms or email. accepts combination of each)
   *
   */
  return (
    <Container view='league'>
      <div className='mb-6'>
        <PageHeader text='Notices' />
      </div>

      <div className='space-y-6'>
        <CreateAnnouncement />

        <NoticeStats />
        {/* Announcements List */}
        <AnnouncementsList />
      </div>
    </Container>
  );
}
