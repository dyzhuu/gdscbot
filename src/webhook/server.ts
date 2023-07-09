import express, { urlencoded } from 'express';
import Logging from '../library/Logging';
import calendar from '../services/googleCalendarAPI';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 9090;

app.use(
    urlencoded({
        extended: true
    })
);
app.use(express.json());

// endpoint for webhook access
app.post('/hook', (req, res) => {
    calendar.processEventUpdates();
});

// for stopping notification channel just in case
app.post('/stop', (req, res) => {
    const { id, resourceId } = req.body;
    calendar
        .stopChannel(id, resourceId)
        .then(() => {
            Logging.info(`Notification channel ${id} stopped.`);
            res.status(200).json({ message: `Channel ${id} stopped` });
        })
        .catch((e) => {
            res.status(404).json({ message: e.message });
        });
});

app.listen(PORT, () => Logging.info(`🚀 Server running on port ${PORT}`));
