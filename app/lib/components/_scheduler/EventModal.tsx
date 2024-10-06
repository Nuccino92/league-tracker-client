import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

import {
  DeleteIcon,
  EditIcon,
  IconBoxArrowUpRight,
  IconBxFootball,
  IconPeopleGroup,
  IconBxCustomize,
  LocationIcon,
  Spinner,
} from '@/app/lib/SVGs';
import { CalendarEvent } from '@/app/lib/types/Models/CalendarEvent';
import ROUTES from '@/app/lib/globals/routes';
import { useDeleteEvent } from '@/app/lib/hooks/api/events';

type Props = {
  calendarEvent: CalendarEvent;
  onEditFormSubmit: (calendarEvent: CalendarEvent) => void;
  onDeleteEvent?: (eventID: number) => void;
};

export default function EventModal({
  calendarEvent,
  onEditFormSubmit,
  onDeleteEvent,
}: Props) {
  const params = useParams();

  const deleteEventMutation = useDeleteEvent(params.slug as string);

  const eventType = calendarEvent.event_type;

  return (
    <div className='relative space-y-4 overflow-hidden border border-violet-100 !bg-white p-4 !text-zinc-900 shadow-xl'>
      <div className='flex items-start justify-between space-x-2 text-lg font-bold'>
        <div className='flex items-center space-x-2'>
          {eventType === 'game' ? (
            <IconBxFootball height={24} width={24} />
          ) : eventType === 'practice' ? (
            <IconPeopleGroup height={24} width={24} />
          ) : eventType === 'custom_event' ? (
            <IconBxCustomize height={24} width={24} />
          ) : null}

          <span className='leading-6'>{calendarEvent.title}</span>
        </div>

        <EventActionables
          onEdit={async () => {
            if (deleteEventMutation.isLoading) return;

            onEditFormSubmit(calendarEvent);
          }}
          onDelete={async () => {
            if (deleteEventMutation.isLoading) return;
            await deleteEventMutation.mutateAsync(calendarEvent.id);
            onDeleteEvent && onDeleteEvent(calendarEvent.id);
          }}
        />
      </div>
      {calendarEvent.location ? (
        <div className='flex items-center'>
          <LocationIcon height={16} width={16} />
          <div className='italic'>{calendarEvent.location}</div>
        </div>
      ) : null}
      <div>
        <div>
          <span className='font-medium'>Starts:</span>{' '}
          {formatDateTime(calendarEvent.start)}
        </div>
        {calendarEvent.end ? (
          <div>
            <span className='font-medium'>Ends:</span>{' '}
            {formatDateTime(calendarEvent.end)}
          </div>
        ) : null}{' '}
      </div>
      {calendarEvent.description ? (
        <p className='text-xs text-zinc-600'>{calendarEvent.description}</p>
      ) : null}
      {calendarEvent.notes ? (
        <div className='space-y-1 text-xs'>
          <span>Notes:</span>
          <p className='p-3 outline'>{calendarEvent.notes}</p>
        </div>
      ) : null}
      {calendarEvent.teams.length > 0 ? (
        <div className='text-sm'>
          <div className='mb-3 border-b border-black pb-1 font-medium'>
            {calendarEvent.teams.length > 0 ? 'Teams' : 'Team'}:
          </div>

          <div className='flex flex-col text-sm'>
            {calendarEvent.teams.map((team) => (
              <Link
                key={team.id}
                href={
                  ROUTES.CONTROL_PANEL +
                  ROUTES.LEAGUE +
                  '/' +
                  params.slug +
                  ROUTES.TEAMS +
                  '/' +
                  team.id
                }
                className='flex items-center space-x-2 hover:text-secondary hover:underline'
              >
                <IconBoxArrowUpRight width={11} height={11} />{' '}
                <span>{team.name}</span>
              </Link>
            ))}{' '}
          </div>
        </div>
      ) : null}

      {deleteEventMutation.isLoading ? <LoadingOverlay /> : null}

      {/* TOOD:
       here - handle errors, particularily trying to delete a game that is already played! 
      */}
      {deleteEventMutation.isError ? <FailedEventDeleteOverlay /> : null}
    </div>
  );
}

function LoadingOverlay() {
  return (
    <div className='pointer-events-none absolute top-0 z-10 !-my-0 -mx-4 flex h-full w-full items-center justify-center bg-gray-50/75'>
      <Spinner height={44} width={44} color='white' />
    </div>
  );
}

function FailedEventDeleteOverlay() {
  return <div>we cant do it</div>;
}

type ActionableTypes = {
  onEdit: () => void;
  onDelete: () => void;
};

function EventActionables({ onEdit, onDelete }: ActionableTypes) {
  return (
    <div className='flex items-center space-x-1'>
      <button onClick={onEdit}>
        <EditIcon height={16} width={16} className=' hover:text-primary' />
      </button>
      <button onClick={onDelete}>
        <DeleteIcon height={16} width={16} className='hover:text-red-500' />
      </button>
    </div>
  );
}

function formatDateTime(dateString: string): string {
  const date = new Date(dateString);

  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  };

  return new Intl.DateTimeFormat('en-US', options).format(date);
}
