export interface CountdownValues {
  distance: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const londonDateTime = new Intl.DateTimeFormat('en-GB', {
  timeZone: 'Europe/London',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hourCycle: 'h23',
});

const targetLondonWallClock = Date.UTC(2027, 0, 29, 16, 0, 0);

function getLondonWallClockTime(date: Date): number {
  const parts = Object.fromEntries(
    londonDateTime
      .formatToParts(date)
      .map(({ type, value }) => [type, value]),
  );

  return Date.UTC(
    Number(parts.year),
    Number(parts.month) - 1,
    Number(parts.day),
    Number(parts.hour),
    Number(parts.minute),
    Number(parts.second),
    date.getUTCMilliseconds(),
  );
}

export function getCountdownValues(now = new Date()): CountdownValues {
  const distance = Math.max(
    0,
    targetLondonWallClock - getLondonWallClockTime(now),
  );

  return {
    distance,
    days: Math.floor(distance / 86_400_000),
    hours: Math.floor((distance % 86_400_000) / 3_600_000),
    minutes: Math.floor((distance % 3_600_000) / 60_000),
    seconds: Math.floor((distance % 60_000) / 1_000),
  };
}
