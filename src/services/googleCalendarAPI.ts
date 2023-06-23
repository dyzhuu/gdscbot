import { calendar_v3, google } from 'googleapis';
import Logging from '../library/Logging';
import fs from 'fs';
import config from '../config';
import announceEvent from '../announcements/announceEvent';

const calendarId: string = config.CALENDAR_ID;
const auth = new google.auth.JWT({
    keyFile: 'credentials.json',
    scopes: 'https://www.googleapis.com/auth/calendar'
});
const calendar = google.calendar({ version: 'v3', auth });

async function sendWatchRequest(UUID: string) {
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

async function stopChannel(id: string, resourceId: string) {
    await calendar.channels.stop({
        requestBody: {
            id,
            resourceId
        }
    });
}

// TODO: Change to no longer requiring sync token.
async function processEventUpdates() {
    // let syncToken;
    // if (fs.existsSync('syncToken.txt')) {
    //     syncToken = fs.readFileSync('syncToken.txt').toString();
    // }
    try {
        const result = await calendar.events.list({
            auth,
            calendarId,
            timeMin: new Date().toISOString()
            // syncToken,
        });
        const event = result!.data.items!.filter(
            (x) => Date.parse(x.created!) > new Date().valueOf() - 10000
        )[0];
        if (!event) {
            return;
        }
        // const nextSyncToken = result!.data.nextSyncToken as string;
        // fs.writeFileSync('syncToken.txt', nextSyncToken);

        // TODO: HANDLE CREATED EVENT

        Logging.info(event.summary);
        announceEvent(event);
    } catch (e) {
        Logging.error(e);
    }
}

//TODO: trigger this daily 12am and set cron
async function getNextEvents() {
    let tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1); //FIXME: +1
    let dayAfter = new Date();
    dayAfter.setDate(dayAfter.getDate() + 2);

    try {
        const results = await calendar.events.list({
            auth,
            calendarId,
            timeMin: tomorrow.toISOString(),
            timeMax: dayAfter.toISOString()
        });
        const event = results!.data.items;
        return event;
    } catch (e) {
        Logging.error(e);
    }
}

export default { sendWatchRequest, stopChannel, processEventUpdates, getNextEvents };