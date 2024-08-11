'use client';

import { useState } from 'react';

import { useFreeAgents } from '@/app/lib/hooks/api/control-panel/players';
import StyledBox from '@/app/lib/components/StyledBox';
import classNames from 'classnames';
import TeamRoster from './TeamRoster';
import TeamSchedule from './TeamSchedule';

export default function TeamManagementSection({ slug }: { slug: string }) {
  const [selectedSection, setSelectedSection] = useState<'roster' | 'schedule'>(
    'roster'
  );
  //   const { data: freeAgents, status: freeAgentsStatus } = useFreeAgents({
  //     slug,
  //   });

  return (
    <div className='text-sm'>
      <div className='flex space-x-4 '>
        <button
          className={classNames(
            selectedSection === 'roster'
              ? 'bg-white'
              : 'bg-primary/50 text-white',
            'w-max rounded-t-lg  px-6 py-2 font-medium'
          )}
          onClick={() => setSelectedSection('roster')}
        >
          Roster
        </button>
        <button
          className={classNames(
            selectedSection === 'schedule'
              ? 'bg-white'
              : 'bg-primary/50 text-white',
            'w-max rounded-t-lg px-6 py-2 font-medium'
          )}
          onClick={() => setSelectedSection('schedule')}
        >
          Schedule
        </button>
      </div>
      <div className='bg-white'>
        {selectedSection === 'roster' ? <TeamRoster /> : null}
        {selectedSection === 'schedule' ? <TeamSchedule /> : null}
      </div>
    </div>
  );
}
