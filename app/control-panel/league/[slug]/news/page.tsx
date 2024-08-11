import Container from '@/app/control-panel/_components/Container';
import PageHeader from '@/app/control-panel/_components/PageHeader';

export default function NewsPage() {
    /**
     * be able to filter by game 
     */
  return (
    <Container view='league'>
      <PageHeader text='News' />
      <main>this is the news page</main>
    </Container>
  );
}
