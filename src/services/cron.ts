import { CronJob } from 'cron';
import calendar from './googleCalendarAPI';
import sheets from './googleSheetsAPI';
import { calendar_v3 } from 'googleapis';
import weeklySync from '../scheduledMessages/weeklySync';
import announceEvent from '../scheduledMessages/announceEvent';
import Logging from '../library/Logging';

export const eventsCronJob = async () => {
  try {
    const events = await calendar.getNextEvents();

    if (!events.length) return;

    events.forEach((event: calendar_v3.Schema$Event) => {
      announceEvent(event);
    });
  } catch (e) {
    Logging.error(e);
  }
};

export const syncCronJob = async () => {
  try {
    const event = await calendar.getWeeklySync();

    if (!event) return;

    let originalStartTime = new Date(event.start!.dateTime as string);

    const meetingTime = new Date();
    meetingTime.setHours(
      originalStartTime.getHours(),
      originalStartTime.getMinutes()
    );

    const delay = Date.now() - meetingTime.getTime();

    setTimeout(weeklySync, Math.min(0, delay));
  } catch (e) {
    Logging.error(e);
  }
};

function runCron() {
  //updates local sheets cache every 6 hours
  new CronJob('0 */6 * * *', () => sheets.writeName, null, true);

  // quarter hourly refresh to fetch for upcoming events, and schedule them to run.
  // new CronJob(
  //   '*/15 * * * *', // runs every 15 minutes
  //   eventsCronJob,
  //   null,
  //   true
  // );

  // quarter hourly refresh to fetch for weekly syncs.
  new CronJob(
    '*/15 * * * *', // runs every 15 minutes
    syncCronJob,
    null,
    true
  );
}

export default runCron;
