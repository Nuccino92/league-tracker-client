import AuthedContainer from '@/app/lib/components/_auth/AuthedContainer';
import PageHeader from '@/app/control-panel/_components/PageHeader';

export default function HelpPage() {
  return (
    <AuthedContainer>
      <PageHeader text='Help' />
      <main className='mt-6 flex flex-col items-start'>help</main>
    </AuthedContainer>
  );
}
