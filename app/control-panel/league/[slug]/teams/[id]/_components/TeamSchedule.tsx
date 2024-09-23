'use client';

import { ScheduleXCalendar, useNextCalendarApp } from '@schedule-x/react';

import {
  viewWeek,
  viewDay,
  viewMonthGrid,
  viewMonthAgenda,
} from '@schedule-x/calendar';

import { createEventsServicePlugin } from '@schedule-x/events-service';
import { createEventModalPlugin } from '@schedule-x/event-modal';
import { createDragAndDropPlugin } from '@schedule-x/drag-and-drop';
import { createCurrentTimePlugin } from '@schedule-x/current-time';

import '@schedule-x/theme-default/dist/index.css';
import { TimeGridEvent } from '@/app/lib/components/_scheduler/TimeGridEvent';
import EventModal from '@/app/lib/components/_scheduler/EventModal';
import { CalendarEvent } from '@/app/lib/types/Models/CalendarEvent';
import { useState } from 'react';
import EventFormModal from '@/app/lib/components/_scheduler/EventFormModal';
import { EventForm } from '@/app/lib/types/Resources/CreateEventResource';
import { useGetEvents } from '@/app/lib/hooks/api/events';
import { Spinner } from '@/app/lib/SVGs';

/**
 *
 * @returns
 *
 * schedule guidlines
 *
 *
 *
 * have it display each week (start with active)
 * has the sidebar display every teams logo for that season (left side), clicking one focuses (filters) the team
 * on the top have a season dropdown where it defaults to the active season, if league has no active season then default to the most recent
 * if this team is not in the season just leave the blank schedule w/ nothing on the left sidebar
 * if the league doesnt have any seasons display custom message/icon saying there are no seasons (substitute the calendar)
 * can only edit the active season, other seasons are readonly
 * have games as a special tile, cannot edit these if already played (delete, move, anything)
 */

type Props = {
  slug: string;
};

export default function TeamSchdule({ slug }: Props) {
  const { events, status } = useGetEvents(slug);

  return (
    <>
      {events && status === 'success' ? (
        <TeamCalendarProxy events={events} />
      ) : null}

      {status === 'loading' ? (
        <div>
          <div className='flex items-center space-x-6 border-b p-8 text-xl font-bold'>
            <div className='text-xl font-bold'>Team Schedule</div>
          </div>
          <div className='sx-react-calendar-wrapper flex items-center justify-center p-8'>
            <Spinner height={30} width={30} />
          </div>
        </div>
      ) : null}
    </>
  );
}

function TeamCalendarProxy({ events }: { events: CalendarEvent[] }) {
  const [showEventCreationModal, setShowEventCreationModal] = useState(false);
  const [eventFormData, setEventFormData] = useState<EventForm | null>(null);

  const calendar = useNextCalendarApp({
    views: [viewDay, viewWeek, viewMonthGrid, viewMonthAgenda],
    defaultView: viewWeek.name,
    plugins: [
      createEventModalPlugin(),
      createDragAndDropPlugin(),
      createCurrentTimePlugin(),
    ],
    events: events,
    callbacks: {
      onClickDateTime: (dateTime) => {
        //TODO: use date time and generate a object for even form
        setEventFormData({} as EventForm);
        setShowEventCreationModal(true);
      },
      onEventClick: (event) => {
        console.log(event);
      },
    },
  });

  return (
    <>
      <div>
        <div className='flex items-center space-x-6 border-b p-8 text-xl font-bold'>
          <div className='text-xl font-bold'>Team Schedule</div>
        </div>
        <div className='sx-react-calendar-wrapper p-8'>
          <ScheduleXCalendar
            calendarApp={calendar}
            customComponents={{
              timeGridEvent: TimeGridEvent,
              eventModal: EventModal,
            }}
          />
        </div>
      </div>

      {showEventCreationModal && eventFormData ? (
        <EventFormModal
          isOpen={showEventCreationModal}
          onClose={() => {
            setEventFormData(null);
            setShowEventCreationModal(false);
          }}
          eventFormData={eventFormData}
          onCreate={() => {
            // https://schedule-x.dev/docs/calendar/plugins/events-service
            // eventsServicePlugin.add({
            //   title: 'Event 1',
            //   start: '2024-04-20',
            //   end: '2024-04-20',
            //   id: 1
            // })

            setEventFormData(null);
            setShowEventCreationModal(false);
          }}
        />
      ) : null}
    </>
  );
}
