import Container from '@/app/control-panel/_components/Container';
import MembersList from './_components/MembersList';
import MembersHeader from './_components/MembersHeader';

export default function MembersPage({
  params,
  searchParams,
}: {
  params: { ['slug']: string };
  searchParams: Record<string, string | undefined>;
}) {
  return (
    <Container view='league'>
      <MembersHeader />
      <main>
        <MembersList slug={params.slug} />
      </main>
    </Container>
  );
}
