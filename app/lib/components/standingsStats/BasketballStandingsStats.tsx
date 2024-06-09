// TODO:look to create a model from API call and use it from there

import classNames from 'classnames';
import Link from 'next/link';
import ROUTES from '../../globals/routes';

type Data = {
  id: string;
  rank: number;
  team: string;
  games: number;
  wins: number;
  losses: number;
  draws: number;
  winpct: number;
  pf: number;
  pa: number;
  plusminus: number;
  streak: number;
}[];

type Props = {
  data: Data;
  leagueName: string;
};

export default function BasketballStandingsStats({ data, leagueName }: Props) {
  return (
    <tbody>
      {data
        .sort((a, b) => a.rank - b.rank)
        .map((team, index) => {
          return (
            <tr
              key={team.id}
              className={classNames(
                index % 2 === 0 && 'bg-slate-50',
                'flex h-[60px] items-center text-sm font-medium transition duration-75 hover:bg-slate-200'
              )}
            >
              <td className='w-20 text-center font-normal'>{team.rank}</td>
              <td className='flex h-full w-[150px] items-center justify-center border-r text-center'>
                <Link
                  className='truncate transition-all hover:text-secondary'
                  href={`${ROUTES.LEAGUE}/${leagueName}/${ROUTES.TEAMS}/${team.id}`}
                >
                  {team.team}
                </Link>
              </td>

              <td className='w-[45px] text-center'>{team.games}</td>
              <td className='w-[45px] text-center'>{team.wins}</td>
              <td className='w-[45px] text-center'>{team.losses}</td>
              <td className='w-[45px] text-center'>{team.draws}</td>
              <td className='w-[45px] text-center'>{team.winpct}</td>
              <td className='w-[45px] text-center'>{team.pf}</td>
              <td className='w-[45px] text-center'>{team.pa}</td>
              <td className='w-[45px] text-center'>{team.plusminus}</td>
              <td className='w-[45px] text-center'>{team.streak}</td>
            </tr>
          );
        })}
    </tbody>
  );
}
