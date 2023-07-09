import fs from 'fs';
import config from './config';
import Logging from './library/Logging';

fs.writeFileSync('credentials.json', config.CREDENTIALS_JSON);
Logging.info('Credentials written');
