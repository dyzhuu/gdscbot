import { google } from 'googleapis';
import Logging from '../library/Logging';
import fs from 'fs';
import config from '../config';

const calendarId: string = config.CALENDAR_ID;
const auth = new google.auth.JWT({
    keyFile: 'credentials.json',
    scopes: 'https://www.googleapis.com/auth/calendar'
});
const calendar = google.calendar({ version: 'v3', auth });

export async function sendWatchRequest(UUID: string) {
    const response = await calendar.events.watch(
        {
            calendarId,
            requestBody: {
                id: UUID,
                type: 'web_hook',
                address: `${config.URL}/hook`
            }
        },
        (e, res) => {
            if (e) {
                Logging.error(e);
                return;
            }
            Logging.info(res?.data);
            Logging.info(
                `Notification channel successfully created (remember ID and resourceId !)`
            );
        }
    );
}

export async function stopChannel(id: string, resourceId: string) {
    await calendar.channels.stop({
        requestBody: {
            id,
            resourceId
        }
    })
}

export async function UpdateServer() {

}

export async function listCreatedEvents() {
    let syncToken;
    if (fs.existsSync('syncToken.txt')) {
        syncToken = fs.readFileSync('syncToken.txt').toString();
    }
    await calendar.events.list(
        {
            auth,
            calendarId,
            syncToken
            // maxResults: 10,
            // singleEvents: true,
            // orderBy: 'startTime'
        },
        (e, res) => {
            if (e) {
                Logging.error(e);
                return;
            }
            const event = res!.data.items!.filter(
                (x) => Date.parse(x.created!) > new Date().valueOf() - 10000
            )[0];
            const nextSyncToken = res!.data.nextSyncToken as string;
            fs.writeFileSync('syncToken.txt', nextSyncToken);
            if (!event) {
                return;
            }
            Logging.info(event.summary);
        }
    );
}
