import { google } from 'googleapis';
import Logging from '../library/Logging';
import fs from 'fs';

const calendarId: string = process.env.CALENDAR_ID!;
const auth = new google.auth.JWT({
    keyFile: 'credentials.json',
    scopes: 'https://www.googleapis.com/auth/calendar'
});
const calendar = google.calendar({ version: 'v3', auth });

export async function checkCalendarAccess() {
    try {
        const response = await calendar.calendars.get({
            calendarId
        });
        const userCalendar = response.data;
        console.log(userCalendar);
        return userCalendar;
    } catch (error) {
        console.error('Error checking calendar access:', error);
        throw error;
    }
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
        function (e, res) {
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
            Logging.info(event);
        }
    );
}
