'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Lottie from 'react-lottie';

import animationData from '@/app/assets/animations/horizontal-moving-circles.json';
import StyledBox from '@/app/lib/components/StyledBox';
import { useLeagueControlPanel } from '@/app/control-panel/_components/LeagueControlPanelProvider';
import { Button } from '@/app/lib/components/Button';
import { useGenerateGameSchedule } from '@/app/lib/hooks/api/control-panel';
import ScheduleGenerationForm from '@/app/control-panel/league/[slug]/schedule/_components/ScheduleGenerationForm';

type Props = {
  slug: string;
};

export default function GenerateSchedule({ slug }: Props) {
  const searchParams = useSearchParams();

  const [showSheduleGeneratorForm, setShowSheduleGeneratorForm] =
    useState(false);
  const generateGamesMut = useGenerateGameSchedule(slug);

  const {
    activeSeason,
    leagueData: { seasons },
  } = useLeagueControlPanel();

  const focusedSeason = seasons.all_seasons.find(
    (season) => season.id.toString() === searchParams.get('season')
  );

  return (
    <>
      {focusedSeason ? (
        <StyledBox classes='p-8 flex items-center gap-6 justify-between'>
          <div className='flex h-14 flex-col justify-center space-y-1'>
            {generateGamesMut.status === 'loading' ? (
              <div className='font-medium text-zinc-600'>
                Generating games, Please wait
              </div>
            ) : (
              <>
                <span className='font-medium text-zinc-600'>
                  Automatically Generate Full Game Schedule
                </span>
                <span className='text-lg font-bold text-zinc-900'>
                  {focusedSeason.name}
                </span>
              </>
            )}
          </div>

          {generateGamesMut.status === 'loading' ? (
            <div className='flex h-10 items-center justify-center'>
              <Lottie
                height={75}
                width={75}
                options={{
                  loop: true,
                  autoplay: true,
                  animationData: animationData,
                }}
              />
            </div>
          ) : (
            <Button
              disabled={activeSeason?.id !== focusedSeason.id}
              variant={'secondary'}
              onClick={() => setShowSheduleGeneratorForm(true)}
            >
              Generate Game Schedule
            </Button>
          )}
        </StyledBox>
      ) : null}

      {showSheduleGeneratorForm ? (
        <ScheduleGenerationForm
          isOpen={showSheduleGeneratorForm}
          close={() => setShowSheduleGeneratorForm(false)}
          onSubmit={async () => {
            await generateGamesMut.mutateAsync();
          }}
        />
      ) : null}
    </>
  );
}
