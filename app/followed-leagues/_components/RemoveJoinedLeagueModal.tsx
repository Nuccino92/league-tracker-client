'use client';

import classNames from 'classnames';

import Modal from '@/app/lib/components/Modal';
import { ModalType } from '@/app/types';
import { FollowedLeague } from '@/app/lib/types/followed-leagues.types';
import { Button } from '@/app/lib/components/Button';

type Props = {
  onRemoveClick: () => Promise<void>;
  league: FollowedLeague;
};

export default function RemoveJoinedLeagueModal({
  isOpen,
  close,
  panelClasses,
  league,
  onRemoveClick,
}: Props & ModalType) {
  return (
    <Modal
      panelClasses={classNames(
        panelClasses,
        'sm:w-[640px] w-full overflow-visible relative rounded-xl'
      )}
      isOpen={isOpen}
      close={close}
    >
      <div className=''>
        {/* Header */}
        <h2 className='text-xl font-semibold text-gray-900'>
          Leave {league.name}?
        </h2>

        {/* Main Content */}
        <div className='mt-6 space-y-4'>
          <p className='text-sm text-gray-600'>
            By leaving this league, you will:
          </p>

          {/* List of Consequences */}
          <ul className='space-y-3 pl-5 text-sm text-gray-600'>
            <li className='flex items-start'>
              <span className='mr-3 mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-gray-600' />
              Lose all assigned permissions and access rights within the league
            </li>
            <li className='flex items-start'>
              <span className='mr-3 mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-gray-600' />
              No longer be able to manage league activities or view restricted
              content
            </li>
            <li className='flex items-start'>
              <span className='mr-3 mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-gray-600' />
              Be removed from any administrative roles or special access groups
            </li>
            <li className='flex items-start'>
              <span className='mr-3 mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-gray-600' />
              Need a new invitation to rejoin and regain access
            </li>
          </ul>

          {/* Warning Note */}
          <div className='mt-6 rounded-lg bg-gray-50 p-4 text-sm text-gray-600'>
            <p className='font-medium'>Note:</p>
            <p className='mt-1'>
              This action cannot be undone. If you need access again in the
              future, you&apos;ll need to be re-invited by a league
              administrator.
            </p>
          </div>

          {/* Action Buttons */}
          <div className='mt-6 flex justify-end gap-3'>
            <Button variant='outline' onClick={close}>
              Cancel
            </Button>
            <Button
              onClick={async () => {
                await onRemoveClick();
                close();
              }}
            >
              Leave League
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
