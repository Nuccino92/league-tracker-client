import classNames from 'classnames';
import {
  IconBxFootball,
  IconPeopleGroup,
  IconBxCustomize,
  LocationIcon,
} from '@/app/lib/SVGs';
import { CalendarEvent } from '@/app/lib/types/Models/CalendarEvent';
import {
  SPORT_EVENT_BACKGROUND_COLOR,
  PRACTICE_EVENT_BACKGROUND_COLOR,
  CUSTOM_EVENT_BACKGROUND_COLOR,
} from '@/app/lib/globals/styles';

type Props = {
  calendarEvent: CalendarEvent;
};

export function TimeGridEvent({ calendarEvent }: Props) {
  return (
    <div className='h-full'>
      {calendarEvent.event_type === 'game' ? (
        <GameView calendarEvent={calendarEvent} />
      ) : null}

      {calendarEvent.event_type === 'practice' ? (
        <PracticeView calendarEvent={calendarEvent} />
      ) : null}

      {calendarEvent.event_type === 'custom_event' ? (
        <CustomView calendarEvent={calendarEvent} />
      ) : null}
    </div>
  );
}

function GameView({ calendarEvent }: Props) {
  const isGameLongerThan15Minutes = isEventLongerThanXMinutes(
    calendarEvent.start,
    calendarEvent.end,
    15
  );

  const isGameLongerThan30Minutes = isEventLongerThanXMinutes(
    calendarEvent.start,
    calendarEvent.end,
    30
  );

  return (
    <div
      className={classNames(
        //   SPORT_EVENT_BACKGROUND_COLOR,
        isGameLongerThan15Minutes ? 'py-2' : '',
        'relative h-full space-y-2 rounded-md bg-primary px-2 pr-5 text-white'
      )}
    >
      <div className='flex font-medium leading-4'>
        <span
          className={classNames(
            isGameLongerThan15Minutes ? 'm-2' : 'mx-1',
            'absolute right-0 top-0'
          )}
        >
          <IconBxFootball height={16} width={16} />
        </span>
        <span
          className={classNames(
            isGameLongerThan15Minutes && !isGameLongerThan30Minutes
              ? 'truncate'
              : ''
          )}
        >
          {calendarEvent.title}
        </span>
      </div>

      {calendarEvent.location ? (
        <div className='flex items-center space-x-1 text-xs'>
          <LocationIcon />
          <span className='truncate'>{calendarEvent.location}</span>
        </div>
      ) : null}
    </div>
  );
}

function PracticeView({ calendarEvent }: Props) {
  const isPracticeLongerThan15Minutes = isEventLongerThanXMinutes(
    calendarEvent.start,
    calendarEvent.end,
    15
  );

  const isPracticeLongerThan30Minutes = isEventLongerThanXMinutes(
    calendarEvent.start,
    calendarEvent.end,
    30
  );

  return (
    <div
      className={classNames(
        //  PRACTICE_EVENT_BACKGROUND_COLOR,
        isPracticeLongerThan15Minutes ? 'py-2' : '',
        'relative h-full space-y-2 rounded-md bg-secondary px-2 pr-5 text-white'
      )}
    >
      <div className='flex font-medium leading-4'>
        <span
          className={classNames(
            isPracticeLongerThan15Minutes ? 'm-2' : 'mx-1',
            'absolute right-0 top-0'
          )}
        >
          <IconPeopleGroup height={16} width={16} />
        </span>
        <span
          className={classNames(
            isPracticeLongerThan15Minutes && !isPracticeLongerThan30Minutes
              ? 'truncate'
              : ''
          )}
        >
          {calendarEvent.title}
        </span>
      </div>

      {calendarEvent.location ? (
        <div className='flex items-center space-x-1 text-xs'>
          <LocationIcon />
          <span className='truncate'>{calendarEvent.location}</span>
        </div>
      ) : null}
    </div>
  );
}

function CustomView({ calendarEvent }: Props) {
  const isPracticeLongerThan15Minutes = isEventLongerThanXMinutes(
    calendarEvent.start,
    calendarEvent.end,
    15
  );

  const isPracticeLongerThan30Minutes = isEventLongerThanXMinutes(
    calendarEvent.start,
    calendarEvent.end,
    30
  );

  return (
    <div
      className={classNames(
        //  CUSTOM_EVENT_BACKGROUND_COLOR,
        isPracticeLongerThan15Minutes ? 'py-2' : '',
        'relative h-full space-y-2 rounded-md bg-gray-500 px-2 pr-5 text-white'
      )}
    >
      <div className='flex pr-2 font-medium leading-4'>
        <span
          className={classNames(
            isPracticeLongerThan15Minutes ? 'm-2' : 'mx-1',
            'absolute right-0 top-0'
          )}
        >
          <IconBxCustomize height={16} width={16} />
        </span>
        <span
          className={classNames(
            isPracticeLongerThan15Minutes && !isPracticeLongerThan30Minutes
              ? 'truncate'
              : ''
          )}
        >
          {calendarEvent.title}
        </span>
      </div>

      {calendarEvent.location ? (
        <div className='flex items-center space-x-1 text-xs'>
          <LocationIcon />
          <span className='truncate'>{calendarEvent.location}</span>
        </div>
      ) : null}
    </div>
  );
}

function isEventLongerThanXMinutes(
  start: string,
  end: string,
  minutes: number
): boolean {
  const startTime = new Date(start);
  const endTime = new Date(end);

  const durationInMinutes =
    (endTime.getTime() - startTime.getTime()) / (1000 * 60);

  return durationInMinutes > minutes;
}
