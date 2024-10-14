'use client';

import classNames from 'classnames';

import { ModalType } from '@/app/types';
import Modal from '@/app/lib/components/Modal';

type Props = {};

/**
 *
 * @param param0
 * @returns
 *
 * @TODO
 *  - need to return only the teams that are part of the selected season
 *  - allow user to select any number of teams that they would like, when they click the apply button then put the teams in the params (teams) for the useEvents hook to read and pass to api
 *  - if the user has all the teams selected when clicking the apply button, then erase the param (teams)
 */

export default function TeamSelectionModal({
  isOpen,
  close,
  panelClasses,
}: Props & ModalType) {
  return (
    <Modal
      panelClasses={classNames(
        panelClasses,
        'sm:min-w-[640px] w-full overflow-visible w-max'
      )}
      isOpen={isOpen}
      close={close}
    >
      i am the team selection modal
    </Modal>
  );
}
