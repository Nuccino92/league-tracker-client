import { CalendarEvent } from '../../types/Models/CalendarEvent';

type Props = {
  calendarEvent: CalendarEvent;
};

export function TimeGridEvent({ calendarEvent }: Props) {
  //TODO: customize based on even type

  console.log('rednderd', calendarEvent);
  // TODO: get full height
  return (
    <div className='h-full bg-red-500'>
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
  return <div className='h-full bg-green-300'>gametime</div>;
}

function PracticeView({ calendarEvent }: Props) {
  return <div className='h-full bg-red-300'>prac time</div>;
}

function CustomView({ calendarEvent }: Props) {
  return <div className='h-full bg-blue-300'>custom time</div>;
}
