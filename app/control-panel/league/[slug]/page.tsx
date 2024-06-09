import Container from '@/app/control-panel/_components/Container';
import HomePageForms from '@/app/control-panel/_components/HomePageForms';

export default async function LeagueControlPanelPage({
  params,
}: {
  params: { ['slug']: string };
}) {
  return (
    <Container view='league'>
      <HomePageForms />
    </Container>
  );
}
