'use client';

import { getPlayersLinks } from '@/app/lib/collections/breadcrumbLinks';
import Breadcrumb from '@/app/lib/components/Breadcrumb';
import BaseballPlayerStats from '@/app/lib/components/playerStats/BaseballPlayersStats';
import BasketballPlayerStats from '@/app/lib/components/playerStats/BasketballPlayerStats';
import HockeyPlayerStats from '@/app/lib/components/playerStats/HockeyPlayerStats';
import SoccerPlayerStats from '@/app/lib/components/playerStats/SoccerPlayerStats';

import { SportType } from '@/app/lib/types/sport.types';
import { SportPlayerTabs } from '@/app/lib/types/sportPlayerTabs.types';
import { getPlayerStatLabels } from '@/app/lib/utils/sportInformation';
import classNames from 'classnames';
import cryptoRandomString from 'crypto-random-string';
import { useState, Dispatch, SetStateAction } from 'react';

type Props = {
  name: string;
  type: SportType;
};

// implement pagination + filter

export default function PlayerStats({ name, type }: Props) {
  const [selectedTab, setSelectedTab] = useState<SportPlayerTabs>(
    getInitialFilter(type)
  ); //TODO: change into a filter saved in state

  //todo: This will be dynamic, need to get from backend
  const playerStatLabels = getPlayerStatLabels(type, selectedTab);

  return (
    <div className='w-[900px]'>
      {type === 'hockey' ? (
        <HockeyTabs selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
      ) : null}
      {type === 'baseball' ? (
        <BaseBallTabs
          selectedTab={selectedTab}
          setSelectedTab={setSelectedTab}
        />
      ) : null}
      {type === 'soccer' ? (
        <SoccerTabs selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
      ) : null}
      <div className='w-full bg-secondary p-3 font-medium text-white'>
        {name} SEASON STATS
      </div>
      <div className='w-full'>
        {/* STAT LABELS */}
        <div className='flex items-center bg-primary py-2 text-sm font-medium text-white'>
          {playerStatLabels?.map((label, index) => {
            return (
              <div
                onClick={() => {
                  if (index === 0) return;
                  if (index === 1) return;
                  if (index === 2) return;
                  else {
                    //TODO: implement fetching new list with label.value as a filter
                    console.log('FILTERING BY:', label.value);
                  }
                }}
                className={classNames(
                  playersData.meta.filter === label.value && '!text-secondary',
                  index === 0 && '!w-20 !cursor-default hover:!text-white',
                  index === 1 && '!w-[150px] !cursor-default hover:!text-white',
                  index === 2 && '!w-20 !cursor-default hover:!text-white',
                  'flex w-[45px] cursor-pointer items-center justify-center transition hover:text-secondary'
                )}
                key={cryptoRandomString({ length: 8 })}
              >
                {label.label}
              </div>
            );
          })}
        </div>
        {/* PLAYERS LIST */}
        <table className='w-full'>
          {/* TODO: replace "league" with updated list from API */}
          {type === 'basketball' ? (
            <BasketballPlayerStats data={playersData.data} leagueName={name} />
          ) : null}
          {type === 'baseball' ? (
            <BaseballPlayerStats data={playersData.data} />
          ) : null}
          {type === 'soccer' ? (
            <SoccerPlayerStats data={playersData.data} />
          ) : null}
          {type === 'hockey' ? (
            <HockeyPlayerStats data={playersData.data} />
          ) : null}
        </table>
      </div>
    </div>
  );
}

const getInitialFilter = (type: SportType) => {
  if (type === 'basketball') return undefined;
  if (type === 'hockey') return 'skater';
  if (type === 'baseball') return 'fielder';
  if (type === 'soccer') return 'fielder';
};

function SoccerTabs({
  selectedTab,
  setSelectedTab,
}: {
  selectedTab: SportPlayerTabs;
  setSelectedTab: Dispatch<SetStateAction<SportPlayerTabs>>;
}) {
  return (
    <div className='my-4 flex items-center space-x-4 border-b border-zinc-400 font-medium'>
      <button
        onClick={() => setSelectedTab('fielder')}
        className={classNames(
          selectedTab === 'fielder'
            ? 'border-secondary'
            : 'border-transparent text-zinc-400',
          '-mb-0.5 border-b-2'
        )}
      >
        OUTFIELD
      </button>
      <button
        onClick={() => setSelectedTab('goalie')}
        className={classNames(
          selectedTab === 'goalie'
            ? 'border-secondary'
            : 'border-transparent text-zinc-400',
          '-mb-0.5 border-b-2'
        )}
      >
        KEEPERS
      </button>
    </div>
  );
}

function HockeyTabs({
  selectedTab,
  setSelectedTab,
}: {
  selectedTab: SportPlayerTabs;
  setSelectedTab: Dispatch<SetStateAction<SportPlayerTabs>>;
}) {
  return (
    <div className='my-4 flex items-center space-x-4 border-b border-zinc-400 font-medium'>
      <button
        onClick={() => setSelectedTab('skater')}
        className={classNames(
          selectedTab === 'skater'
            ? 'border-secondary'
            : 'border-transparent text-zinc-400',
          '-mb-0.5 border-b-2'
        )}
      >
        SKATERS
      </button>
      <button
        onClick={() => setSelectedTab('goalie')}
        className={classNames(
          selectedTab === 'goalie'
            ? 'border-secondary'
            : 'border-transparent text-zinc-400',
          '-mb-0.5 border-b-2'
        )}
      >
        GOALIES
      </button>
    </div>
  );
}

function BaseBallTabs({
  selectedTab,
  setSelectedTab,
}: {
  selectedTab: SportPlayerTabs;
  setSelectedTab: Dispatch<SetStateAction<SportPlayerTabs>>;
}) {
  return (
    <div className='my-4 flex items-center space-x-4 border-b border-zinc-400 font-medium'>
      <button
        onClick={() => setSelectedTab('fielder')}
        className={classNames(
          selectedTab === 'fielder'
            ? 'border-secondary'
            : 'border-transparent text-zinc-400',
          '-mb-0.5 border-b-2'
        )}
      >
        FIELDERS
      </button>
      <button
        onClick={() => setSelectedTab('pitcher')}
        className={classNames(
          selectedTab === 'pitcher'
            ? 'border-secondary'
            : 'border-transparent text-zinc-400',
          '-mb-0.5 border-b-2'
        )}
      >
        PITCHERS
      </button>
    </div>
  );
}

//rank, games, ppg, rpg, apg, fg%, 3p%, ft%
const playersData = {
  meta: {
    filter: null,
  },
  data: [
    {
      id: '32442343221',
      name: 'Chris Paul',
      team: 'NOP',
      rank: 1,
      games: 8,
      ppg: 11.7,
      rpg: 5.3,
      apg: 7.3,
      fgpct: 44.9,
      threepct: 36.6,
      ftpct: 79.8,
      spg: 1.1,
      blkpg: 0.1,
    },
    {
      id: '32442343222',
      name: 'Chris Paul',
      team: 'NOP',
      rank: 2,
      games: 8,
      ppg: 11.7,
      rpg: 5.3,
      apg: 7.3,
      fgpct: 44.9,
      threepct: 36.6,
      ftpct: 79.8,
      spg: 1.1,
      blkpg: 0.1,
    },
    {
      id: '32442343223',
      name: 'Chris Paul',
      team: 'NOP',
      rank: 3,
      games: 8,
      ppg: 11.7,
      rpg: 5.3,
      apg: 7.3,
      fgpct: 44.9,
      threepct: 36.6,
      ftpct: 79.8,
      spg: 1.1,
      blkpg: 0.1,
    },
    {
      id: '32442343224',
      name: 'Chris Paul',
      team: 'NOP',
      rank: 4,
      games: 8,
      ppg: 11.7,
      rpg: 5.3,
      apg: 7.3,
      fgpct: 44.9,
      threepct: 36.6,
      ftpct: 79.8,
      spg: 1.1,
      blkpg: 0.1,
    },
    {
      id: '32442343225',
      name: 'Chris Paul',
      team: 'NOP',
      rank: 5,
      games: 8,
      ppg: 11.7,
      rpg: 5.3,
      apg: 7.3,
      fgpct: 44.9,
      threepct: 36.6,
      ftpct: 79.8,
      spg: 1.1,
      blkpg: 0.1,
    },
    {
      id: '32442343226',
      name: 'Chris Paul',
      team: 'NOP',
      rank: 6,
      games: 8,
      ppg: 11.7,
      rpg: 5.3,
      apg: 7.3,
      fgpct: 44.9,
      threepct: 36.6,
      ftpct: 79.8,
      spg: 1.1,
      blkpg: 0.1,
    },
    {
      id: '32442343227',
      name: 'Chris Paul',
      team: 'NOP',
      rank: 7,
      games: 8,
      ppg: 11.7,
      rpg: 5.3,
      apg: 7.3,
      fgpct: 44.9,
      threepct: 36.6,
      ftpct: 79.8,
      spg: 1.1,
      blkpg: 0.1,
    },
    {
      id: '32442343228',
      name: 'Chris Paul',
      team: 'NOP',
      rank: 8,
      games: 8,
      ppg: 11.7,
      rpg: 5.3,
      apg: 7.3,
      fgpct: 44.9,
      threepct: 36.6,
      ftpct: 79.8,
      spg: 1.1,
      blkpg: 0.1,
    },
    {
      id: '32442343229',
      name: 'Chris Paul',
      team: 'NOP',
      rank: 9,
      games: 8,
      ppg: 11.7,
      rpg: 5.3,
      apg: 7.3,
      fgpct: 44.9,
      threepct: 36.6,
      ftpct: 79.8,
      spg: 1.1,
      blkpg: 0.1,
    },
    {
      id: '324423432233',
      name: 'Chris Paul',
      team: 'NOP',
      rank: 10,
      games: 8,
      ppg: 11.7,
      rpg: 5.3,
      apg: 7.3,
      fgpct: 44.9,
      threepct: 36.6,
      ftpct: 79.8,
      spg: 1.1,
      blkpg: 0.1,
    },
  ],
};
