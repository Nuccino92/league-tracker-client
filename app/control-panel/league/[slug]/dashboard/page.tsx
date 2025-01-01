import Container from '@/app/control-panel/_components/Container';
import HomePageForms from '@/app/control-panel/league/[slug]/dashboard/_components/HomePageForms';

export default async function DashboardPage({
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
