import { google } from 'googleapis';

const calendarId: string = process.env.CALENDAR_ID!;
const auth = new google.auth.JWT({
    keyFile: 'credentials.json',
    scopes: 'https://www.googleapis.com/auth/calendar'
});
const calendarApi = google.calendar({ version: 'v3', auth });

export async function checkCalendarAccess() {
    try {
        const response = await calendarApi.calendars.get({
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
