'use client';

import { useState } from 'react';
// FORMAT: https://www.nfl.com/
// League schedule bar
// AppNav
// random game template: <randomly pick a random team and display their most recent game> (graphic of scores and teams) -> below headline (team 1 beats team 2 88 - 78) -> below, stats leaders in specifiv stats

import HomeGraphic from '../_components/HomeGraphic';
import LeagueLeaders from '../_components/LeagueLeaders';
import PowerRanking from '../_components/PowerRanking';
import classNames from 'classnames';

// subscribe for updates
// the right -> power rankings
// top headlines
// -- show some scores from the highest power ranking teams (link to game page)
// -- Season highs

export default function League() {
  const [selectedTab, setSelectedTab] = useState<
    'power-rankings' | 'league-leaders'
  >('power-rankings');
  return (
    <div>
      <div className='flex items-start justify-center space-x-2 py-6'>
        <HomeGraphic />
        <div className='flex h-full w-[300px] flex-col justify-between rounded border border-violet-100 bg-white shadow-md'>
          <ul className='flex items-center justify-between space-x-5 border-b'>
            <li
              className={classNames(
                selectedTab === 'power-rankings'
                  ? 'border-primary'
                  : 'border-transparent',
                'border-b-2 text-sm'
              )}
            >
              <button
                className='p-4'
                onClick={() => setSelectedTab('power-rankings')}
              >
                Power Rankings
              </button>
            </li>
            <li
              className={classNames(
                selectedTab === 'league-leaders'
                  ? 'border-primary'
                  : 'border-transparent',
                'border-b-2 text-sm'
              )}
            >
              <button
                className='p-4'
                onClick={() => setSelectedTab('league-leaders')}
              >
                League Leaders
              </button>
            </li>
          </ul>

          <div className='p-4'>
            {selectedTab === 'power-rankings' ? (
              <PowerRanking powerRankingData={powerRankingData} />
            ) : null}
            {selectedTab === 'league-leaders' ? (
              <LeagueLeaders stats={leagueLeaderData} />
            ) : null}
          </div>
        </div>

        {/* todo: put games here */}
      </div>
    </div>
  );
}

const powerRankingData = {
  1: {
    name: 'Toronto',
    wins: 8,
    losses: 1,
    streak: 5,
  },
  2: {
    name: 'Atlanta',
    wins: 8,
    losses: 1,
    streak: 4,
  },
  3: {
    name: 'Boston',
    wins: 7,
    losses: 2,
    streak: 5,
  },
  4: {
    name: 'New York',
    wins: 7,
    losses: 3,
    streak: 0,
  },
  5: {
    name: 'Denver',
    wins: 6,
    losses: 3,
    streak: 2,
  },
  6: {
    name: 'San Antonio',
    wins: 6,
    losses: 4,
    streak: 1,
  },
  7: {
    name: 'Chicago',
    wins: 5,
    losses: 5,
    streak: -2,
  },
  8: {
    name: 'New York',
    wins: 4,
    losses: 6,
    streak: -3,
  },
  9: {
    name: 'Los Angeles',
    wins: 2,
    losses: 9,
    streak: -5,
  },
};

const leagueLeaderData = {
  sport: 'basketball',
  leaders: [
    {
      playerID: 'SDASD24234D',
      type: 'points',
      total: 22.9,
      name: 'Kevin Durant',
    },
    {
      playerID: '456DAS222224234D',
      type: 'points',
      total: 21.4,
      name: 'Lebron James',
    },
    {
      playerID: 'SD5554322',
      type: 'assists',
      total: 11.2,
      name: 'Steve Nash',
    },
    {
      playerID: '652fddshg434',
      type: 'assists',
      total: 9.7,
      name: 'Chris Paul',
    },
    {
      playerID: '534754gg33g',
      type: 'rebounds',
      total: 13.6,
      name: 'Nikola Jokic',
    },
    {
      playerID: '456DA54434D',
      type: 'rebounds',
      total: 12.9,
      name: 'Joel Embiid',
    },
  ],
};
