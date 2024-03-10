'use client';

import { getTeamLinks } from '@/app/lib/collections/breadcrumbLinks';
import Breadcrumb from '@/app/lib/components/Breadcrumb';
import PlayerStats from '@/app/lib/components/playerStats/PlayerStats';
import { SportType } from '@/app/lib/types/sport.types';
import Image from 'next/image';
// TABS profile/roster/schedule
// Add query in params to switch tabs

// profile - could have logo, name, team description, team leaders, maybe game a few game "articles"

// roster - just the same stats as the players page
// scedule -

import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';

const league = {
  name: 'NBA',
  type: 'basketball' as SportType,
}; // TODO: create a league provider to pass league information

const teamInfo = {
  id: '231432',
  name: 'Toronto Raptors',
  logo: 'https://images.firstwefeast.com/complex/image/upload/c_limit,fl_progressive,q_80,w_1030/omox9xypgbi5mzqgo8rf.png',
  record_formatted: '11 - 6 - 0',
  primary_color: '#E31837',
  place_in_standings_formatted: '1st place',
}; //TODO: get from backend on initial api call

export default function Team() {
  const router = useRouter();
  const tab = useSearchParams().get('tab');

  const isTabProfile = tab === 'profile' || !tab ? true : false;
  const isTabRoster = tab === 'roster' ? true : false;
  const isTabSchedule = tab === 'schedule' ? true : false;

  const handleButtonClick = (param: string) => {
    const query = `?tab=${param}`;
    router.push(query);
  };

  return (
    <div className='flex flex-col items-center justify-center'>
      <div className='flex w-full flex-col items-center'>
        <div
          style={{ borderColor: teamInfo.primary_color }}
          className='relative my-1 flex w-full justify-evenly border-y-[25px] py-6'
        >
          <div>
            <h1
              style={{ color: teamInfo.primary_color }}
              className='mb-4 text-2xl font-bold md:text-4xl'
            >
              {teamInfo.name}
            </h1>
            <div className='space-y-2'>
              <div className='text-sm font-bold'>
                {teamInfo.place_in_standings_formatted}
              </div>
              <div className=' text-lg'>{teamInfo.record_formatted}</div>
            </div>
          </div>

          <div></div>

          <div className='relative h-[150px] w-[250px]'>
            <Image
              fill
              style={{ objectFit: 'contain' }}
              src={teamInfo.logo}
              alt={`${teamInfo.name} Logo`}
            />
          </div>
        </div>
        {/* TODO: find a global min width */}
        <div className='md:min-w-[900px]'>
          <Breadcrumb
            links={getTeamLinks({
              name: league.name,
              team: teamInfo.name,
              id: teamInfo.id,
            })}
          />

          <ul
            style={{
              borderColor: `${teamInfo.primary_color}`,
              borderRightColor: 'red',
            }}
            //TODO: FIX DIVIDE COLOR
            className='mb-2 flex items-center border text-sm font-medium [&>li>button]:w-full [&>li>button]:py-2 [&>li]:w-full'
          >
            <li>
              <button
                style={
                  isTabProfile
                    ? {
                        backgroundColor: teamInfo.primary_color,
                        color: 'white',
                      }
                    : { backgroundColor: 'white' }
                }
                className=''
                onClick={() => handleButtonClick('profile')}
              >
                PROFILE
              </button>
            </li>
            <li>
              <button
                className='border-x'
                style={
                  isTabRoster
                    ? {
                        borderColor: teamInfo.primary_color,
                        backgroundColor: teamInfo.primary_color,
                        color: 'white',
                      }
                    : {
                        backgroundColor: 'white',
                        borderColor: teamInfo.primary_color,
                      }
                }
                onClick={() => handleButtonClick('roster')}
              >
                ROSTER
              </button>
            </li>
            <li>
              <button
                style={
                  isTabSchedule
                    ? {
                        backgroundColor: teamInfo.primary_color,
                        color: 'white',
                      }
                    : { backgroundColor: 'white' }
                }
                onClick={() => handleButtonClick('schedule')}
              >
                SCHEDULE
              </button>
            </li>
          </ul>

          <div>
            {!tab || tab === 'profile' ? <div>PROFILE</div> : null}
            {tab === 'roster' ? (
              <PlayerStats name={league.name} type={league.type} />
            ) : null}
            {tab === 'schedule' ? <div>SCHEDULE</div> : null}
          </div>
        </div>
      </div>
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
