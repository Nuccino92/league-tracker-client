import classNames from 'classnames';

import Modal from '@/app/lib/components/Modal';
import { ModalType } from '@/app/types';

type Props = {};

export default function LinkRegistrationModal({
  isOpen,
  close,
  panelClasses,
}: Props & ModalType) {
  return (
    <Modal
      panelClasses={classNames(
        panelClasses,
        'sm:w-[640px] w-full overflow-visible w-max relative rounded-xl'
      )}
      isOpen={isOpen}
      close={close}
    >
      i am the modal
    </Modal>
  );
}
