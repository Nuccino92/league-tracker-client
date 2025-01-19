import Container from '@/app/control-panel/_components/Container';
import PageHeader from '@/app/control-panel/_components/PageHeader';
import RegistrationForms from '@/app/control-panel/league/[slug]/registrations/_components/RegistrationForms';
import RegistrantsList from '@/app/control-panel/league/[slug]/registrations/_components/RegistrantsList';

/**
 *
 * @returns
 * https://www.jerseywatch.com/demo
 * TOOD: possibly add a dashboard type of thing w/ stats like pageviews money collected, program gristrants, messages,
 *
 *
 * registrants, add stats like total registrants, total revenue. Could also put the season select at the top and select season so it only shows the form + registrants for that season
 *
 * possibly add contact list
 */

/**
 *
 * @returns
 * TODO: have a button to create a dynamic form (builder)
 */

export default function RegistrationsPage({
  params,
}: {
  params: { ['slug']: string };
}) {
  return (
    <Container view='league'>
      <PageHeader text='Registrations' />
      <main className='mt-6 space-y-6'>
        <RegistrationForms slug={params.slug} />

        <RegistrantsList slug={params.slug} />
      </main>
    </Container>
  );
}
