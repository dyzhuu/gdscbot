import { google } from 'googleapis';
import Logging from '../library/Logging';
import fs from 'fs';
import config from '../config';
import { delayCreationAnnouncement } from './scheduler';

const calendarId: string = config.CALENDAR_ID;
const auth = new google.auth.JWT({
    keyFile: 'credentials.json',
    scopes: 'https://www.googleapis.com/auth/calendar'
});
const calendar = google.calendar({ version: 'v3', auth });

// creates notification channel
async function sendWatchRequest(UUID: string) {
    try {
        const response = await calendar.events.watch(
        {
            calendarId,
            requestBody: {
                id: UUID,
                type: 'web_hook',
                address: `${config.URL}/hook`
            }
        })
        Logging.info(response?.data);
        Logging.info(
            `Notification channel successfully created (remember ID and resourceId !)`
        );
    } catch (e) {
        Logging.error(e)
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

// creates announcement if new event is created
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

        Logging.info(`Event added: ${event.summary}`);

        delayCreationAnnouncement(event);
    } catch (e) {
        Logging.error(e);
    }
}

//fetches events that are set to run the day after
async function getNextEvents() {
    let tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    let dayAfter = new Date();
    dayAfter.setDate(dayAfter.getDate() + 2);

    try {
        const results = await calendar.events.list({
            auth,
            calendarId,
            timeMin: tomorrow.toISOString(),
            timeMax: dayAfter.toISOString()
        });
        const events = results!.data.items!.filter(
            (event) => event.summary !== 'Weekly Sync'
        ); // FIXME: change name? 
        return events;
    } catch (e) {
        Logging.error(e);
    }
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
        if (!event[0] || event.length > 1) {
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
