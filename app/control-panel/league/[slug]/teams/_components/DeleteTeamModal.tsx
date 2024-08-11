'use client';

import { IconHeadAlertOutline } from '@/app/lib/SVGs';
import { Button } from '@/app/lib/components/Button';
import Modal from '@/app/lib/components/Modal';
import { ModalType } from '@/app/types';

export default function DeleteTeamModal({
  isOpen,
  close,
  teamId,
}: ModalType & { teamId?: number }) {
  return (
    <Modal panelClasses='sm:w-[540px] w-full' isOpen={isOpen} close={close}>
      <div className='space-y-6 px-6 text-center'>
        <div className='text-yellow-500'>
          <IconHeadAlertOutline height={55} width={55} className='w-full' />
        </div>

        <h4 className='text-xl font-bold'>
          Would you like to delete this team?
        </h4>

        <p className='text-sm text-zinc-600'>
          <span className='font-medium'> Note:</span> Deleting a team that has
          participated in a game will archive the team, allowing it to be
          restored later if needed.
        </p>

        <div className='flex w-full justify-center space-x-4'>
          <Button
            onClick={() => {
              //TODO: send a delete request
              console.log('TEAM ID:', teamId);

              // TODO: NEED TO CASCADE DELETING the member roles w/ team_mamangement scopes w/ matching id's.
            }}
            type='button'
            className='rounded border border-red-600 bg-red-600 px-4 py-2 text-sm font-medium text-white hover:border-red-600/90 hover:bg-red-600/90'
          >
            Yes, delete
          </Button>{' '}
          <Button
            onClick={close}
            type='button'
            className='rounded border border-secondary bg-secondary px-4 py-2 text-sm font-medium hover:border-secondary/90 hover:bg-secondary/90'
          >
            No, return
          </Button>
        </div>
      </div>
    </Modal>
  );
}
