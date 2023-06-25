import calendar from './services/googleCalendarAPI';
import { CronJob } from 'cron';
import Logging from './library/Logging';
import config from './config';

const UUID = config.UUID;

async function createNotificationChannel() {
    try {
        await calendar.sendWatchRequest(UUID)
        let expiryTime = new Date()
        expiryTime.setDate(expiryTime.getDate() + 7)

        new CronJob(
            expiryTime,
            async () => await createNotificationChannel(),
            null,
            true
        );
        
        // TODO: decide between the two
        // new CronJob(
        //     '0 9 22 */7 * *',
        //     async () => await calendar.sendWatchRequest(UUID),
        //     null,
        //     true
        // );
    } catch (e) {
        Logging.error(e)
    }
}

createNotificationChannel()