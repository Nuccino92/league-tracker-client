'use client';

import { useState } from 'react';
import classNames from 'classnames';

import StyledBox from '@/app/lib/components/StyledBox';
import {
  useLeagueSportSettings,
  useUpdateLeagueSportSettings,
} from '@/app/lib/hooks/api/control-panel';
import { StatType } from '@/app/lib/types/Responses/create-league-types';
import { Form, Formik } from 'formik';
import { Spinner } from '@/app/lib/SVGs';

export default function StatsSettings() {
  const { sportSettings, status } = useLeagueSportSettings();

  const updateStatSettingsMutation = useUpdateLeagueSportSettings();

  return (
    <StyledBox classes='h-max w-full md:max-w-[700px]'>
      <div className='border-b p-8 text-2xl font-bold'>
        Stat Tracking Settings
      </div>

      {status === 'success' && sportSettings && (
        <Formik
          initialValues={{ selected_stats: sportSettings.selected_stat_ids }}
          onSubmit={async (values) => {
            if (updateStatSettingsMutation.isLoading) return;
            await updateStatSettingsMutation.mutateAsync(values.selected_stats);
          }}
        >
          {({ values, setFieldValue }) => (
            <Form className='p-8'>
              <div className='mb-4 text-xl font-bold capitalize text-gray-600'>
                Sport: {sportSettings.info.name}
              </div>

              <div className='mb-6 space-y-2 text-sm text-gray-600'>
                <p>
                  Select the statistics you want to track for this league. These
                  stats will need to be entered after each game.
                </p>
                <ul className='list-disc space-y-1 pl-4'>
                  <li>
                    Locked stats (marked with 🔒) are mandatory and cannot be
                    disabled
                  </li>
                  <li>
                    Additional stats can be enabled/disabled based on your
                    league&apos;s needs
                  </li>
                  <li>Position-specific stats are grouped into categories</li>
                </ul>
                <p className='mt-4 italic'>
                  Tip: Select stats that are easy to track during games and
                  relevant to your league level.
                </p>
              </div>

              <div>
                {sportSettings.stat_categories ? (
                  <div className='grid grid-cols-2 gap-4'>
                    {sportSettings.stat_categories.map((category) => {
                      return (
                        <div key={category}>
                          <div className='mb-1 capitalize'>{category}</div>

                          <div className='grid grid-cols-3 gap-2'>
                            {[...sportSettings.stat_options]
                              .filter(
                                (stat) =>
                                  stat.category === category ||
                                  stat.category === null ||
                                  stat.category === undefined
                              )
                              .sort((a, b) => {
                                if (a.is_locked && !b.is_locked) return -1;
                                if (!a.is_locked && b.is_locked) return 1;
                                return a.name.localeCompare(b.name);
                              })
                              .map((stat) => {
                                return (
                                  <Stat
                                    stat={stat}
                                    key={stat.name}
                                    onClick={() => {
                                      if (
                                        values.selected_stats.includes(stat.id)
                                      ) {
                                        setFieldValue(
                                          'selected_stats',
                                          values.selected_stats.filter(
                                            (selected) => selected !== stat.id
                                          )
                                        );
                                      } else {
                                        setFieldValue('selected_stats', [
                                          ...values.selected_stats,
                                          stat.id,
                                        ]);
                                      }
                                    }}
                                    selected={values.selected_stats.includes(
                                      stat.id
                                    )}
                                  />
                                );
                              })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className='grid grid-cols-4 gap-4'>
                    {[...sportSettings.stat_options]
                      .sort((a, b) => {
                        if (a.is_locked && !b.is_locked) return -1;
                        if (!a.is_locked && b.is_locked) return 1;

                        return a.name.localeCompare(b.name);
                      })
                      .map((stat) => {
                        return (
                          <Stat
                            stat={stat}
                            key={stat.name}
                            onClick={() => {
                              if (values.selected_stats.includes(stat.id)) {
                                setFieldValue(
                                  'selected_stats',
                                  values.selected_stats.filter(
                                    (selected) => selected !== stat.id
                                  )
                                );
                              } else {
                                setFieldValue('selected_stats', [
                                  ...values.selected_stats,
                                  stat.id,
                                ]);
                              }
                            }}
                            selected={values.selected_stats.includes(stat.id)}
                          />
                        );
                      })}
                  </div>
                )}
              </div>
              <div className='flex justify-end'>
                <button
                  disabled={
                    areArraysEqual(
                      sportSettings.selected_stat_ids,
                      values.selected_stats
                    ) || updateStatSettingsMutation.isLoading
                  }
                  onClick={(e) => {
                    if (
                      areArraysEqual(
                        sportSettings.selected_stat_ids,
                        values.selected_stats
                      )
                    ) {
                      e.preventDefault();
                      e.stopPropagation();
                    }
                  }}
                  className={classNames(
                    !areArraysEqual(
                      sportSettings.selected_stat_ids,
                      values.selected_stats
                    )
                      ? 'bg-secondary'
                      : 'bg-gray-300',
                    'w-[140px] rounded border border-violet-100 p-3 font-medium text-white transition-colors duration-100'
                  )}
                  type='submit'
                >
                  {updateStatSettingsMutation.isLoading ? (
                    <div className='flex h-full w-full items-center justify-center'>
                      <Spinner height={20} width={20} />
                    </div>
                  ) : (
                    'Save Changes'
                  )}
                </button>{' '}
              </div>
            </Form>
          )}
        </Formik>
      )}

      {status === 'loading' && (
        <div className='flex items-center justify-center py-10'>
          <Spinner height={30} width={30} />
        </div>
      )}
    </StyledBox>
  );
}

function Stat({
  stat,
  onClick,
  selected,
}: {
  stat: StatType;
  onClick: () => void;
  selected: boolean;
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      disabled={stat.is_locked}
      type='button'
      onClick={onClick}
      className={classNames(
        stat.is_locked
          ? 'border-gray-400 !bg-primary text-white hover:!border-gray-400'
          : 'border-black',
        selected ? 'bg-primary text-white' : 'bg-white text-black',
        'relative flex h-full w-full items-center justify-center rounded-md border border-black py-3 font-medium hover:border-secondary'
      )}
    >
      {stat.code}

      {stat.is_locked && !isHovered && (
        <span
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className='absolute inset-0 z-10 flex items-start justify-start rounded-md bg-gray-100/60'
        >
          <span className='text-xl'>🔒</span>
        </span>
      )}

      {isHovered && (
        <span
          className={classNames(
            selected || stat.is_locked
              ? 'bg-primary !text-white'
              : 'bg-slate-50 !text-black',
            'absolute inset-0 z-10 flex items-center justify-center rounded-md text-xs'
          )}
        >
          {stat.description}
        </span>
      )}
    </button>
  );
}

const areArraysEqual = (arr1: number[], arr2: number[]): boolean => {
  if (arr1.length !== arr2.length) return false;
  const set1 = new Set(arr1);
  return arr2.every((num) => set1.has(num));
};
