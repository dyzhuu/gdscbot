import calendar from './services/googleCalendarAPI';
import { CronJob } from 'cron';
import Logging from './library/Logging';
import dotenv from 'dotenv';
import { randomUUID } from 'crypto';
dotenv.config();

const UUID = process.env.UUID || randomUUID();

async function createNotificationChannel() {
    try {
        await calendar.sendWatchRequest(UUID);
        let expiryTime = new Date();
        expiryTime.setDate(expiryTime.getDate() + 7);

        new CronJob(
            expiryTime,
            async () => await createNotificationChannel(),
            null,
            true
        );
    } catch (e) {
        Logging.error(e);
    }
}

createNotificationChannel();
