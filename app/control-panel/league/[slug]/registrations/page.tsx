import Container from '@/app/control-panel/_components/Container';
import PageHeader from '@/app/control-panel/_components/PageHeader';

/**
 *
 * @returns
 * https://www.jerseywatch.com/demo
 * TOOD: possibly add a dashboard type of thing w/ stats like pageviews money collected, program gristrants, messages,
 *
 * TODO: create stripe registration (first day, last day, details, registration limit, payments, questions). view jerseywatch
 *
 * Add registration link on website side (where league stats are etc.) if they have online registration forms
 *
 * possibly add contact list
 */

export default function RegistrationsPage() {
  return (
    <Container view='league'>
      <PageHeader text='Registrations' />
      <main>this is the payments page</main>
    </Container>
  );
}
