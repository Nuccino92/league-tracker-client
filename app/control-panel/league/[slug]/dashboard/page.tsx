import Container from '@/app/control-panel/_components/Container';
import HomePageForms from '@/app/control-panel/league/[slug]/settings/_components/LeagueInformation';

export default async function DashboardPage({
  params,
}: {
  params: { ['slug']: string };
}) {
  return <Container view='league'>db</Container>;
}
