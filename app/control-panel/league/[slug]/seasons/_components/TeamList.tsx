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
  Spinner,
} from '@/app/lib/SVGs';
import getInitials from '@/app/lib/utils/getInitials';
import DropdownMenu from '@/app/lib/components/DropdownMenu';
import { MENU_ITEM_CLASSES } from '@/app/lib/globals/styles';
import TeamForm from '@/app/control-panel/league/[slug]/teams/_components/TeamForm';
import classNames from 'classnames';

type Props = {
  slug: string;
  teams: BaseTeam[] | undefined;
  status: 'loading' | 'error' | 'success';
  onLinkClick: () => void;
};

export default function TeamList({ slug, teams, status, onLinkClick }: Props) {
  return (
    <div className='flex h-max w-full flex-col'>
      <div className='w-full border-b py-4 pl-20 font-medium'>
        Team Name players created at
      </div>
      {teams &&
        status === 'success' &&
        (teams.length > 0 ? (
          <div className='divide-y'>
            {teams.map((team) => (
              <TeamCard key={team.id} team={team} onLinkClick={onLinkClick} />
            ))}
          </div>
        ) : (
          <div className='px-8 py-10 text-sm italic'>
            There are no teams added to this season. Click the{' '}
            <span className='font-medium'>Manage Teams</span> button to add
            teams to this season
          </div>
        ))}
      {status === 'loading' && (
        <div className='flex items-center justify-center p-8 py-[300px]'>
          <Spinner height={30} width={30} />
        </div>
      )}
    </div>
  );
}

function TeamCard({
  team,
  onLinkClick,
}: {
  team: BaseTeam;
  onLinkClick: () => void;
}) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const { createQueryString } = useQueryString();

  const [showTeamEditModal, setShowTeamEditModal] = useState(false);

  const seasonParam = searchParams.get('season');
  const teamParam = searchParams.get('team');

  const dropdownOption = [
    {
      label: 'View Roster',
      action: () => {
        router.push(pathname + '?' + `season=${seasonParam}&team=${team.id}`);
        if (teamParam === team.id.toString()) {
          onLinkClick();
        }
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
      <div className='flex items-center justify-between px-8 py-4'>
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
              if (teamParam === team.id.toString()) {
                onLinkClick();
              }
            }}
            href={
              pathname + '?' + createQueryString('team', team.id.toString())
            }
            key={team.id}
            className={classNames(
              teamParam === team.id.toString() && 'font-medium text-secondary',
              'hover:text-secondary'
            )}
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
