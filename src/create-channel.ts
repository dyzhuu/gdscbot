import { randomUUID } from 'crypto';
import { sendWatchRequest } from './services/googleCalendarAPI';

const UUID = randomUUID() as string;

sendWatchRequest(UUID);
