import { google } from 'googleapis';
import config from '../config';
import { calendar_v3 } from 'googleapis';

const calendarId: string = config.CALENDAR_ID;
const auth = new google.auth.JWT({
  keyFile: 'credentials.json',
  scopes: 'https://www.googleapis.com/auth/calendar'
});
const calendar = google.calendar({ version: 'v3', auth });

//fetches events from a 15 minute window tomorrow
async function getNextEvents(): Promise<calendar_v3.Schema$Event[]> {
  let timeMin = new Date();
  timeMin.setDate(timeMin.getDate() + 1);
  timeMin.setSeconds(0);
  timeMin.setMilliseconds(0);
  let timeMax = new Date();
  timeMax.setDate(timeMax.getDate() + 1);
  timeMax.setMinutes(timeMax.getMinutes() + 15);
  timeMax.setSeconds(0);

  const results = await calendar.events.list({
    auth,
    calendarId,
    timeMin: timeMin.toISOString(),
    timeMax: timeMax.toISOString()
  });
  // filters events by events that are not in the past (ignores recurring events)
  const events = results!.data.items!.filter(
    (event: calendar_v3.Schema$Event) =>
      event.summary !== '💻 Weekly Sync' &&
      new Date(event.start?.dateTime as string).getTime() >= timeMin.getTime()
  );
  return events;
}

//fetches events 15 minutes within the next hour
async function getWeeklySync(): Promise<calendar_v3.Schema$Event | undefined> {
  let timeMin = new Date();
  timeMin.setHours(timeMin.getHours() + 1);
  timeMin.setSeconds(0);
  let timeMax = new Date();
  timeMax.setMinutes(timeMax.getMinutes() + 75);
  timeMin.setSeconds(0);

  const results = await calendar.events.list({
    auth,
    calendarId,
    timeMin: timeMin.toISOString(),
    timeMax: timeMax.toISOString()
  });

  const minMinutes = timeMin.getHours() * 60 + timeMin.getMinutes();

  // filters events by Weekly Syncs
  const events = results!.data.items!.filter(
    (event: calendar_v3.Schema$Event) => {
      let eventTime = new Date(event.start?.dateTime as string);

      if (event.originalStartTime?.dateTime)
        eventTime = new Date(event.originalStartTime.dateTime);

      return (
        event.summary === '💻 Weekly Sync' &&
        event.status === 'confirmed' &&
        eventTime.getHours() * 60 + eventTime.getMinutes() >= minMinutes
      ); // event time must be after current time.
    }
  );

  const idsToIgnore = results!.data.items!.reduce(
    (acc: Array<string>, event: calendar_v3.Schema$Event) => {
      if (!!event.originalStartTime && event.recurringEventId) {
        acc.push(event.recurringEventId);
      }
      return acc;
    },
    new Array()
  );

  const filteredEvents = events.filter(
    (e: calendar_v3.Schema$Event) =>
      !(e.recurrence && !!e.id && idsToIgnore.includes(e.id))
  );

  if (!filteredEvents.length) return;
  return filteredEvents[0];
}

export default {
  getNextEvents,
  getWeeklySync
};
