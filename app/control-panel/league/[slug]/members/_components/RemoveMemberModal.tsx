'use client';

import classNames from 'classnames';

import Modal from '@/app/lib/components/Modal';
import { ModalType } from '@/app/types';
import { Button } from '@/app/lib/components/Button';
import { useRemoveMember } from '@/app/lib/hooks/api/control-panel/members';
import { Spinner } from '@/app/lib/SVGs';
import { Member } from '@/app/lib/types/Models/Member';

type Props = {
  member: Member;
};

export default function RemoveMemberModal({
  isOpen,
  close,
  panelClasses,
  member,
}: Props & ModalType) {
  const removeMemberMut = useRemoveMember();

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
          Remove {member.name} ?
        </h2>

        {/* Main Content */}
        <div className='mt-6 space-y-4'>
          <p className='text-sm text-gray-600'>
            By removing this member, you will:
          </p>

          {/* List of Consequences */}
          <ul className='space-y-3 pl-5 text-sm text-gray-600'>
            <li className='flex items-start'>
              <span className='mr-3 mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-gray-600' />
              Remove all assigned permissions and access rights within the
              league
            </li>
            <li className='flex items-start'>
              <span className='mr-3 mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-gray-600' />
              Remove ability to manage league activities or view restricted
              content
            </li>
            <li className='flex items-start'>
              <span className='mr-3 mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-gray-600' />
              Removed from any administrative roles or special access groups
            </li>
            <li className='flex items-start'>
              <span className='mr-3 mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-gray-600' />
              Need a new invitation to allow member to regain access
            </li>
          </ul>

          {/* Warning Note */}
          <div className='mt-6 rounded-lg bg-gray-50 p-4 text-sm text-gray-600'>
            <p className='font-medium'>Note:</p>
            <p className='mt-1'>
              This action cannot be undone. To allow member to regain access
              again, you will need to create a new member with a linked email.
            </p>
          </div>

          {/* Action Buttons */}
          <div className='mt-6 flex justify-end gap-3'>
            <Button variant='outline' onClick={close}>
              Cancel
            </Button>
            <Button
              disabled={removeMemberMut.isLoading}
              onClick={async () => {
                await removeMemberMut.mutateAsync(member.id);

                close();
              }}
            >
              {removeMemberMut.isLoading ? (
                <Spinner height={16} width={16} />
              ) : (
                'Remove Member'
              )}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
