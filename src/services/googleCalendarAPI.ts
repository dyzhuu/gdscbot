import { google } from 'googleapis';
import Logging from '../library/Logging';
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
  let timeMax = new Date();
  timeMax.setDate(timeMax.getDate() + 1);
  timeMax.setMinutes(timeMax.getMinutes() + 14);
  timeMin.setSeconds(59);

  const results = await calendar.events.list({
    auth,
    calendarId,
    timeMin: timeMin.toISOString(),
    timeMax: timeMax.toISOString()
  });

  // filters events by events that are not in the past (ignores recurring events)
  const events = results!.data.items!.filter(
    (event) =>
      event.summary !== '💻 Weekly Sync' &&
      new Date(event.start?.dateTime as string).getTime() > timeMin.getTime()
  );
  return events;
}

//fetches events 15 minutes within the next hour
async function getWeeklySync(): Promise<calendar_v3.Schema$Event | undefined> {
  let timeMin = new Date();
  timeMin.setHours(timeMin.getHours() + 1);
  timeMin.setSeconds(0);
  let timeMax = new Date();
  timeMax.setMinutes(timeMax.getMinutes() + 74);
  timeMin.setSeconds(59);

  const results = await calendar.events.list({
    auth,
    calendarId,
    timeMin: timeMin.toISOString(),
    timeMax: timeMax.toISOString()
  });

  // filters events by Weekly Syncs
  const events = results!.data.items!.filter(
    (event) => event.summary === '💻 Weekly Sync' && event.recurrence
  );
  if (!events.length) return;
  return events[0];
}

export default {
  getNextEvents,
  getWeeklySync
};
