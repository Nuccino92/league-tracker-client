'use client';

import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';

import MissingList from '@/app/control-panel/_components/MissingList';
import StyledBox from '@/app/lib/components/StyledBox';
import { useMembers } from '@/app/lib/hooks/api/control-panel/members';
import {
  EmptyListIcon,
  DeleteIcon,
  IconSettingsOutline,
  Spinner,
} from '@/app/lib/SVGs';
import {
  Member,
  MemberRole as MemberRoleType,
} from '@/app/lib/types/Models/Member';
import MemberForm from '@/app/control-panel/league/[slug]/members/_components/MemberForm';
import getInitials from '@/app/lib/utils/getInitials';
import StatusTag from '@/app/control-panel/league/[slug]/members/_components/StatusTag';
import { useLeagueControlPanel } from '@/app/control-panel/_components/LeagueControlPanelProvider';
import { useAuth } from '@/app/GlobalContext';
import Pagination from '@/app/lib/components/Pagination';
import useQueryString from '@/app/lib/hooks/useQueryString';
import RemoveMemberModal from '@/app/control-panel/league/[slug]/members/_components/RemoveMemberModal';

type Props = {};

//MON TOOD: create a way to read the role/render things based off of role! (atm, members, teams, players, seasons)

/**
 *
 * @param param0
 * @returns
 *
 * TODO:
 *
 * - Add member modal
 *
 * - need to add a accept/decline pending status when sending ut the members invite, need to validate if the email exists as well when creating a member
 */

export default function MembersList({}: Props) {
  const router = useRouter();
  const pathname = usePathname();

  const { createQueryString } = useQueryString();

  const { response, status } = useMembers({
    includeOnly: ['search', 'role', 'page'],
  });

  return (
    <StyledBox classes='h-full'>
      <div className='grid grid-cols-4 px-6 py-4 text-sm font-medium'>
        <div>Name</div>
        <div>Status</div>
        <div>User Role</div>
        <div>Actions</div>
      </div>

      {response && status === 'success' ? (
        <div className='h-full'>
          {response.data.length > 0 ? (
            response.data.map((member) => (
              <MemberCard key={member.id} member={member} />
            ))
          ) : (
            <MissingList
              text='No League Members'
              icon={<EmptyListIcon className='w-full' height={55} width={55} />}
            />
          )}

          {response.meta && (
            <div className='!mt-4 flex w-full items-center justify-end px-10 pb-4'>
              <Pagination
                currentPage={response.meta.current_page}
                totalPages={response.meta.last_page}
                onPageChange={(type, page) => {
                  if (type === 'next') {
                    router.push(
                      pathname +
                        '?' +
                        createQueryString('page', (page + 1).toString())
                    );
                  } else if (type === 'prev') {
                    router.push(
                      pathname +
                        '?' +
                        createQueryString('page', (page - 1).toString())
                    );
                  } else if (page) {
                    router.push(
                      pathname +
                        '?' +
                        createQueryString('page', page.toString())
                    );
                  }
                }}
              />
            </div>
          )}
        </div>
      ) : null}

      {/* TODO: add loading state */}
      {status === 'loading' && (
        <div className='flex h-full min-h-[500px] items-center justify-center border-t'>
          <Spinner height={48} width={48} />
        </div>
      )}
    </StyledBox>
  );
}

function MemberCard({ member }: { member: Member }) {
  const [showEditMemberModal, setShowEditMemberModal] = useState(false);
  const [showRemoveMemberModal, setShowRemoveMemberModal] = useState(false);

  const { user } = useAuth();

  const { isAdministrator, leagueData } = useLeagueControlPanel();

  //https://dribbble.com/shots/16427340-User-Management-Admin-Portal-Access-and-Permissions-Screen
  // image, name, email, status, role, actions

  return (
    <>
      <div className='grid grid-cols-4 items-center border-t p-4'>
        {/* Name & Email Column */}
        <div className='flex items-center gap-3'>
          {member.avatar ? (
            <Image
              src={member.avatar}
              alt=''
              height={45}
              width={45}
              className='min-h-[45px] min-w-[45px] rounded-full border object-cover'
            />
          ) : (
            <div className='flex h-[45px] w-[45px] items-center justify-center rounded-full bg-primary font-medium text-white'>
              {getInitials(member.name)}
            </div>
          )}

          <div className='flex flex-col'>
            <span className='font-medium'>{member.name}</span>
            <span className='text-sm text-zinc-500'>{member.email}</span>
          </div>
        </div>

        {/* Status Column */}
        <div>
          <StatusTag status={member.status} />
        </div>

        {/* Role Column */}
        <div>
          <MemberRole role={member.role} />
        </div>

        {/* Actions Column */}
        {member.role !== 'owner' &&
        isAdministrator() &&
        member.user_id !== user?.id &&
        (member.role === 'super-admin'
          ? leagueData.role.role_name === 'owner'
          : true) ? (
          <div className='flex gap-4 text-sm'>
            <button
              onClick={() => setShowEditMemberModal(true)}
              className='flex items-center gap-1.5 text-zinc-500 hover:text-zinc-700'
            >
              <IconSettingsOutline width={20} height={20} />
              <span>Modify</span>
            </button>
            <button
              onClick={() => setShowRemoveMemberModal(true)}
              className='flex items-center gap-1.5 text-zinc-500 hover:text-zinc-700'
            >
              <DeleteIcon width={20} height={20} />
              <span>Remove</span>
            </button>
          </div>
        ) : null}
      </div>

      {showEditMemberModal && (
        <MemberForm
          isOpen={showEditMemberModal}
          close={() => setShowEditMemberModal(false)}
          memberId={member.id}
        />
      )}

      {showRemoveMemberModal && (
        <RemoveMemberModal
          isOpen={showRemoveMemberModal}
          close={() => setShowRemoveMemberModal(false)}
          member={member}
        />
      )}
    </>
  );
}

function MemberRole({ role }: { role: MemberRoleType }) {
  const roleLabels = {
    owner: 'Owner',
    'super-admin': 'Super Admin',
    admin: 'Admin',
    'team-manager': 'Team Manager',
    scorekeeper: 'Scorekeeper',
  };

  return <div className='text-sm'>{roleLabels[role]}</div>;
}
