import { CronJob } from 'cron';
import calendar from '../services/googleCalendarAPI';
import sheets from '../services/googleSheetsAPI';
import { calendar_v3 } from 'googleapis';
import weeklySync from './weeklySync';
import announceEvent from './announceEvent';

export default function runScheduler() {
    //write to google sheets
    new CronJob('0 0 * * * *', () => sheets.writeName, null, true);

    // weeklySync
    new CronJob('0 30 18 * * 4', () => weeklySync(), null, true);

    // daily refresh for events
    new CronJob(
        '0 0 0 * * *',
        async () => {
            const events =
                (await calendar.getNextEvents()) as calendar_v3.Schema$Event[];
            if (!events[0]) {
                return;
            }
            console.log(events);
            events.forEach((event: calendar_v3.Schema$Event) => {
                new CronJob(
                    new Date(event.start!.dateTime as string),
                    () => announceEvent(event),
                    null,
                    true
                );
            });
        },
        null,
        true
    );
}
