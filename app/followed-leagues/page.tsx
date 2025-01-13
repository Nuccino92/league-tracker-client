import AuthedContainer from '@/app/lib/components/_auth/AuthedContainer';
import PageHeader from '@/app/control-panel/_components/PageHeader';
import FollowedLeagues from '@/app/followed-leagues/_components/FollowedLeagues';

export default function FollowedLeaguesPage() {
  /**
   * show a list of leagues that user is involved with
   * - each item will show league name, image, and the users role. depending on the role the user will get a link to the dashboard (owner, super admin, admin) or the teams page (team level access). will potentially eliminate this role type as it complicates things and might not be completely necessary
   *
   * show list of leagues that user has bookmarked, allow user to search for league in db and bookmark. could potentially link to teams to follow
   */

  return (
    <AuthedContainer>
      <PageHeader text='Followed Leagues' />
      <main className='mt-6 flex flex-col items-start'>
        <FollowedLeagues />
      </main>
    </AuthedContainer>
  );
}
