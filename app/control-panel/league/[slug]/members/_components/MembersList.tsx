'use client';

import MissingList from '@/app/control-panel/_components/MissingList';
import DropdownMenu from '@/app/lib/components/DropdownMenu';
import StyledBox from '@/app/lib/components/StyledBox';
import { MemberRolesEnum } from '@/app/lib/enums';
import { MENU_ITEM_CLASSES } from '@/app/lib/globals/styles';
import { useMembers } from '@/app/lib/hooks/api/control-panel/members';
import {
  IconAdminLine,
  EmptyListIcon,
  IconEllipsisVertical,
  Spinner,
  DeleteIcon,
} from '@/app/lib/SVGs';
import { Member } from '@/app/lib/types/Models/Member';
import getEnumKeyByEnumValue from '@/app/lib/utils/getEnumKeyByEnumValue';
import { useState } from 'react';
import MemberForm from './MemberForm';

type Props = {
  slug: string;
};

//MON TOOD: create a way to read the role/render things based off of role! (atm, members, teams, players, seasons)

/**
 *
 * @param param0
 * @returns
 *
 * TODO:
 * - UI for each of the members cards, have a settings button on the right
 *
 * - Add member modal
 */

export default function MembersList({ slug }: Props) {
  const { data, status } = useMembers({
    slug,
    includeOnly: ['search', 'role'],
  });

  return (
    <div className='h-full'>
      {data && status === 'success' ? (
        <div className='h-full space-y-2'>
          {data.length > 0 ? (
            data.map((member) => <MemberCard key={member.id} member={member} />)
          ) : (
            <MissingList
              text='No League Members'
              icon={<EmptyListIcon className='w-full' height={55} width={55} />}
            />
          )}
        </div>
      ) : null}
      {status === 'loading' ? (
        <div className='flex h-full w-full items-center justify-center'>
          <Spinner width={50} height={50} />
        </div>
      ) : null}
    </div>
  );
}

function MemberCard({ member }: { member: Member }) {
  const [showEditMemberModal, setShowEditMemberModal] = useState(false);
  const [showRemoveMemberModal, setShowRemoveMemberModal] = useState(false);

  const dropdownOptions = [
    {
      label: 'Adjust Access',
      action: () => setShowEditMemberModal(true),
      icon: <IconAdminLine width={20} height={20} />,
    },
    {
      label: 'Remove Member',
      action: () => setShowRemoveMemberModal(true),
      icon: <DeleteIcon width={20} height={20} />,
    },
  ];

  return (
    <>
      <StyledBox
        key={member.id}
        classes='p-4 flex items-center justify-between'
      >
        <div className='flex flex-col'>
          <span className='font-medium'>{member.name}</span>
          <span className='text-sm italic text-zinc-600'>
            {getEnumKeyByEnumValue(MemberRolesEnum, member.role)}
          </span>
        </div>

        <DropdownMenu
          items={dropdownOptions}
          buttonIcon={(open) => (
            <IconEllipsisVertical color={open ? 'white' : 'currentColor'} />
          )}
          itemContainerClasses='!left-[-11rem]'
          itemClasses={`${MENU_ITEM_CLASSES}`}
        />
      </StyledBox>

      {showEditMemberModal ? (
        <MemberForm
          isOpen={showEditMemberModal}
          close={() => setShowEditMemberModal(false)}
          memberId={member.id}
        />
      ) : null}
    </>
  );
}
