'use client';

import { useState } from 'react';
import Image from 'next/image';

import { useLeagueControlPanel } from '@/app/control-panel/_components/LeagueControlPanelProvider';
import Modal from '@/app/lib/components/Modal';
import SearchBar from '@/app/lib/components/SearchBar';
import { ModalType } from '@/app/types';
import Checkbox from '@/app/lib/components/Checkbox';
import useDebounce from '@/app/lib/hooks/useDebounce';
import { ControlPanelManageTeam } from '@/app/lib/types/Responses/control-panel.types';
import MissingList from '@/app/control-panel/_components/MissingList';
import { EmptyListIcon, Spinner } from '@/app/lib/SVGs';
import { useTeamsForManagement } from '@/app/lib/hooks/api/control-panel/teams';

export default function AddTeamToSeasonModal({ isOpen, close }: ModalType) {
  const { leagueData } = useLeagueControlPanel();
  const [searchInputValue, setSearchInputValue] = useState('');

  const debouncedSearch = useDebounce(searchInputValue, 750);
  const [page, setPage] = useState(1);

  const { data, status } = useTeamsForManagement({
    slug: leagueData.league_info.slug,
    page,
    query: debouncedSearch,
  });

  const activeSeason = leagueData.seasons.all_seasons.find(
    (season) => season.id === leagueData.seasons.active_season_id
  );

  return (
    <Modal panelClasses='sm:w-[640px] w-full' isOpen={isOpen} close={close}>
      <div className='space-y-6'>
        <h4 className='text-2xl font-bold'>Manage Active Season Teams</h4>
        <div className='flex items-center justify-between space-x-2'>
          <span className='font-medium'>{activeSeason?.name}</span>
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
                  text='There are no created teams'
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

function TeamCard({ team }: { team: ControlPanelManageTeam }) {
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

      <Checkbox
        isChecked={team.is_in_active_season}
        onClick={() => console.log(team)}
        disabled={team.can_remove ? false : true}
      />
    </div>
  );
}
