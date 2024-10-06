'use client';

import { useEffect, useRef, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { addHours, format, parseISO } from 'date-fns';
import { ScheduleXCalendar, useNextCalendarApp } from '@schedule-x/react';
import {
  viewWeek,
  viewDay,
  viewMonthGrid,
  viewMonthAgenda,
} from '@schedule-x/calendar';
import '@schedule-x/theme-default/dist/index.css';
import { createEventsServicePlugin } from '@schedule-x/events-service';
import { createEventModalPlugin } from '@schedule-x/event-modal';
import { createDragAndDropPlugin } from '@schedule-x/drag-and-drop';
import { createCurrentTimePlugin } from '@schedule-x/current-time';

import { TimeGridEvent } from '@/app/lib/components/_scheduler/TimeGridEvent';
import EventModal from '@/app/lib/components/_scheduler/EventModal';
import { CalendarEvent } from '@/app/lib/types/Models/CalendarEvent';
import EventFormModal from '@/app/lib/components/_scheduler/EventFormModal';
import { EventForm } from '@/app/lib/types/Resources/CreateEventResource';
import { useDeleteEvent, useGetEvents } from '@/app/lib/hooks/api/events';
import { IconCalendar, Spinner } from '@/app/lib/SVGs';
import { useTeam } from '@/app/lib/hooks/api/control-panel/teams';
import { useLeagueControlPanel } from '@/app/control-panel/_components/LeagueControlPanelProvider';
import { EventFormTypes } from '@/app/lib/types/Responses/events.types';
import generateEventTitles from '@/app/lib/utils/generateEventTitles';

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

/**
 * If the team is involved in the season, display the schedule. Only allow editing if they are in the active season
 *
 * if no season is selected then display message to select season if the league actually has seasons. if they are not involved in a selected season then display message saying that this team isnt involved in the selected season
 */

/**
 *
 * possibly create another parent branch to check if team is involved in season
 */

export default function TeamSchdule({ slug }: Props) {
  const { events, status } = useGetEvents(slug);

  return (
    <>
      {events && status === 'success' ? (
        <TeamCalendarProxy events={events} slug={slug} />
      ) : null}

      {status === 'loading' ? (
        <div>
          <div className='sx-react-calendar-wrapper flex items-center justify-center p-8 py-14'>
            <Spinner height={30} width={30} />
          </div>
        </div>
      ) : null}
    </>
  );
}

function TeamCalendarProxy({
  events,
  slug,
}: { events: CalendarEvent[] } & Props) {
  const params = useParams();
  const searchParams = useSearchParams();

  const { leagueData, activeSeason, hasSeasons, isAdministrator } =
    useLeagueControlPanel();

  const { team, status } = useTeam({
    slug: slug,
    teamId: parseInt(params.id as string),
  });

  const [showEventCreationModal, setShowEventCreationModal] = useState(false);
  const [eventFormData, setEventFormData] = useState<EventForm | null>(null);
  const [formType, setFormType] = useState<EventFormTypes>('add');

  //Might have to Re-initialize the Calendar on Search Param Change & fetching new calendar events
  const selectedSeasonRef = useRef<number | null>(null);

  useEffect(() => {
    const seasonParam = searchParams.get('season');
    selectedSeasonRef.current = seasonParam ? parseInt(seasonParam) : null;
  }, [searchParams]);

  const calendar = useNextCalendarApp({
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
        if (!team) return;

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
            teamNames: [team.name],
          }),
          description: '',
          start_date: new Date(start_date + 'T00:00:00'),
          start_time,
          event_type: isAdministrator() ? 'game' : 'practice',
          end_date: new Date(end_date + 'T00:00:00'),
          end_time,
          location: '',
          notes: '',
          teams: [team],
          lockedTeams: [{ id: team.id, name: team.name }],
        } as EventForm);
        setShowEventCreationModal(true);
      },
      onEventClick: (event) => {
        setFormType('edit');
        console.log(event);
      },
      onSelectedDateUpdate(date) {
        //TODO: have to refetch with this date
        console.log('date', date);
      },
    },
  });

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
          });

          setShowEventCreationModal(true);
        }}
        onDeleteEvent={async (eventID: number) => {
          //TODO: implement delete calendar event
          console.log('deleting:', eventID);
        }}
      />
    );
  };

  return (
    <>
      {team && status === 'success' ? (
        <>
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
                    <span className='font-bold'>
                      {leagueData.league_info.name}
                    </span>{' '}
                    does not have an active season
                  </div>
                </div>
              )}
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
              onSubmit={(saveValues) => {
                // https://schedule-x.dev/docs/calendar/plugins/events-service
                // eventsServicePlugin.add({
                //   title: 'Event 1',
                //   start: '2024-04-20',
                //   end: '2024-04-20',
                //   id: 1
                // })

                //TEST

                console.log('saveValues', saveValues);

                const allev = calendar?.events.getAll();

                console.log('events plugin call', allev);

                setEventFormData(null);
                setShowEventCreationModal(false);
              }}
              formType={formType}
            />
          ) : null}
        </>
      ) : null}
    </>
  );
}
