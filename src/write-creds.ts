import fs from 'fs';
import config from './config';
import Logging from './library/Logging';
import { encode } from 'punycode';

const decodedData = Buffer.from(config.CREDENTIALS_JSON, 'base64').toString(
  'utf8'
);

const jsonObject = JSON.parse(decodedData);

fs.writeFile('credentials.json', JSON.stringify(jsonObject, null, 2), (err) => {
  if (err) {
    Logging.error('Error writing to file');
  }
});

Logging.info('Credentials Written');
