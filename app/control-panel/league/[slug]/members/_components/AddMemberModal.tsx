'use client';

import Modal from '@/app/lib/components/Modal';
import { ModalType } from '@/app/types';

export default function AddMemberModal({
  isOpen,
  close,
  teamId,
}: ModalType & { teamId?: number }) {
  return (
    <Modal panelClasses='sm:w-[540px] w-full' isOpen={isOpen} close={close}>
      <div>wowzer</div>
    </Modal>
  );
}
