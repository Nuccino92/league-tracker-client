type TimeOption = {
  label: string;
  value: string;
};

function generateTimeOptions(): TimeOption[] {
  const times: TimeOption[] = [];
  let currentTime = new Date('1970-01-01T00:00:00'); // Starting from 12:00 AM (midnight)

  while (currentTime.getDate() === 1) {
    const hours = currentTime.getHours();
    const minutes = currentTime.getMinutes();
    const isAM = hours < 12;

    const formattedHours = hours % 12 || 12; // Convert to 12-hour format
    const formattedMinutes = minutes.toString().padStart(2, '0');
    const period = isAM ? 'AM' : 'PM';

    const label = `${formattedHours}:${formattedMinutes} ${period}`;
    const value = `${hours.toString().padStart(2, '0')}:${formattedMinutes}`;

    times.push({ label, value });

    // Increment by 15 minutes
    currentTime.setMinutes(currentTime.getMinutes() + 15);
  }

  return times;
}

export function findNearestTimeOption(
  time: string,
  timeOptions: TimeOption[]
): TimeOption | undefined {
  const [inputHours, inputMinutes] = time.split(':').map(Number);
  const totalMinutes = inputHours * 60 + inputMinutes;

  const roundedMinutes = Math.round(totalMinutes / 15) * 15;

  const roundedHours = Math.floor(roundedMinutes / 60);
  const roundedMinutesPastHour = roundedMinutes % 60;

  const roundedTimeValue = `${roundedHours.toString().padStart(2, '0')}:${roundedMinutesPastHour.toString().padStart(2, '0')}`;

  return timeOptions.find((option) => option.value === roundedTimeValue);
}

export default generateTimeOptions;
