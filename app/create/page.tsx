import Header from '@/app/create/_components/Header';
import CreationSetup from '@/app/create/_components/CreationSetup';

export default function CreatePage() {
  return (
    <div>
      <Header />

      <div className='h-[calc(100vh-80px)] max-w-[100vw] overflow-hidden'>
        <CreationSetup />
      </div>
    </div>
  );
}
