'use client';

import { useLeagueControlPanel } from '@/app/control-panel/_components/LeagueControlPanelProvider';
import Modal from '@/app/lib/components/Modal';
import { useMember } from '@/app/lib/hooks/api/control-panel/members';
import { ModalType } from '@/app/types';

export default function MemberForm({
  isOpen,
  close,
  memberId,
}: ModalType & { memberId?: number }) {
  /**
   * TODO: link an account + have settings below (super admin, admin, member, if member have toggles where it shows the things they can do)
   *
   * permissions:
   * -news
   * -registrations
   * -members (must be admin level, owner > super-admin > admin > member > player)
   *
   * -seasons
   * -teams
   * -players
   */

  const { slug } = useLeagueControlPanel();

  const { member, status } = useMember({
    slug: slug,
    memberId,
  });

  return (
    <Modal panelClasses='sm:w-[540px] w-full' isOpen={isOpen} close={close}>
      {status === 'success' && member ? <div>wowzer</div> : null}

      {status === 'loading' ? <FormSkeleton /> : null}
    </Modal>
  );
}

function FormSkeleton() {
  return <div>skellybop</div>;
}
