import Image from 'next/image';

import { getTeamsLinks } from '@/app/lib/collections/breadcrumbLinks';
import Breadcrumb from '@/app/lib/components/Breadcrumb';
import { SportType } from '@/app/lib/types/sport.types';
import getInitials from '@/app/lib/utils/getInitials';
import Link from 'next/link';
import ROUTES from '@/app/lib/globals/routes';

const league = {
  name: 'NBA',
  type: 'basketball' as SportType,
}; // TODO: create a league provider to pass league information

const leagueID = 'aleagueid'; // get this from provider

export default function Teams() {
  return (
    <div className='flex flex-col items-center justify-center py-10'>
      <div>
        <Breadcrumb links={getTeamsLinks({ name: league.name })} />
        <div className='grid grid-cols-2 gap-8'>
          {teamsList.map((team) => {
            return (
              <div
                key={team.id}
                className='flex w-[350px] max-w-[350px] space-x-4 overflow-hidden border-b border-t py-4'
              >
                <div className='relative h-[100px] min-h-[100px] w-[100px] min-w-[100px] overflow-hidden rounded-md border'>
                  {team.logo ? (
                    <Image
                      src={team.logo}
                      alt={`${team.name} Logo`}
                      style={{ objectFit: 'contain' }}
                      fill
                    />
                  ) : (
                    <div className='flex h-full w-full items-center justify-center bg-primary text-lg font-medium text-white'>
                      {getInitials(team.name)}
                    </div>
                  )}
                </div>
                <div className='flex w-[230px] flex-col justify-center space-y-1'>
                  <Link
                    href={`${ROUTES.LEAGUE}/${leagueID}${ROUTES.TEAMS}/${team.id}`}
                    className='truncate text-xl font-bold transition-all hover:text-secondary'
                  >
                    {team.name}
                  </Link>

                  <div className='flex w-full space-x-4'>
                    <Link className='text-sm hover:text-secondary' href={'#'}>
                      Roster
                    </Link>
                    <Link className='text-sm hover:text-secondary' href={'#'}>
                      Schedule
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

const teamsList = [
  {
    id: '1',
    name: 'Toronto Raptorsas dasdadsadsdasdasads',
    logo: 'https://images.firstwefeast.com/complex/image/upload/c_limit,fl_progressive,q_80,w_1030/omox9xypgbi5mzqgo8rf.png',
  },
  {
    id: '2',
    name: 'Toronto Raptors',
    logo: 'https://images.firstwefeast.com/complex/image/upload/c_limit,fl_progressive,q_80,w_1030/omox9xypgbi5mzqgo8rf.png',
  },
  {
    id: '3',
    name: 'Toronto Raptors',
    logo: null,
  },
  {
    id: '4',
    name: 'Toronto Raptors',
    logo: 'https://images.firstwefeast.com/complex/image/upload/c_limit,fl_progressive,q_80,w_1030/omox9xypgbi5mzqgo8rf.png',
  },
  {
    id: '5',
    name: 'Toronto Raptors',
    logo: null,
  },
  {
    id: '6',
    name: 'Toronto Raptors',
    logo: null,
  },
  {
    id: '7',
    name: 'Toronto Raptors',
    logo: 'https://images.firstwefeast.com/complex/image/upload/c_limit,fl_progressive,q_80,w_1030/omox9xypgbi5mzqgo8rf.png',
  },
  {
    id: '8',
    name: 'Toronto Raptors',
    logo: null,
  },
];
