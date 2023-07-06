import fs from 'fs';
import config from './config';
import Logging from './library/Logging';

fs.writeFileSync('credentials.json', config.CREDENTIALS);
Logging.info("Credentials written");