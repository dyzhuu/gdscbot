import { google } from 'googleapis';
import Logging from '../library/Logging';
import config from '../config';
import { delayCreationAnnouncement } from './scheduler';

const calendarId: string = config.CALENDAR_ID;
const auth = new google.auth.JWT({
  keyFile: 'credentials.json',
  scopes: 'https://www.googleapis.com/auth/calendar'
});
const calendar = google.calendar({ version: 'v3', auth });

// creates notification channel for webhooks
async function sendWatchRequest(UUID: string) {
  try {
    const time = new Date();

    const response = await calendar.events.watch({
      calendarId,
      requestBody: {
        id: UUID,
        type: 'web_hook',
        address: `${config.URL}/hook`
      }
    });
    Logging.info(`Notification channel successfully created`);
    Logging.info(response!.data);
    return response.data;
  } catch (e) {
    Logging.error(e);
  }
}

// stops notification channel
async function stopChannel(id: string, resourceId: string) {
  await calendar.channels.stop({
    requestBody: {
      id,
      resourceId
    }
  });
}

// creates announcement if new event is created (called by webhook)
async function processEventUpdates() {
  try {
    const result = await calendar.events.list({
      auth,
      calendarId,
      timeMin: new Date().toISOString()
      // syncToken,
    });
    const event = result!.data.items!.filter(
      (x) => Date.parse(x.created!) > new Date().getTime() - 10000
    )[0];
    if (!event) {
      return;
    }

    Logging.info(`Event added: ${event.summary}`);

    delayCreationAnnouncement(event);
  } catch (e) {
    Logging.error(e);
  }
}

//fetches events from a one hour window tomorrow
async function getNextEvents() {
  let timeMin = new Date();
  timeMin.setDate(timeMin.getDate() + 1);
  let timeMax = new Date();
  timeMax.setHours(timeMax.getHours() + 25);

  const results = await calendar.events.list({
    auth,
    calendarId,
    timeMin: timeMin.toISOString(),
    timeMax: timeMax.toISOString()
  });

  // removes event if already added
  const events = results!.data.items!.filter(
    (event) =>
      new Date(event.start?.dateTime as string).getTime() > timeMin.getTime() ||
      event.recurrence
  );
  return events;
}

// gets and returns an event by id (limited to next two days)
async function getEventById(id: string) {
  try {
    let dayAfter = new Date();
    dayAfter.setDate(dayAfter.getDate() + 2);

    const results = await calendar.events.list({
      auth,
      calendarId,
      timeMin: new Date().toISOString(),
      timeMax: dayAfter.toISOString()
    });

    const event = results!.data.items!.filter((event) =>
      event.id!.includes(id)
    );

    // if no id found, or duplicate id's (meaning a cancelled event entry) for recurring event
    if (event.length !== 1) {
      return;
    }
    return event[0];
  } catch (e) {
    Logging.error(e);
  }
}

export default {
  sendWatchRequest,
  stopChannel,
  processEventUpdates,
  getNextEvents,
  getEventById
};
