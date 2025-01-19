import AuthedContainer from '@/app/lib/components/_auth/AuthedContainer';
import PageHeader from '@/app/control-panel/_components/PageHeader';

export default function NotificationsPage() {
  /**
   * @page content
   *
   * types of notifications
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
  return (
    <AuthedContainer>
      <PageHeader text='Notifications' />
      <main className=''>yo</main>
    </AuthedContainer>
  );
}
