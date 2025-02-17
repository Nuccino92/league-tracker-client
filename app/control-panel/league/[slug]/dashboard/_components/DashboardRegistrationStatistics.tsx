'use client';

import { useLeagueControlPanel } from '@/app/control-panel/_components/LeagueControlPanelProvider';
import RegistrantStats from '@/app/control-panel/league/[slug]/registrations/_components/RegistrantStats';

export default function DashboardRegistrationStatistics() {
  const {
    activeSeason,
    leagueData: {
      role: { role_name },
    },
  } = useLeagueControlPanel();

  if (activeSeason && role_name === 'owner')
    return <RegistrantStats seasonId={activeSeason.id.toString()} />;
}
