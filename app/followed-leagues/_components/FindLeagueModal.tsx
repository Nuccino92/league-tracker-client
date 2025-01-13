'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import classNames from 'classnames';

import Modal from '@/app/lib/components/Modal';
import {
  useAddBookmarkedLeague,
  useLeaguesForBookmark,
} from '@/app/lib/hooks/api/followed-leagues';
import { ModalType } from '@/app/types';
import SearchBar from '@/app/lib/components/SearchBar';
import useDebounce from '@/app/lib/hooks/useDebounce';
import { HeartIcon, IconSearch, IconWebsite, Spinner } from '@/app/lib/SVGs';
import getInitials from '@/app/lib/utils/getInitials';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/app/lib/components/Tooltip';
import ROUTES from '@/app/lib/globals/routes';

type Props = {};

const CONTENT_HEIGHT = 'h-[480px]';

export default function FindLeagueModal({
  isOpen,
  close,
  panelClasses,
}: Props & ModalType) {
  const [query, setQuery] = useState('');

  const debouncedSearch = useDebounce(query, 450);

  const { response, status } = useLeaguesForBookmark(debouncedSearch);

  const addBookmarkedLeagueMut = useAddBookmarkedLeague();

  const isRequestEnabled = query !== '';

  return (
    <Modal
      panelClasses='md:w-[760px] w-full !p-0'
      isOpen={isOpen}
      close={close}
    >
      <div className='space-y-4 border-b p-6'>
        <div className='text-xl font-bold'>Find Leagues</div>

        <SearchBar
          inputValue={query}
          setInputValue={setQuery}
          placeholder='Search for leagues...'
          containerClasses='w-full'
          rootClasses='!w-full'
          searchIconSize={22}
        />
      </div>

      {isRequestEnabled && response && (
        <div
          className={classNames(
            CONTENT_HEIGHT,
            'flex items-center gap-6 divide-x p-6'
          )}
        >
          <div className='w-full'>
            {/* With leagues */}
            {response.length > 0 &&
              response.map((league) => {
                return (
                  <div
                    key={league.id}
                    className='flex items-center justify-between p-4 text-sm'
                  >
                    <div className='flex w-full items-center gap-4'>
                      {league.logo ? (
                        <Image
                          src={league.logo}
                          alt={`${league.name} logo`}
                          height={40}
                          width={40}
                          className='h-[60px] w-[60px] min-w-[60px] rounded-xl border'
                          style={{ objectFit: 'cover' }}
                        />
                      ) : (
                        <div className='flex h-[60px] w-[60px] min-w-[60px] items-center justify-center rounded-xl border bg-primary font-medium text-white'>
                          {getInitials(league.name)}
                        </div>
                      )}{' '}
                      <div className='w-full'>
                        <div className='flex items-center gap-2 font-medium'>
                          <span>{league.name}</span>
                        </div>

                        <p className='line-clamp-2 h-10 text-gray-600 sm:max-w-[70%]'>
                          {league.description ?? 'No description'}
                        </p>
                      </div>
                    </div>
                    <div className='flex items-center gap-6'>
                      <TooltipProvider>
                        <Tooltip delayDuration={75}>
                          <TooltipTrigger
                            disabled={addBookmarkedLeagueMut.isLoading}
                          >
                            <span
                              role='button'
                              onClick={async () => {
                                if (addBookmarkedLeagueMut.isLoading) return;

                                await addBookmarkedLeagueMut.mutateAsync(
                                  league.id
                                );

                                close();
                              }}
                              className='hover:opacity-50 disabled:opacity-30'
                            >
                              {addBookmarkedLeagueMut.isLoading}
                              <HeartIcon
                                height={24}
                                width={24}
                                color='#e6394d'
                                fill='#e6394d'
                              />
                            </span>
                          </TooltipTrigger>
                          <TooltipContent className='text-white'>
                            Bookmark League
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                      <TooltipProvider>
                        <Tooltip delayDuration={75}>
                          <TooltipTrigger>
                            <Link
                              href={ROUTES.LEAGUE + `/${league.slug}`}
                              className='hover:opacity-50'
                              target='_blank'
                            >
                              <IconWebsite
                                height={22}
                                width={22}
                                color='#aeafb0'
                              />
                            </Link>
                          </TooltipTrigger>
                          <TooltipContent className='text-white'>
                            Visit Web Page
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>
                );
              })}

            {/* Without leagues */}
            {response.length === 0 && (
              <div
                className={classNames(
                  CONTENT_HEIGHT,
                  'flex h-full w-full flex-col items-center justify-center gap-4'
                )}
              >
                <IconSearch height={50} width={50} color='rgb(156 163 175)' />
                <div className='text-lg font-medium italic text-gray-400'>
                  No leagues found
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {isRequestEnabled && status === 'loading' && (
        <div
          className={classNames(
            CONTENT_HEIGHT,
            'flex items-center justify-center py-10'
          )}
        >
          <Spinner height={40} width={40} />
        </div>
      )}

      {!isRequestEnabled && (
        <div
          className={classNames(
            CONTENT_HEIGHT,
            'flex h-full w-full flex-col items-center justify-center gap-4'
          )}
        >
          <IconSearch height={50} width={50} color='rgb(156 163 175)' />
          <div className='text-lg font-medium italic text-gray-400'>
            Search for a league
          </div>
        </div>
      )}
    </Modal>
  );
}
