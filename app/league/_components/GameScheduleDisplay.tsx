'use client';

import Image from 'next/image';

import getInitials from '@/app/lib/utils/getInitials';
import Link from 'next/link';
import ROUTES from '@/app/lib/routesConfig';
import { useState } from 'react';
import classNames from 'classnames';

type Props = {
  leagueName: string;
  game: {
    game_id: any;
    time: string;
    has_played: boolean;
    home_team: {
      id: string;
      abbreviation: string;
      name: string;
      logo: string | null;
      score: number | null;
    };
    away_team: {
      id: string;
      abbreviation: string;
      name: string;
      logo: string | null;
      score: number | null;
    };
  };
};

export default function GameScheduleDisplay({ game, leagueName }: Props) {
  const { home_team, away_team } = game;

  const [isHomeTeamHovered, setIsHomeTeamHovered] = useState(false);
  const [isAwayTeamHovered, setIsAwayTeamHovered] = useState(false);

  return (
    <div className='flex items-center justify-between'>
      <div className='flex w-[260px] items-center space-x-5'>
        {/* Home teams container */}
        <div className='relative flex w-[100px] items-center justify-end space-x-3'>
          {isHomeTeamHovered ? (
            <span className='absolute top-0 z-10 -mt-8 whitespace-nowrap rounded border bg-white p-2 font-medium text-secondary'>
              {home_team.name}
            </span>
          ) : null}
          <Link
            onMouseOver={() => setIsHomeTeamHovered(true)}
            onMouseLeave={() => setIsHomeTeamHovered(false)}
            href={`${ROUTES.LEAGUE}/${leagueName}/${ROUTES.TEAMS}/${home_team.id}`}
            className='font-medium transition-all hover:text-secondary'
          >
            {home_team.abbreviation}
          </Link>
          <div className='relative h-[55px] min-h-[55px] w-[55px] min-w-[55px] space-x-2 overflow-hidden rounded border'>
            {home_team.logo ? (
              <Image
                src={home_team.logo}
                sizes='5'
                alt=''
                fill
                style={{ objectFit: 'cover' }}
                className='h-full w-full'
              />
            ) : (
              <span className='flex h-full w-full items-center justify-center bg-primary font-medium text-white'>
                {getInitials(home_team.name)}
              </span>
            )}{' '}
          </div>
        </div>
        <span>vs</span>
        {/* Away teams container */}
        <div className='relative flex w-[100px] items-center space-x-3'>
          <div className='relative h-[55px] min-h-[55px] w-[55px] min-w-[55px] space-x-2 overflow-hidden rounded border'>
            {away_team.logo ? (
              <Image
                src={away_team.logo}
                sizes='5'
                alt=''
                fill
                style={{ objectFit: 'cover' }}
                className='h-full w-full'
              />
            ) : (
              <span className='flex h-full w-full items-center justify-center bg-primary font-medium text-white'>
                {getInitials(away_team.name)}
              </span>
            )}
          </div>
          <Link
            onMouseOver={() => setIsAwayTeamHovered(true)}
            onMouseLeave={() => setIsAwayTeamHovered(false)}
            href={`${ROUTES.LEAGUE}/${leagueName}/${ROUTES.TEAMS}/${away_team.id}`}
            className='font-medium transition-all hover:text-secondary'
          >
            {away_team.abbreviation}
          </Link>
          {isAwayTeamHovered ? (
            <span className='absolute top-0 z-10 -mt-8 whitespace-nowrap rounded border bg-white p-2 font-medium text-secondary'>
              {away_team.name}
            </span>
          ) : null}
        </div>{' '}
      </div>

      <div className='w-[130px]'>
        {game.has_played ? (
          <div className='flex items-center'>
            <div
              className={classNames(
                home_team.score &&
                  away_team.score &&
                  home_team.score > away_team.score
                  ? 'text-secondary'
                  : '',
                'flex w-[60px] flex-col items-center justify-center'
              )}
            >
              <span className='font-medium'>{home_team.score}</span>{' '}
              <span className='text-sm'>({home_team.abbreviation})</span>
            </div>
            <span>-</span>
            <div
              className={classNames(
                home_team.score &&
                  away_team.score &&
                  home_team.score < away_team.score
                  ? 'text-secondary'
                  : '',
                'flex w-[60px] flex-col items-center justify-center'
              )}
            >
              <span className='font-medium'>{away_team.score}</span>{' '}
              <span className='text-sm'>({away_team.abbreviation})</span>
            </div>
          </div>
        ) : (
          <span className='ml-2 flex w-full items-center justify-start italic'>
            TBD
          </span>
        )}
      </div>

      <div className='w-[100px]'>{game.time}</div>

      <div className='w-[180px] space-x-4 pr-4 text-sm'>
        {game.has_played ? (
          <Link
            className='font-medium transition-all hover:text-secondary'
            href={`${ROUTES.LEAGUE}/${leagueName}/${ROUTES.GAME}/${game.game_id}`}
          >
            Box Score
          </Link>
        ) : null}
        <Link
          className='font-medium transition-all hover:text-secondary'
          href={`${ROUTES.LEAGUE}/${leagueName}/${ROUTES.GAME}/${game.game_id}`}
        >
          Game Page
        </Link>
      </div>
    </div>
  );
}
