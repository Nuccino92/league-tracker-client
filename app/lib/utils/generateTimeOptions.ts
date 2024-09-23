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

export function roundToClosestTime(
  dateTimeString: string,
  timeOptions: TimeOption[]
): TimeOption | null {
  const date = new Date(dateTimeString);
  const minutes = date.getMinutes();
  const roundedMinutes = Math.round(minutes / 15) * 15; // Round to the nearest 15 minutes
  const roundedHours = date.getHours() + Math.floor(roundedMinutes / 60);

  const finalHours = roundedHours % 24; // Ensure the hour is within a 24-hour format
  const finalMinutes = roundedMinutes % 60; // Ensure minutes are between 0-59

  // Format the value as HH:mm
  const roundedTimeValue = `${finalHours.toString().padStart(2, '0')}:${finalMinutes.toString().padStart(2, '0')}`;

  // Find the closest time option
  const closestOption =
    timeOptions.find((option) => option.value === roundedTimeValue) || null;

  return closestOption;
}

export default generateTimeOptions;
