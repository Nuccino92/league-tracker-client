import UserProfileForms from '@/app/profile/_components/UserProfileForms';
import AuthedContainer from '@/app/lib/components/_auth/AuthedContainer';

export default function ProfilePage() {
  return (
    <AuthedContainer>
      <main>
        <UserProfileForms />
      </main>
    </AuthedContainer>
  );
}
