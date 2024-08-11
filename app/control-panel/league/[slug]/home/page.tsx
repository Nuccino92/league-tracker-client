import Container from '@/app/control-panel/_components/Container';
import HomePageForms from '@/app/control-panel/league/[slug]/home/_components/HomePageForms';

export default async function Home({
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
