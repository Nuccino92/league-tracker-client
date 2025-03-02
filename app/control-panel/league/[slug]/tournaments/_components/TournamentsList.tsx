'use client';

import { useEffect, useState } from 'react';
import { format, parseISO } from 'date-fns';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import StyledBox from '@/app/lib/components/StyledBox';
import { useTournaments } from '@/app/lib/hooks/api/control-panel/tournaments';
import { TournamentListItem } from '@/app/lib/types/Models/Tournament';
import { cn } from '@/app/lib/utils';
import {
  EditIcon,
  HeroChevronRight,
  IconCalendar,
  Spinner,
} from '@/app/lib/SVGs';
import ROUTES from '@/app/lib/globals/routes';
import { useLeagueControlPanel } from '@/app/control-panel/_components/LeagueControlPanelProvider';
import useDebounce from '@/app/lib/hooks/useDebounce';
import SearchBar from '@/app/lib/components/SearchBar';
import ListBox from '@/app/lib/components/Listbox';
import useQueryString from '@/app/lib/hooks/useQueryString';
import transformIntoOptions from '@/app/lib/utils/transformIntoOptions';
import Pagination from '@/app/lib/components/Pagination';

export default function TournamentsList() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const { leagueData } = useLeagueControlPanel();
  const { seasons } = leagueData;

  const { createQueryString } = useQueryString();

  const [searchInputValue, setSearchInputValue] = useState(
    searchParams.get('search') ?? ''
  );

  const debouncedSearch = useDebounce(searchInputValue, 750);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);

    searchParams.set('search', debouncedSearch);
    searchParams.set('page', '1');

    router.push(`${pathname}?${searchParams.toString()}`);
  }, [debouncedSearch, pathname, router]);

  const selectedSeason = searchParams.get('season')
    ? seasons.all_seasons.find(
        (season) => season.id === parseInt(searchParams.get('season') as string)
      )?.id
    : null;

  const { response, status } = useTournaments({
    includeOnly: ['page', 'search', 'season'],
  });

  return (
    <div>
      <StyledBox classes='space-y-4'>
        <div className='flex justify-end gap-4 border-b px-4 py-6'>
          <div className='flex items-center space-x-2 text-sm'>
            <span>Season:</span>
            <ListBox
              buttonClasses='border'
              rootClasses='w-max !text-xs'
              value={selectedSeason ? selectedSeason.toString() : null}
              onChange={(value) =>
                router.push(
                  pathname +
                    '?' +
                    createQueryString('season', value?.toString())
                )
              }
              buttonText={
                seasons.all_seasons.find(
                  (season) => season.id === selectedSeason
                )?.name ?? 'All Seasons'
              }
              options={[
                { label: 'All Seasons', value: null },
                ...transformIntoOptions(seasons.all_seasons, {
                  labelKey: 'name',
                  valueKey: 'id',
                }),
              ]}
            />
          </div>

          <SearchBar
            inputValue={searchInputValue}
            setInputValue={setSearchInputValue}
            placeholder='Search for a tournament...'
            searchIconSize={22}
            closeIconSize={20}
          />
        </div>
        {response && status === 'success' && (
          <>
            <div className='space-y-4 p-4'>
              {response.data.length > 0 &&
                response.data.map((tournament) => (
                  <Tournament key={tournament.id} tournament={tournament} />
                ))}

              {response.data.length === 0 && (
                <div className='flex items-center justify-center py-10 italic'>
                  You Have No Tournaments
                </div>
              )}
            </div>
            <div className='!mt-4 flex w-full items-center justify-end px-10 pb-4'>
              <Pagination
                currentPage={response.meta.current_page}
                totalPages={response.meta.last_page}
                onPageChange={(type, page) => {
                  if (type === 'next') {
                    router.push(
                      pathname +
                        '?' +
                        createQueryString('page', (page + 1).toString())
                    );
                  } else if (type === 'prev') {
                    router.push(
                      pathname +
                        '?' +
                        createQueryString('page', (page - 1).toString())
                    );
                  } else if (page) {
                    router.push(
                      pathname +
                        '?' +
                        createQueryString('page', page.toString())
                    );
                  }
                }}
              />
            </div>
          </>
        )}
        {status === 'loading' && (
          <div className='flex items-center justify-center py-[100px]'>
            <Spinner height={40} width={40} />
          </div>
        )}{' '}
      </StyledBox>
    </div>
  );
}

function Tournament({ tournament }: { tournament: TournamentListItem }) {
  const {
    slug,
    leagueData: { seasons },
  } = useLeagueControlPanel();

  console.log('leagueData', seasons);

  const getStatusColor = (status: TournamentListItem['status']) => {
    const colors = {
      draft: 'bg-gray-200 text-gray-600',
      active: 'bg-green-200 text-green-600',
      completed: 'bg-blue-200 text-blue-600',
      cancelled: 'bg-red-200 text-red-600',
    };
    return colors[status] || 'bg-gray-200';
  };

  const formatDate = (dateString: string) => {
    return format(parseISO(dateString), 'MMM d, yyyy');
  };

  const attachedSeason =
    seasons.all_seasons.find((season) => season.id === tournament.season_id) ??
    null;

  return (
    <StyledBox key={tournament.id} classes='rounded-lg border p-4' boxShadow>
      <div className='flex items-start justify-between'>
        <div>
          <Link
            href={`${ROUTES.CONTROL_PANEL}${ROUTES.LEAGUE}/${slug}${ROUTES.CONTROL_PANEL_SUBROUTES.TOURNAMENTS}/${tournament.id}`}
            className='group inline-flex items-center gap-2 transition-colors hover:text-secondary'
          >
            <h3 className='text-xl font-semibold'>{tournament.name}</h3>
            <HeroChevronRight height={18} width={18} strokeWidth={3} />
          </Link>

          {attachedSeason && (
            <div className='mt-1.5 flex items-center gap-1 text-sm font-medium leading-none text-gray-600'>
              <IconCalendar height={18} width={18} />
              {attachedSeason.name}
            </div>
          )}
        </div>
        <div className='flex items-center gap-4'>
          <span
            className={cn(
              getStatusColor(tournament.status),
              'rounded-full px-2 py-1 text-xs font-medium capitalize'
            )}
          >
            {tournament.status}
          </span>

          <Link
            href={`${ROUTES.CONTROL_PANEL}${ROUTES.LEAGUE}/${slug}${ROUTES.CONTROL_PANEL_SUBROUTES.TOURNAMENTS}/${tournament.id}`}
          >
            <EditIcon height={20} width={20} />
          </Link>
        </div>
      </div>

      <div className='mt-4 grid grid-cols-2 gap-4 text-sm md:grid-cols-4'>
        <div>
          <span className='text-gray-500'>Format:</span>
          <p className='capitalize'>{tournament.format.replace(/_/g, ' ')}</p>
        </div>
        <div>
          <span className='text-gray-500'>Type:</span>
          <p className='capitalize'>{tournament.tournament_type}</p>
        </div>
        <div>
          <span className='text-gray-500'>Created:</span>
          <p>{formatDate(tournament.created_at)}</p>
        </div>
        <div>
          <span className='text-gray-500'>Updated:</span>
          <p>{formatDate(tournament.updated_at)}</p>
        </div>
      </div>
    </StyledBox>
  );
}
