import Container from '@/app/control-panel/_components/Container';
import IndexContent from '@/app/control-panel/_components/IndexContent';

export default async function LeagueControlPanelPage({
  params,
}: {
  params: { ['slug']: string };
}) {
  return (
    <Container view='league'>
      <IndexContent />
    </Container>
  );
}
