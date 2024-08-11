import Container from '@/app/control-panel/_components/Container';
import PageHeader from '@/app/control-panel/_components/PageHeader';

export default function CalendarPage() {
  /**
   * Schduling typs
   * Games -scope:teams
   * Practices -scope: teams
   * Events  -scope:league,teams
   */
  return (
    <Container view='league'>
      <PageHeader text='Calendar' />
      <main>this is the calendar page</main>
    </Container>
  );
}
