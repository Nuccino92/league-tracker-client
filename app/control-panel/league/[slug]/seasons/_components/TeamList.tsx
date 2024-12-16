'use client';

import { useState } from 'react';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { BaseTeam } from '@/app/lib/types/Models/Team';
import useQueryString from '@/app/lib/hooks/useQueryString';
import {
  EditIcon,
  IconEllipsisVertical,
  IconTeamLine,
  IconUserDelete,
} from '@/app/lib/SVGs';
import getInitials from '@/app/lib/utils/getInitials';
import DropdownMenu from '@/app/lib/components/DropdownMenu';
import { MENU_ITEM_CLASSES } from '@/app/lib/globals/styles';
import TeamForm from '@/app/control-panel/league/[slug]/teams/_components/TeamForm';

type Props = {
  teams: BaseTeam[];
  focusedTeamId: number | null;
  onTeamSelectionClick: () => void;
};

export default function TeamList({
  teams,
  focusedTeamId,
  onTeamSelectionClick,
}: Props) {
  return (
    <div className='flex h-max w-full flex-col space-y-6 p-6'>
      <div className='flex flex-col gap-2 rounded p-4'>
        {teams.length > 0 ? (
          <div className='divide-y'>
            {teams.map((team) => (
              <TeamCard
                key={team.id}
                team={team}
                focsedTeamId={focusedTeamId}
                onTeamSelectionClick={onTeamSelectionClick}
              />
            ))}
          </div>
        ) : (
          <div className='text-sm italic'>
            There are no teams added to this season. Click the{' '}
            <span className='font-medium'>Manage Teams</span> button to add
            teams to this season
          </div>
        )}
      </div>
    </div>
  );
}

function TeamCard({
  team,
  focsedTeamId,
  onTeamSelectionClick,
}: {
  team: BaseTeam;
  focsedTeamId: number | null;
  onTeamSelectionClick: () => void;
}) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const { createQueryString } = useQueryString();

  const [showTeamEditModal, setShowTeamEditModal] = useState(false);

  const dropdownOption = [
    {
      label: 'View Roster',
      action: () => {
        router.push(
          pathname + '?' + createQueryString('team', team.id.toString())
        );
        if (Number(searchParams.get('team')) === team.id)
          onTeamSelectionClick();
      },
      icon: <IconTeamLine width={20} height={20} />,
    },
    {
      label: 'Edit',
      action: () => setShowTeamEditModal(true),
      icon: <EditIcon width={20} height={20} />,
    },
  ];

  return (
    <>
      <div className='flex items-center justify-between py-4'>
        <div className='flex items-center gap-2'>
          {team.logo ? (
            <Image
              src={team.logo}
              alt='Player avatar'
              height={40}
              width={40}
              className='h-10 w-10 rounded-md border'
              style={{ objectFit: 'cover' }}
            />
          ) : (
            <div className='flex h-10 w-10 items-center justify-center rounded-md border bg-primary font-medium text-white'>
              {getInitials(team.name)}
            </div>
          )}

          <Link
            onClick={() => {
              if (Number(searchParams.get('team')) === team.id)
                onTeamSelectionClick();
            }}
            href={
              pathname + '?' + createQueryString('team', team.id.toString())
            }
            key={team.id}
            className='hover:text-secondary'
          >
            {team.name}
          </Link>
        </div>
        <DropdownMenu
          items={dropdownOption}
          buttonIcon={(open) => (
            <IconEllipsisVertical color={open ? 'white' : 'currentColor'} />
          )}
          itemContainerClasses='!left-[-11rem]'
          itemClasses={`${MENU_ITEM_CLASSES}`}
        />
      </div>

      {showTeamEditModal ? (
        <TeamForm
          isOpen={showTeamEditModal}
          close={() => setShowTeamEditModal(false)}
          teamId={team.id}
        />
      ) : null}
    </>
  );
}
