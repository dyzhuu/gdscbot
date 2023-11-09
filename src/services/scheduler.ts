import { CronJob } from 'cron';
import calendar from './googleCalendarAPI';
import sheets from './googleSheetsAPI';
import { calendar_v3 } from 'googleapis';
import weeklySync from '../scheduledMessages/weeklySync';
import announceEvent from '../scheduledMessages/announceEvent';
import Logging from '../library/Logging';

function runScheduler() {
  //updates local sheets cache every 6 hours
  new CronJob('0 */6 * * *', () => sheets.writeName, null, true);

  // quarter hourly refresh to fetch for upcoming events, and schedule them to run.
  new CronJob(
    '*/15 * * * *', // runs every 15 minutes
    async () => {
      try {
        const events = await calendar.getNextEvents();

        if (!events.length) return;

        events.forEach((event: calendar_v3.Schema$Event) => {
          let scheduledTime = new Date(event.start!.dateTime as string);
          // calculates the time to send out the message based on the start time of weekly recurring events
          announceEvent(event);

          if (event.summary === '💻 Weekly Sync') {
            // sends the announcement 1 hour before
            scheduledTime.setHours(scheduledTime.getHours() - 1);
          } else {
            // sends the event out 24 hours before it starts
            scheduledTime.setDate(scheduledTime.getDate() - 1);
          }
        });
      } catch (e) {
        Logging.error(e);
      }
    },
    null,
    true
  );

  // quarter hourly refresh to fetch for weekly syncs.
  new CronJob(
    '*/15 * * * *', // runs every 15 minutes
    async () => {
      try {
        const event = await calendar.getWeeklySync();

        if (!event) return;

        let scheduledTime = new Date(event.start!.dateTime as string);

        const weeksPassed = Math.floor(
          (new Date().getTime() - scheduledTime.getTime()) /
            (7 * 24 * 60 * 60 * 1000)
        );
        scheduledTime = new Date(
          scheduledTime.getTime() + (weeksPassed + 1) * 7 * 24 * 60 * 60 * 1000
        );

        weeklySync(event, scheduledTime);
      } catch (e) {
        Logging.error(e);
      }
    },
    null,
    true
  );
}

export default runScheduler;
