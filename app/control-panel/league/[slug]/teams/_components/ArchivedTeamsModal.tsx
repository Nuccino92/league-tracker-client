'use client';

import { useState } from 'react';
import Image from 'next/image';

import { ModalType } from '@/app/types';
import Modal from '@/app/lib/components/Modal';
import { useLeagueControlPanel } from '@/app/control-panel/_components/LeagueControlPanelProvider';
import useDebounce from '@/app/lib/hooks/useDebounce';
import SearchBar from '@/app/lib/components/SearchBar';
import { ControlPanelArchivedTeam } from '@/app/lib/types/Responses/control-panel.types';
import { EmptyListIcon, IconBackupRestore, Spinner } from '@/app/lib/SVGs';
import MissingList from '@/app/control-panel/_components/MissingList';
import { useArchivedTeams } from '@/app/lib/hooks/api/control-panel/teams';

export default function AchivedTeamsModal({ isOpen, close }: ModalType) {
  const { leagueData, slug } = useLeagueControlPanel();
  const [searchInputValue, setSearchInputValue] = useState('');

  const debouncedSearch = useDebounce(searchInputValue, 750);
  const [page, setPage] = useState(1);

  const { data, status } = useArchivedTeams({
    slug: slug,
    page,
    query: debouncedSearch,
  });

  return (
    <Modal panelClasses='sm:w-[640px] w-full' isOpen={isOpen} close={close}>
      <div className='space-y-6'>
        <h4 className='text-2xl font-bold'>Restore Archived Teams</h4>
        <div className='flex items-center justify-between space-x-2'>
          <span className='max-w-[66%] break-words font-medium'>
            {leagueData.league_info.name}
          </span>
          <SearchBar
            containerClasses='border'
            inputValue={searchInputValue}
            setInputValue={setSearchInputValue}
            placeholder='Search for a team...'
            searchIconSize={22}
            closeIconSize={18}
          />
        </div>

        <main className='swatches-picker max-h-[500px] space-y-2 overflow-y-auto rounded border bg-slate-100 p-2 sm:h-[500px] sm:min-h-[500px]'>
          {data && status === 'success' ? (
            <>
              {data.length > 0 ? (
                data.map((team, index) => (
                  <div key={team.id + index}>
                    <TeamCard team={team} />
                  </div>
                ))
              ) : (
                <MissingList
                  text='No Archived Teams'
                  icon={
                    <EmptyListIcon className='w-full' height={55} width={55} />
                  }
                />
              )}
            </>
          ) : null}

          {status === 'loading' ? (
            <div className='flex h-full w-full items-center justify-center'>
              <Spinner width={50} height={50} />
            </div>
          ) : null}
        </main>
      </div>
    </Modal>
  );
}

function TeamCard({ team }: { team: ControlPanelArchivedTeam }) {
  return (
    <div className='flex w-full items-center justify-between rounded border bg-white p-3'>
      <div className='flex items-center space-x-2'>
        {team.logo ? (
          <div className='relative h-8 w-8 rounded border'>
            <Image
              src={team.logo}
              alt={`${team.name} logo`}
              fill
              style={{ objectFit: 'contain', position: 'absolute' }}
              sizes='(max-width: 50px) 100vw'
            />
          </div>
        ) : (
          <div className='flex h-8 w-8 items-center justify-center rounded border bg-primary text-xs font-medium text-white'>
            N/A
          </div>
        )}
        <span className='font-medium'>{team.name}</span>
      </div>

      <button
        type='button'
        onClick={() => {
          /**
           *  TODO: send mutation request to restore team
           *  invalidate QUERY_KEYS.TEAMS
           *  mutate the current archived team list
           */
          console.log('restoring:', team);
        }}
      >
        <IconBackupRestore
          height={24}
          width={24}
          className='transition-colors duration-100 ease-out hover:text-secondary'
        />
      </button>
    </div>
  );
}
