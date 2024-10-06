import Container from '@/app/control-panel/_components/Container';
import PageHeader from '@/app/control-panel/_components/PageHeader';

export default function CalendarPage() {
  /**
   * Schduling typs
   * Games -scope:teams
   * Practices -scope: teams
   * Events  -scope:league,teams
   */

  /**
   * get scope, is it league or team
   * if on team, only show team events, when creating lock this team
   * if league, show all events for the league
   */
  return (
    <Container view='league'>
      <PageHeader text='Calendar' />
      <main>this is the calendar page</main>
    </Container>
  );
}
