import { CronJob } from 'cron';
import calendar from './googleCalendarAPI';
import sheets from './googleSheetsAPI';
import { calendar_v3 } from 'googleapis';
import weeklySync from '../scheduledMessages/weeklySync';
import announceEvent from '../scheduledMessages/announceEvent';
import Logging from '../library/Logging';

function runScheduler() {
    //write to google sheets every other hour
    new CronJob('0 0 */2 * * *', () => sheets.writeName, null, true);

    // daily refresh to fetch for upcoming events, and schedule them to run.
    new CronJob(
        '0 0 0 * * *',
        async () => {
            try {
                const events =
                    (await calendar.getNextEvents()) as calendar_v3.Schema$Event[];

                if (!events[0]) return;

                events.forEach((event: calendar_v3.Schema$Event) => {
                    let scheduledTime = new Date(
                        event.start!.dateTime as string
                    );
                    let announce = announceEvent;
                    if (event.summary === '💻 Weekly Sync') {
                        // sends the announcement 1 hour before
                        scheduledTime.setHours(scheduledTime.getHours() - 1);
                        announce = weeklySync;
                    } else {
                        // sends the event out 24 hours before it starts
                        scheduledTime.setDate(scheduledTime.getDate() - 1);
                    }
                    new CronJob(
                        scheduledTime,
                        async () => {
                            // refreshes the event to latest version if there are any changes
                            const refreshedEvent = await calendar.getEventById(
                                event.id!
                            );

                            if (!refreshedEvent) return;

                            announce(
                                refreshedEvent);
                        },
                        null,
                        true
                    );
                });
            } catch (e) {
                Logging.error(e);
            }
        },
        null,
        true
    );
}

export default runScheduler;
