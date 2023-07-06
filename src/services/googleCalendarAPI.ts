import { google } from 'googleapis';
import Logging from '../library/Logging';
import config from '../config';

const calendarId: string = config.CALENDAR_ID;
const auth = new google.auth.JWT({
    keyFile: 'credentials.json',
    scopes: 'https://www.googleapis.com/auth/calendar'
});
const calendar = google.calendar({ version: 'v3', auth });
//fetches events that are set to run the day after
async function getNextEvents() {
    let tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    let dayAfter = new Date();
    dayAfter.setDate(dayAfter.getDate() + 2);

    const results = await calendar.events.list({
        auth,
        calendarId,
        timeMin: tomorrow.toISOString(),
        timeMax: dayAfter.toISOString()
    });
    const events = results!.data.items!.filter(
        (event) =>
            new Date(event.start?.dateTime as string).getTime() >
            tomorrow.getTime()
    );
    return events;
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
    getNextEvents,
    getEventById
};
