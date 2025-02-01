import AuthedContainer from '@/app/lib/components/_auth/AuthedContainer';
import Notifications from '@/app/notifications/_components/Notifications';

export default function NotificationsPage() {
  /**
   * @page content
   *
   * types of notifications
   * 1. invites to leagues
   * 2. owner/admin sending message to member of league from control panel
   * 3. when max capacity of registation form is hit for the owner of a league
   * 4. when subscription is initially purchased
   * 5. when subscription is within a week of expiration
   * 6. when sub is wihthin 3 days of expiration
   * 7. when subscription type is updated
   *
   *
   * also add subscription notifications
   */

  /**
   * UI
   *
   * delete all btn
   * mark all as read button
   * notification setting button
   *
   */

  // for each item, could have mark as read, delete, name icon date select to multi delete

  //https://claude.ai/chat/5e98a37a-e695-4601-ba99-8f57003a95fe
  return (
    <AuthedContainer>
      <main className=''>
        <Notifications />
      </main>
    </AuthedContainer>
  );
}
