import Container from '@/app/control-panel/_components/Container';
import PageHeader from '@/app/control-panel/_components/PageHeader';
import LeagueCalendar from '@/app/control-panel/league/[slug]/calendar/_components/LeagueCalendar';
import LeagueCalendarFilters from '@/app/control-panel/league/[slug]/calendar/_components/LeagueCalendarFilters';

export default function CalendarPage({
  params,
}: {
  params: { ['slug']: string };
}) {
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

  /**
   * page requirements
   *
   * 1. have a calendar representing a season of the league
   * 2. have the ability to select the team/teams that you want to see specific events for, if no team is selected then return all the teams events. defaults to no team
   * 3. have the ability to filter out the type of event (game, practice, custom).  defaults to game
   *
   * 4. determine whether to only allow custom event type filtering if a team/teams are selected vs if all teams are selected. ex if no teams are selected only allow games to return vs if 1-many teams are selected allow all event types
   */

  /**
   * steps to complete requirements
   * 1. copy code from team schedule and refactor to bring in here
   * 2. add a button to prompt a team select modal and put beside the season selection dropdown, create modal
   * 3. add checkboxes or some input to apply filters, put inside url params
   */

  return (
    <Container view='league'>
      <main className='bg-white text-sm'>
        <LeagueCalendarFilters />
        <LeagueCalendar />
      </main>
    </Container>
  );
}
