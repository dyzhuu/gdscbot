import { CronJob } from 'cron';
import calendar from './googleCalendarAPI';
import sheets from './googleSheetsAPI';
import { calendar_v3 } from 'googleapis';
import weeklySync from '../scheduledMessages/weeklySync';
import announceEvent from '../scheduledMessages/announceEvent';

export default function runScheduler() {
    //write to google sheets every hour
    new CronJob('0 0 * * * *', () => sheets.writeName, null, true);

    // weeklySync notification at 6:30pm every Thursday
    new CronJob('0 30 18 * * 4', () => weeklySync(), null, true);

    // daily refresh to fetch for upcoming events, and schedule them to run.
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
                let dayBefore = new Date(event.start!.dateTime as string)
                dayBefore.setDate(dayBefore.getDate() - 1);
                new CronJob(dayBefore, () => announceEvent(event), null, true);
            });
        },
        null,
        true
    );
}
