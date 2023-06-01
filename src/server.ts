import express from 'express';
import http from 'http';
import mongoose from 'mongoose';
import config from './config';
import Logging from './library/Logging';
import execRoutes from './routes/Exec'

/** Connect to MongoDB */
mongoose
    .connect(config.MONGO_URI, { retryWrites: true, w: 'majority' })
    .then(() => {
        Logging.info('MongoDB is Connected.');
        StartServer();
    })
    .catch((e) => {
        Logging.error('Unable to connect: ');
        Logging.error(e);
    });

/** Start server if Mongo connects */
const StartServer = () => {
    const app = express();

    app.use((req, res, next) => {
        /** Log the request */
        Logging.info(
            `Incoming -> Method: [${req.method}] - Url: [${req.url}] - IP: [${req.socket.remoteAddress}]`
        );

        res.on('finish', () => {
            /** Log response status */
            Logging.info(
                `Incoming -> Method: [${req.method}] - Url: [${req.url}] - IP: [${req.socket.remoteAddress}] - Status: [${res.statusCode}]`
            );
        });

        next();
    });

    /** Body parser */
    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());

    /** CORS */
    app.use((req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*');
        res.header(
            'Access-Control-Allow-Headers',
            'Origin, X-Requested-With, Content-Type, Accept, Authorization'
        );
        if (req.method == 'OPTIONS') {
            res.header(
                'Access-Control-Allow-Methods',
                'GET,PUT,POST,PATCH,DELETE'
            );
            return res.status(200).json({});
        }

        next();
    });
    /** Routes */
    app.use('/execs/', execRoutes);

    /** Check */
    app.get('/ping', (req, res, next) =>
        res.status(200).json({ message: 'pong' })
    );

    /** Error handling */
    app.use((req, res, next) => {
        const error = new Error('not found');
        Logging.error(error);

        return res.status(404).json({ message: error.message });
    });

    http.createServer(app).listen(config.SERVER_PORT, () =>
        Logging.info(`Server running on port ${config.SERVER_PORT}.`)
    );
};
