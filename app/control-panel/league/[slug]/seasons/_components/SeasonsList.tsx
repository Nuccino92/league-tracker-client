import Link from 'next/link';
import classNames from 'classnames';
import { usePathname, useSearchParams } from 'next/navigation';

import { useLeagueControlPanel } from '@/app/control-panel/_components/LeagueControlPanelProvider';
import { Season } from '@/app/lib/types/Models/Season';
import { useEffect } from 'react';
import { IconCalendar } from '@/app/lib/SVGs';

type Props = {
  onLinkClick: () => void;
};

export default function SeasonsList({ onLinkClick }: Props) {
  const {
    leagueData: { seasons },
  } = useLeagueControlPanel();

  const searchParams = useSearchParams();

  const seasonParam = searchParams.get('season') as string;

  // TODO: add teams + players + created at

  // TODO: use separate api call

  return (
    <div className='flex h-max w-full flex-col space-y-6'>
      <div className='divide-y'>
        <div className='w-full py-4 pl-20 font-medium'>
          Season Name, Registrations
        </div>
        {seasons.all_seasons.map((season) => {
          return (
            <SeasonItem
              key={season.id}
              season={season}
              onLinkClick={onLinkClick}
            />
          );
        })}
      </div>
    </div>
  );
}

function SeasonItem({ season, onLinkClick }: { season: Season } & Props) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const { activeSeason } = useLeagueControlPanel();

  const seasonParam = searchParams.get('season');

  // TODO: add teams + players + created at
  // TODO: add ellipsis menu, have a settings link that allows you to change the name of the season, enabled/disabled registration forms

  return (
    <div className='flex items-center justify-between px-8 py-4'>
      <div className='flex items-center gap-2'>
        <div className='flex h-10 w-10 items-center justify-center rounded-md border bg-gray-500 font-medium text-white'>
          <IconCalendar height={27} width={27} color='rgb(209 213 219)' />
        </div>

        <Link
          onClick={() => {
            if (seasonParam === season.id.toString()) {
              onLinkClick();
            }
          }}
          href={pathname + '?' + `season=${season.id.toString()}`}
          className={classNames(
            season.id.toString() === searchParams.get('season') &&
              'text-secondary',
            'font-medium hover:text-secondary'
          )}
        >
          {activeSeason?.id === season.id && (
            <span className='text-xs font-light italic text-zinc-600'>
              (active)
            </span>
          )}{' '}
          {season.name}
        </Link>
      </div>
    </div>
  );
}
