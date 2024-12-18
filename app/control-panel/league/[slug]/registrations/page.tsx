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
 * TODO: create stripe registration (first day, last day, details, registration limit, payments, questions). view jerseywatch
 *
 * Add registration link on website side (where league stats are etc.) if they have online registration forms
 *
 * possibly add contact list
 */

/**
 *
 * @returns
 * TODO: have a button to create a dynamic form (builder)
 *
 * TODO: display the list of registration forms
 *
 * TODO: view registrants section?? look to find out what else to put
 *
 * TODO: go back to the seasons onces registrations is complete
 *
 * TODO: have a link to existing player button to tie the registration to an existing player. Ask if you want to delete the old player associated with this email
 *
 *
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
