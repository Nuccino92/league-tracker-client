'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import classNames from 'classnames';

import StyledBox from '@/app/lib/components/StyledBox';
import { BaseTeam } from '@/app/lib/types/Models/Team';
import useQueryString from '@/app/lib/hooks/useQueryString';
import FormLabel from '@/app/control-panel/_components/FormLabel';
import { Button } from '@/app/lib/components/Button';
import { useState } from 'react';
import AddTeamToSeasonModal from '@/app/control-panel/league/[slug]/teams/_components/AddTeamToSeasonModal';
import { IconAppstoreAdd } from '@/app/lib/SVGs';

type Props = {
  teams: BaseTeam[];
  focusedTeamId: number | null;
};

export default function TeamList({ teams, focusedTeamId }: Props) {
  const pathname = usePathname();
  const { createQueryString } = useQueryString();

  const [showAddToSeasonModal, setShowAddToSeasonModal] = useState(false);

  return (
    <>
      <StyledBox classes='flex h-max w-full flex-col space-y-6 p-6'>
        <div className='items flex justify-between'>
          <FormLabel label='Teams' htmlFor='' />{' '}
          <Button
            onClick={() => setShowAddToSeasonModal(true)}
            className='space-x-2'
          >
            <IconAppstoreAdd height={20} width={20} />
            <span>Manage Teams</span>
          </Button>
        </div>
        <div className='flex flex-wrap gap-2 rounded bg-slate-100 p-4'>
          {teams.length > 0 ? (
            <>
              {teams.map((team) => (
                <Link
                  href={
                    pathname +
                    '?' +
                    createQueryString('team', team.id.toString())
                  }
                  key={team.id}
                  role='button'
                >
                  <TeamCard team={team} focsedTeamId={focusedTeamId} />
                </Link>
              ))}
            </>
          ) : (
            <div className='text-sm italic'>
              There are no teams added to this season. Click the{' '}
              <span className='font-medium'>Manage Teams</span> button to add
              teams to this season
            </div>
          )}
        </div>
      </StyledBox>
      {showAddToSeasonModal ? (
        <AddTeamToSeasonModal
          isOpen={showAddToSeasonModal}
          close={() => {
            //TODO: invalidate the teams-control-panel params
            setShowAddToSeasonModal(false);
          }}
        />
      ) : null}
    </>
  );
}

function TeamCard({
  team,
  focsedTeamId,
}: {
  team: BaseTeam;
  focsedTeamId: number | null;
}) {
  return (
    <StyledBox
      classes={classNames(
        focsedTeamId === team.id ? 'text-secondary !border-secondary' : '',
        'max-w-max hover:border-secondary transform-colors duration-75 hover:text-secondary font-medium flex max-w-max items-center space-x-2 px-2 py-1 text-sm !rounded'
      )}
    >
      <div className='relative h-9 min-h-[36px] w-9 min-w-[36px] overflow-hidden rounded'>
        {team.logo ? (
          <Image
            src={team.logo ?? ''}
            alt={`${team.name} Logo`}
            style={{ objectFit: 'contain' }}
            fill
            sizes='(max-width: 50px) 100vw,'
          />
        ) : (
          <span className='block h-full w-full bg-primary'></span>
        )}
      </div>

      <span>{team.name}</span>
    </StyledBox>
  );
}
