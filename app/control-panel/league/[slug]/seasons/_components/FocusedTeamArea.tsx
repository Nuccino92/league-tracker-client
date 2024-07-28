'use client';

import { useState } from 'react';
import Image from 'next/image';

import FormLabel from '@/app/control-panel/_components/FormLabel';
import StyledBox from '@/app/lib/components/StyledBox';
import {
  useFreeAgents,
  usePlayers,
} from '@/app/lib/hooks/api/control-panel/players';
import extractInitials from '@/app/lib/utils/extractInitials';
import { BaseTeam } from '@/app/lib/types/Models/Team';
import { IconBxTransfer, Spinner } from '@/app/lib/SVGs';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/app/lib/components/Tooltip';
import SearchBar from '@/app/lib/components/SearchBar';

export default function FocusedTeamArea({
  slug,
  focusedTeam,
}: {
  slug: string;
  focusedTeam: BaseTeam | null;
}) {
  const {
    data: roster,
    status: rosterStatus,
    isLoading,
  } = usePlayers({
    slug,
    includeOnly: ['season', 'team'],
    paginate: false,
  });

  const { data: freeAgents, status: freeAgentsStatus } = useFreeAgents({
    slug,
  });

  // Used to either filter freeAgents state or query the db
  // If db query use  const debouncedSearch = useDebounce(searchInputValue, 750);
  const [freeAgentQuery, setFreeAgentQuery] = useState('');

  return (
    <StyledBox classes='py-6 px-6'>
      {focusedTeam ? (
        <div className='mb-4 w-full px-4'>
          <h3 className='text-xl font-medium text-zinc-900'>
            {focusedTeam.name}
          </h3>
        </div>
      ) : null}
      <div className='flex w-full justify-center rounded-xl bg-slate-100 p-4 '>
        <div className='flex space-x-6 lg:max-w-[1024px]'>
          <StyledBox classes='p-4'>
            <FormLabel label='Roster' htmlFor='' />
            <div className='mt-5 w-[250px] space-y-2 rounded-xl bg-slate-100 p-3'>
              {rosterStatus === 'success' ? (
                <>
                  {roster?.map((player) => (
                    <div
                      className='flex  items-center justify-between space-x-2 rounded border bg-white px-3 py-2 text-sm'
                      key={player.name + player.id}
                    >
                      <div className='flex items-center space-x-2'>
                        {player.avatar ? (
                          <Image
                            src={player.avatar}
                            alt={`${player.name} avatar`}
                            height={24}
                            width={24}
                            className='rounded-full'
                          />
                        ) : (
                          <span className='flex h-6 w-6 items-center justify-center overflow-hidden rounded-full border text-xs font-medium'>
                            {extractInitials(player.name)}
                          </span>
                        )}
                        <span>{player.name}</span>
                      </div>
                      <TooltipProvider>
                        <Tooltip delayDuration={100} disableHoverableContent>
                          <TooltipTrigger
                            onClick={() => {
                              //TODO: implement remove from team mutation
                              console.log('REMOVING FROM TEAM:', player);
                            }}
                            className='transition-colors duration-75 ease-out hover:text-red-600'
                          >
                            <IconBxTransfer height={20} width={20} />
                          </TooltipTrigger>
                          <TooltipContent className='!mb-3 max-w-[250px] !rounded border border-primary !bg-primary text-center !text-sm !font-medium !text-white'>
                            Remove {player.name} from the {focusedTeam?.name}{' '}
                            roster
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  ))}
                </>
              ) : (
                <div className='flex h-full w-full items-center justify-center'>
                  <Spinner height={40} width={40} />
                </div>
              )}{' '}
            </div>
          </StyledBox>

          {/* TODO: possibly make this similar to the manage teams button where it prompts a modal and shows the list from there to manage instead of drag and drop */}

          {/* TODO: sort alphabetically */}

          <StyledBox classes='p-4'>
            <div className='flex flex-col items-start justify-between space-y-4'>
              <FormLabel label='Free Agents' htmlFor='' />{' '}
              <SearchBar
                containerClasses='border !w-full'
                inputValue={freeAgentQuery}
                setInputValue={setFreeAgentQuery}
                placeholder='Search free agents...'
                searchIconSize={22}
                closeIconSize={18}
              />
            </div>
            <div className='mt-5 space-y-3 rounded-xl bg-slate-100 p-3'>
              {freeAgentsStatus === 'success' ? (
                <>
                  {freeAgents
                    ?.sort((a, b) => a.name.localeCompare(b.name))
                    .map((freeAgent) => (
                      <div
                        className='flex w-[250px] items-center justify-between space-x-2 rounded border bg-white px-3 py-2 text-sm'
                        key={freeAgent.name + freeAgent.id}
                      >
                        <div className='flex items-center space-x-2'>
                          {freeAgent.avatar ? (
                            <Image
                              src={freeAgent.avatar}
                              alt={`${freeAgent.name} avatar`}
                              height={24}
                              width={24}
                              className='rounded-full'
                            />
                          ) : (
                            <span className='flex h-6 w-6 items-center justify-center overflow-hidden rounded-full border text-xs font-medium'>
                              {extractInitials(freeAgent.name)}
                            </span>
                          )}{' '}
                          <span>{freeAgent.name}</span>{' '}
                        </div>
                        <TooltipProvider>
                          <Tooltip delayDuration={100} disableHoverableContent>
                            <TooltipTrigger
                              onClick={() => {
                                //TODO: implement add to team mutation
                                console.log('ADDING TO TEAM:', freeAgent);
                              }}
                              className='transition-colors duration-75 ease-out hover:text-secondary'
                            >
                              <IconBxTransfer height={20} width={20} />
                            </TooltipTrigger>
                            <TooltipContent className='!mb-3 max-w-[250px] !rounded border border-primary !bg-primary text-center !text-sm !font-medium !text-white'>
                              Add {freeAgent.name} to the {focusedTeam?.name}{' '}
                              roster
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    ))}
                </>
              ) : null}{' '}
            </div>
          </StyledBox>

          <div className='space-y-6'>
            <div className='space-y-2 text-sm font-medium'>
              <div>
                In the Team Management Area, you can manage a team&apos;s roster
                by adding and removing players.
              </div>
              <div>
                <strong>Adding Free Agents to Your Team:</strong> Browse the
                list of available free agents. Click the icon beside the free
                agent&apos;s name to add them to your focused team.
              </div>

              <div>
                <strong>Removing Players from Your Roster:</strong> View your
                team&apos;s roster. Click the icon beside the player&apos;s name
                to remove them from the roster.
              </div>
            </div>

            {/* 
              In future, possibly add additional settings.
              - Team captains
              - Suspend teams 
              - etc.
            */}
            {/* <StyledBox>
              <div>team checkboxes</div>
              <div>team captain... </div>
            </StyledBox> */}
          </div>
        </div>
      </div>
    </StyledBox>
  );
}
