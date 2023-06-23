import { randomUUID } from 'crypto';
import calendar from './services/googleCalendarAPI';

const UUID = randomUUID() as string;

calendar.sendWatchRequest(UUID);
