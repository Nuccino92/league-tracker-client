import Container from '@/app/control-panel/_components/Container';
import StatsSettings from '@/app/control-panel/league/[slug]/settings/_components/StatsSettings';
import LeagueInformation from '@/app/control-panel/league/[slug]/settings/_components/LeagueInformation';

/**
 *
 * @returns
 * @description This is the settings page for the league control panel.
 * @name SettingsPage
 * @todo Add the settings form to this page.
 * @todo add league stats to this page.
 */

export default function SettingsPage() {
  return (
    <Container view='league'>
      <div className='flex flex-col gap-6 [@media(min-width:1400px)]:flex-row'>
        <LeagueInformation />
        <StatsSettings />
      </div>
    </Container>
  );
}
