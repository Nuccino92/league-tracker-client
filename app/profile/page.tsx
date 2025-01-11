import UserProfileForms from '@/app/profile/_components/UserProfileForms';
import AuthedContainer from '@/app/lib/components/_auth/AuthedContainer';
import PageHeader from '@/app/control-panel/_components/PageHeader';

export default function ProfilePage() {
  return (
    <AuthedContainer>
      <PageHeader text='Profile' />
      <main className='mt-6 flex flex-col items-start'>
        <UserProfileForms />
      </main>
    </AuthedContainer>
  );
}
