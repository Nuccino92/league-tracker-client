'use client';

import { useState } from 'react';
import { Disclosure } from '@headlessui/react';
import classNames from 'classnames';
import Image from 'next/image';
import Link from 'next/link';

import StyledBox from '@/app/lib/components/StyledBox';
import {
  useFollowedLeagues,
  useRemoveBookmarkedLeague,
  useRemoveJoinedLeague,
} from '@/app/lib/hooks/api/followed-leagues';
import {
  DeleteIcon,
  DownChevronIcon,
  HeartIcon,
  IconBillLine,
  IconExternalLink,
  IconHeartbreakFill,
  IconStar,
  IconWebsite,
  InviteLine,
} from '@/app/lib/SVGs';
import { FollowedLeagueResponse } from '@/app/lib/types/followed-leagues.types';
import getInitials from '@/app/lib/utils/getInitials';
import ROUTES from '@/app/lib/globals/routes';
import RemoveJoinedLeagueModal from '@/app/followed-leagues/_components/RemoveJoinedLeagueModal';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/app/lib/components/Tooltip';
import FindLeagueModal from '@/app/followed-leagues/_components/FindLeagueModal';

export default function FollowedLeagues() {
  const { response, status } = useFollowedLeagues();

  return (
    <>
      {response && status === 'success' && (
        <div className='w-full space-y-6'>
          <InvolvedLeagues joinedLeagues={response.joined_leagues} />
          <BookmarkedLeagues bookmarks={response.bookmarked_leagues} />
        </div>
      )}
    </>
  );
}

function InvolvedLeagues({
  joinedLeagues,
}: {
  joinedLeagues: FollowedLeagueResponse['joined_leagues'];
}) {
  const [showRemoveLeagueModal, setShowRemoveLeagueModal] = useState(false);

  const removeJoinedLeagueMut = useRemoveJoinedLeague();

  return (
    <StyledBox classes=''>
      <Disclosure defaultOpen={joinedLeagues.length > 0 ? true : false}>
        {({ open }) => (
          <>
            <Disclosure.Button
              className={classNames(
                open && 'border-b',
                'flex w-full items-center justify-between p-6'
              )}
            >
              <span className='text-xl font-bold'>Your Leagues</span>{' '}
              <DownChevronIcon height={18} width={18} />
            </Disclosure.Button>

            {open && (
              <div className='p-6'>
                {joinedLeagues.length === 0 && <div>none</div>}
                {joinedLeagues.length > 0 && (
                  <div>
                    {joinedLeagues
                      .sort((a, b) => {
                        if (a.role === 'owner' && b.role !== 'owner') return -1;
                        if (a.role !== 'owner' && b.role === 'owner') return 1;
                        return a.name.localeCompare(b.name);
                      })
                      .map((league) => {
                        return (
                          <div
                            key={league.id}
                            className='flex items-center justify-between p-6'
                          >
                            <div className='flex w-full items-center gap-4'>
                              {league.logo ? (
                                <Image
                                  src={league.logo}
                                  alt={`${league.name} logo`}
                                  height={40}
                                  width={40}
                                  className='h-[90px] w-[120px] rounded-xl border'
                                  style={{ objectFit: 'cover' }}
                                />
                              ) : (
                                <div className='flex h-[90px] w-[120px] items-center justify-center rounded-xl border bg-primary font-medium text-white'>
                                  {getInitials(league.name)}
                                </div>
                              )}{' '}
                              <div className='w-full'>
                                <div className='flex items-center gap-2 text-lg font-medium'>
                                  <span>{league.name}</span> -{' '}
                                  <span className='text-sm capitalize text-gray-600'>
                                    {league.role}
                                  </span>
                                  {league.role === 'owner' && (
                                    <span>
                                      <IconStar
                                        height={24}
                                        width={24}
                                        color='#8858e8'
                                      />
                                    </span>
                                  )}
                                </div>

                                <p className='line-clamp-2 h-10 text-sm text-gray-600 sm:max-w-[70%]'>
                                  {league.description ?? 'No description'}
                                </p>
                              </div>
                            </div>

                            <div className='flex items-center gap-6'>
                              {league.role === 'owner' && (
                                <TooltipProvider>
                                  <Tooltip delayDuration={75}>
                                    <TooltipTrigger>
                                      <Link
                                        href={
                                          ROUTES.BILLING_AND_SUBSCRIPTION +
                                          `/${league.id}`
                                        }
                                        className='hover:opacity-50'
                                      >
                                        <IconBillLine
                                          height={22}
                                          width={22}
                                          color='#aeafb0'
                                        />
                                      </Link>
                                    </TooltipTrigger>
                                    <TooltipContent className='text-white'>
                                      Billing & Subscriptions
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              )}
                              {league.role !== 'owner' && (
                                <TooltipProvider>
                                  <Tooltip delayDuration={75}>
                                    <TooltipTrigger className='flex h-max w-max items-center justify-center'>
                                      <span
                                        onClick={() =>
                                          setShowRemoveLeagueModal(true)
                                        }
                                        className='hover:opacity-50'
                                      >
                                        <DeleteIcon
                                          height={22}
                                          width={22}
                                          color='#aeafb0'
                                        />
                                      </span>
                                    </TooltipTrigger>
                                    <TooltipContent className='text-white'>
                                      Remove League
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              )}
                              {/* todo: POSSIBLY MAKE THE HREF DEPENDANT ON THE ROLE. */}

                              {league.role !== 'invitation' && (
                                <TooltipProvider>
                                  <Tooltip delayDuration={75}>
                                    <TooltipTrigger>
                                      <Link
                                        href={
                                          ROUTES.CONTROL_PANEL +
                                          ROUTES.LEAGUE +
                                          `/${league.slug}` +
                                          ROUTES.CONTROL_PANEL_SUBROUTES
                                            .DASHBOARD
                                        }
                                        className='hover:opacity-50'
                                      >
                                        <IconExternalLink
                                          height={22}
                                          width={22}
                                          color='#aeafb0'
                                        />
                                      </Link>
                                    </TooltipTrigger>
                                    <TooltipContent className='text-white'>
                                      Visit Admin Panel
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              )}

                              {league.role === 'invitation' && (
                                <TooltipProvider>
                                  <Tooltip delayDuration={75}>
                                    <TooltipTrigger>
                                      <Link
                                        href={
                                          ROUTES.CONTROL_PANEL +
                                          ROUTES.LEAGUE +
                                          `/${league.slug}` +
                                          ROUTES.CONTROL_PANEL_SUBROUTES
                                            .DASHBOARD
                                        }
                                        className='hover:opacity-50'
                                      >
                                        <InviteLine
                                          height={22}
                                          width={22}
                                          color='#aeafb0'
                                        />
                                      </Link>
                                    </TooltipTrigger>
                                    <TooltipContent className='text-white'>
                                      Accept league invitation
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              )}
                              <TooltipProvider>
                                <Tooltip delayDuration={75}>
                                  <TooltipTrigger>
                                    <Link
                                      href={ROUTES.LEAGUE + `/${league.slug}`}
                                      className='hover:opacity-50'
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

                            {showRemoveLeagueModal && (
                              <RemoveJoinedLeagueModal
                                isOpen={showRemoveLeagueModal}
                                close={() => setShowRemoveLeagueModal(false)}
                                onRemoveClick={async () => {
                                  await removeJoinedLeagueMut.mutateAsync(
                                    league.id
                                  );
                                }}
                                league={league}
                              />
                            )}
                          </div>
                        );
                      })}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </Disclosure>
    </StyledBox>
  );
}

function BookmarkedLeagues({
  bookmarks,
}: {
  bookmarks: FollowedLeagueResponse['bookmarked_leagues'];
}) {
  const [showFindLeagueModal, setShowFindLeagueModal] = useState(false);

  const removeBookmarkedLeagueMut = useRemoveBookmarkedLeague();

  return (
    <StyledBox>
      <Disclosure defaultOpen={bookmarks.length > 0 ? true : false}>
        {({ open }) => (
          <>
            <Disclosure.Button
              className={classNames(
                open && 'border-b',
                'flex w-full items-center justify-between p-6'
              )}
            >
              <span className='flex items-center gap-6'>
                <span className='text-xl font-bold'>Bookmarked Leagues</span>{' '}
                <span
                  role='button'
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    setShowFindLeagueModal(true);
                  }}
                  className='flex h-8 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-white transition-colors duration-75 hover:opacity-50'
                >
                  Find Leagues to Bookmark
                </span>
              </span>

              <DownChevronIcon height={18} width={18} />
            </Disclosure.Button>

            {open && (
              <div className='p-6'>
                {bookmarks.length === 0 && <div>none</div>}
                {bookmarks.length > 0 && (
                  <div>
                    {bookmarks.map((bookmark) => {
                      return (
                        <div
                          key={bookmark.id}
                          className='flex items-center justify-between p-6'
                        >
                          {' '}
                          <div className='flex w-full items-center gap-4'>
                            {bookmark.logo ? (
                              <Image
                                src={bookmark.logo}
                                alt={`${bookmark.name} logo`}
                                height={40}
                                width={40}
                                className='h-[90px] w-[120px] rounded-xl border'
                                style={{ objectFit: 'cover' }}
                              />
                            ) : (
                              <div className='flex h-[90px] w-[120px] items-center justify-center rounded-xl border bg-primary font-medium text-white'>
                                {getInitials(bookmark.name)}
                              </div>
                            )}{' '}
                            <div className='w-full'>
                              <div className='flex items-center gap-2 text-lg font-medium'>
                                <span>{bookmark.name}</span>
                              </div>

                              <p className='line-clamp-2 h-10 text-sm text-gray-600 sm:max-w-[70%]'>
                                {bookmark.description ?? 'No description'}
                              </p>
                            </div>
                          </div>
                          <div className='flex items-center gap-6'>
                            <TooltipProvider>
                              <Tooltip delayDuration={75}>
                                <TooltipTrigger
                                  disabled={removeBookmarkedLeagueMut.isLoading}
                                >
                                  <span
                                    role='button'
                                    onClick={async () => {
                                      if (removeBookmarkedLeagueMut.isLoading)
                                        return;

                                      await removeBookmarkedLeagueMut.mutateAsync(
                                        bookmark.id
                                      );
                                    }}
                                    className='hover:opacity-50'
                                  >
                                    <IconHeartbreakFill
                                      height={22}
                                      width={22}
                                      color='#aeafb0'
                                    />
                                  </span>
                                </TooltipTrigger>
                                <TooltipContent className='text-white'>
                                  Remove Bookmark
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>

                            <TooltipProvider>
                              <Tooltip delayDuration={75}>
                                <TooltipTrigger>
                                  <Link
                                    href={ROUTES.LEAGUE + `/${bookmark.slug}`}
                                    className='hover:opacity-50'
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
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </Disclosure>

      {showFindLeagueModal && (
        <FindLeagueModal
          isOpen={showFindLeagueModal}
          close={() => setShowFindLeagueModal(false)}
        />
      )}
    </StyledBox>
  );
}
