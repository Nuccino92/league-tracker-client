import { CalendarEvent } from '../../types/Models/CalendarEvent';

type Props = {
  calendarEvent: CalendarEvent;
};

export default function EventModal({ calendarEvent }: Props) {
  return (
    <>
      {calendarEvent.event_type === 'game' ? (
        <GameView calendarEvent={calendarEvent} />
      ) : null}

      {calendarEvent.event_type === 'practice' ? (
        <PracticeView calendarEvent={calendarEvent} />
      ) : null}

      {calendarEvent.event_type === 'custom_event' ? (
        <CustomView calendarEvent={calendarEvent} />
      ) : null}
    </>
  );
}

function GameView({ calendarEvent }: Props) {
  return <div className='border-4'>gametime WHERE THE FUCK AM I</div>;
}

function PracticeView({ calendarEvent }: Props) {
  return <div>prac time</div>;
}

function CustomView({ calendarEvent }: Props) {
  return <div>custom time</div>;
}
