import GameScheduleDisplay from '@/app/league/_components/GameScheduleDisplay';
import classNames from 'classnames';
import WeekDisplay from '../../_components/WeekDisplay';
import Dropdown from '@/app/league/_components/Dropdown';

export default function GamesPage({ params }: { params: { name: string } }) {
  return (
    <div className='flex flex-col items-center justify-center space-y-10 py-14'>
      <div className='flex h-[55px] w-full items-center justify-between space-x-6 xl:w-[900px]'>
        <WeekDisplay />

        <Dropdown
          options={teamDropdownData}
          placeholder='Search Team'
          selectAllOption={{ value: null, name: 'All teams' }}
        />
        <Dropdown options={timeZoneData} defaultOption={timeZoneData[0]} />
      </div>

      <div className='space-y-12 xl:w-[900px]'>
        {weeklyGameScheduleData.map((week, index) => {
          return (
            <div key={index}>
              <h4 className='mb-4 text-2xl font-bold'>{week.day_formatted}</h4>
              <div className='w-full space-y-2'>
                <div className='flex justify-between border-b pb-1 font-bold'>
                  <div className='w-[260px]'>Game</div>
                  <div className='w-[130px] pl-4'>Result</div>

                  <div className='w-[100px]'>Time</div>
                  <div className='w-[180px]'>Links</div>
                </div>

                <div className='!m-0 divide-y border-b'>
                  {week.games.map((game, gameIndex) => (
                    <div
                      key={game.game_id}
                      className={classNames(
                        gameIndex % 2 == 0 ? 'bg-gray-50' : '',
                        'w-full px-1 py-2'
                      )}
                    >
                      {/* TODO: implement time zone dropdown */}
                      <GameScheduleDisplay
                        game={game}
                        leagueName={params.name}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}{' '}
      </div>
    </div>
  );
}

// Maybe return the season/divison
// TODO: add time
const weeklyGameScheduleData = [
  {
    day_formatted: 'Friday, March 13',
    games: [
      {
        game_id: '83',
        time: '8:30 EST',
        has_played: true,
        home_team: {
          id: 'teamID13',
          abbreviation: 'MIA',
          name: 'Miami Heat sadads  dasads adads',
          logo: 'https://images.firstwefeast.com/complex/image/upload/c_limit,fl_progressive,q_80,w_1030/omox9xypgbi5mzqgo8rf.png',
          score: 115,
        },
        away_team: {
          id: 'teamID2',
          name: 'Charleotte Trash',
          abbreviation: 'CHA',
          logo: null,
          score: 99,
        },
      },
    ],
  },
  {
    day_formatted: 'Friday, March 15',
    games: [
      {
        game_id: '23',
        time: '7:30 EST',
        has_played: true,
        home_team: {
          id: 'teamID2',
          name: 'Chicago Bulls',
          abbreviation: 'CHI',
          logo: null,
          score: 105,
        },
        away_team: {
          id: 'teamID111',
          name: 'Toronto Raptors',
          abbreviation: 'TOR',
          logo: 'https://images.firstwefeast.com/complex/image/upload/c_limit,fl_progressive,q_80,w_1030/omox9xypgbi5mzqgo8rf.png',
          score: 118,
        },
      },
      {
        game_id: '22',
        time: '10:30 EST',
        has_played: true,
        home_team: {
          id: 'teamID15345',
          name: 'Toronto Raptors',
          abbreviation: 'TOR',
          logo: 'https://images.firstwefeast.com/complex/image/upload/c_limit,fl_progressive,q_80,w_1030/omox9xypgbi5mzqgo8rf.png',
          score: 89,
        },
        away_team: {
          id: 'teamIDsfdf2',
          name: 'Chicago Bulls',
          abbreviation: 'CHA',
          logo: 'https://images.firstwefeast.com/complex/image/upload/c_limit,fl_progressive,q_80,w_1030/omox9xypgbi5mzqgo8rf.png',
          score: 96,
        },
      },
    ],
  },

  {
    day_formatted: 'Friday, March 17',
    games: [
      {
        game_id: '123',
        time: '7:30 EST',
        has_played: false,
        home_team: {
          id: 'teamID15345',
          name: 'Toronto Raptors',
          abbreviation: 'TOR',
          logo: 'https://images.firstwefeast.com/complex/image/upload/c_limit,fl_progressive,q_80,w_1030/omox9xypgbi5mzqgo8rf.png',
          score: null,
        },
        away_team: {
          id: 'teamIDsfdf2',
          name: 'Chicago Bulls',
          abbreviation: 'CHA',
          logo: 'https://images.firstwefeast.com/complex/image/upload/c_limit,fl_progressive,q_80,w_1030/omox9xypgbi5mzqgo8rf.png',
          score: null,
        },
      },
    ],
  },
];

const teamDropdownData = [
  {
    id: 'dsaadssd',
    name: 'Toronto Raptors',
  },
  {
    id: 'dsaadssdz',
    name: 'Chicago Bulls',
  },
  {
    id: 'dsaadssd432',
    name: 'Houston Rockets',
  },
  {
    id: 'asdadsdas',
    name: 'Charleotte Trash',
  },
  {
    id: 'ijkhf',
    name: 'Denver Nuggets',
  },
  {
    id: 'dsaads42f23sd',
    name: 'Los Angeles Lakers Lakers Lakers',
  },
];

const timeZoneData = [
  {
    id: 'est',
    name: 'Eastern Time', // Eastern Standard Time
  },
  {
    id: 'cst',
    name: 'Central Time', // Central Standard Time
  },
  {
    id: 'adt',
    name: 'Atlantic Time', // Atlantic Standard Time
  },
  {
    id: 'mst',
    name: 'Mountain Time', // Mountain Standard Time
  },
  {
    id: 'pst',
    name: 'Pacific Time', // Pacific Standard Time
  },
  {
    id: 'gmt',
    name: 'Greenwich Time', // Greenwich Mean Time
  },
  {
    id: 'cest',
    name: 'Central European Time', // Central European Summer Time
  },

  // Add more time zones as needed
];
