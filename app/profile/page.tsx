import Container from '@/app/control-panel/_components/Container';
import UserProfileForms from './_components/UserProfileForms';
import PageHeader from '../control-panel/_components/PageHeader';

export default function ProfilePage() {
  return (
    <>
      {/* <Container view='profile'> */}
      <PageHeader text='Profile' />
      {/*
       * TODO: create form for updating profile
       * have league/org setting for receieving notifications, moving self from league,
       * Create a direct way to start a league
       * have a way to view current league user is apart of (maybe implement roles, owner, admin etc)
       */}
      <main>
        <UserProfileForms />
      </main>
      {/* </Container> */}{' '}
    </>
  );
}
