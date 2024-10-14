'use client';

import { useEffect, useRef, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { addHours, format, parseISO } from 'date-fns';
import { ScheduleXCalendar, useCalendarApp } from '@schedule-x/react';
import {
  viewWeek,
  viewDay,
  viewMonthGrid,
  viewMonthAgenda,
} from '@schedule-x/calendar';
import { createEventModalPlugin } from '@schedule-x/event-modal';
import { createDragAndDropPlugin } from '@schedule-x/drag-and-drop';
import { createCurrentTimePlugin } from '@schedule-x/current-time';
import { createEventsServicePlugin } from '@schedule-x/events-service';
import '@schedule-x/theme-default/dist/index.css';
import '@/app/lib/components/_scheduler/calendar.css';

import { EventForm } from '@/app/lib/types/Resources/CreateEventResource';
import { EventFormTypes } from '@/app/lib/types/Responses/events.types';
import { useAddEvent, useEvents } from '@/app/lib/hooks/api/events';
import generateEventTitles from '@/app/lib/utils/generateEventTitles';
import { useLeagueControlPanel } from '@/app/control-panel/_components/LeagueControlPanelProvider';
import EventModal from '@/app/lib/components/_scheduler/EventModal';
import { TimeGridEvent } from '@/app/lib/components/_scheduler/TimeGridEvent';
import { IconCalendar } from '@/app/lib/SVGs';
import EventFormModal from '@/app/lib/components/_scheduler/EventFormModal';

export default function LeagueCalendar() {
  const params = useParams();
  const searchParams = useSearchParams();

  const { leagueData, activeSeason, hasSeasons, isAdministrator } =
    useLeagueControlPanel();

  const selectedSeasonRef = useRef<number | null>(null);

  const [showEventCreationModal, setShowEventCreationModal] = useState(false);
  const [eventFormData, setEventFormData] = useState<EventForm | null>(null);
  const [formType, setFormType] = useState<EventFormTypes>('add');

  const [selectedDate, setSelectedDate] = useState(
    format(new Date(), 'yyyy-MM-dd')
  );

  const { events, status } = useEvents({
    date: selectedDate,
  });

  const addEventMutation = useAddEvent();

  useEffect(() => {
    const seasonParam = searchParams.get('season');
    selectedSeasonRef.current = seasonParam ? parseInt(seasonParam) : null;
  }, [searchParams]);

  const calendar = useCalendarApp({
    views: [viewDay, viewWeek, viewMonthGrid, viewMonthAgenda],
    defaultView: viewWeek.name,
    plugins: [
      createEventModalPlugin(),
      createDragAndDropPlugin(),
      createCurrentTimePlugin(),
      createEventsServicePlugin(),
    ],
    events: events,
    callbacks: {
      onClickDateTime: (dateTime) => {
        if (!activeSeason || activeSeason.id !== selectedSeasonRef.current) {
          return;
        }

        setFormType('add');

        const [start_date, start_time] = dateTime.split(' ');

        const dateObj = parseISO(dateTime.replace(' ', 'T'));
        const newDateObj = addHours(dateObj, 1);

        const end_date = format(newDateObj, 'yyyy-MM-dd');
        const end_time = format(newDateObj, 'HH:mm');

        setEventFormData({
          title: generateEventTitles({
            eventType: isAdministrator() ? 'game' : 'practice',
            teamNames: [], //todo: grab from filter/state
          }),
          description: '',
          start_date: new Date(start_date + 'T00:00:00'),
          start_time,
          event_type: isAdministrator() ? 'game' : 'practice',
          end_date: new Date(end_date + 'T00:00:00'),
          end_time,
          location: '',
          notes: '',
          teams: [], //todo: grab from filter/state
          lockedTeams: [], //todo: grab from filter/state
          recurrence_type: 'none',
          recurrence_interval: 1,
          recurrence_end: null,
        } as EventForm);
        setShowEventCreationModal(true);
      },
      onEventClick: () => {
        setFormType('edit');
      },

      onSelectedDateUpdate(date) {
        setSelectedDate(date);
      },
    },
  });

  useEffect(() => {
    if (calendar) {
      events && calendar?.events.set(events);
    }
  }, [calendar, events]);

  const EventModalWrapper = (props: any) => {
    const eventFormData = props.calendarEvent;
    return (
      <EventModal
        calendarEvent={eventFormData}
        onEditFormSubmit={async (calendarEvent) => {
          const [start_date, start_time] = calendarEvent.start.split(' ');
          const [end_date, end_time] = calendarEvent.end.split(' ');

          setEventFormData({
            title: calendarEvent.title,
            description: calendarEvent.description,
            start_date: new Date(start_date + 'T00:00:00'),
            start_time,
            event_type: calendarEvent.event_type,
            end_date: new Date(end_date + 'T00:00:00'),
            end_time,
            location: calendarEvent.location,
            teams: calendarEvent.teams.map((team) => team),
            lockedTeams: calendarEvent.teams,
            recurrence_type: 'none',
            recurrence_interval: 1,
            recurrence_end: null,
          });

          setShowEventCreationModal(true);
        }}
        onDeleteEvent={async (eventID: number) => {
          if (addEventMutation.isLoading) return;

          //TODO: implement delete calendar event
          console.log('deleting:', eventID);
        }}
      />
    );
  };

  return (
    <div>
      <div className='sx-react-calendar-wrapper p-8'>
        {hasSeasons ? (
          <ScheduleXCalendar
            calendarApp={calendar}
            customComponents={{
              timeGridEvent: TimeGridEvent,
              eventModal: (props) => <EventModalWrapper {...props} />,
            }}
          />
        ) : (
          <div className='flex flex-col items-center space-y-2 rounded-[8px] border border-[#c4c7c5] py-[100px] text-center text-lg font-medium'>
            <IconCalendar height={44} width={44} />

            <div>
              <span className='font-bold'>{leagueData.league_info.name}</span>{' '}
              Visit the season page to activate a season
            </div>
          </div>
        )}
      </div>

      {showEventCreationModal && eventFormData ? (
        <EventFormModal
          isOpen={showEventCreationModal}
          close={() => {
            setEventFormData(null);
            setShowEventCreationModal(false);
          }}
          eventFormData={eventFormData}
          onSubmit={async (saveValues) => {
            if (addEventMutation.isLoading) return;

            //TODO: set this up
            const res = addEventMutation.mutateAsync(saveValues);

            setEventFormData(null);
            setShowEventCreationModal(false);
          }}
          formType={formType}
        />
      ) : null}
    </div>
  );
}
