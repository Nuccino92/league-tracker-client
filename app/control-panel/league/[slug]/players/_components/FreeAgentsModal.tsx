import { useSearchParams } from 'next/navigation';

import Modal from '@/app/lib/components/Modal';
import { useFreeAgents } from '@/app/lib/hooks/api/control-panel/players';
import { ModalType } from '@/app/types';
import { useLeagueControlPanel } from '@/app/control-panel/_components/LeagueControlPanelProvider';

export default function FreeAgentsModal({
  isOpen,
  close,
  slug,
}: ModalType & { slug: string }) {
  const searchParams = useSearchParams();

  const { leagueData } = useLeagueControlPanel();
  const { seasons } = leagueData;

  //TODO: pass in the season
  //TODO: put inside hook for reusability?
  const selectedSeason = searchParams.get('season')
    ? seasons.all_seasons.find(
        (season) => season.id === parseInt(searchParams.get('season') as string)
      )?.id
    : null;

  const { data: freeAgents, status: freeAgentsStatus } = useFreeAgents({
    slug,
  });

  return (
    <Modal panelClasses='sm:w-[640px] w-full' isOpen={isOpen} close={close}>
      <div className='space-y-6'>modalll</div>
    </Modal>
  );
}
