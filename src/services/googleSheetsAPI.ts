import { google } from 'googleapis';
import Exec from '../models/Exec';
import Logging from '../library/Logging';
import fs from 'fs';
import config from '../config';
const spreadsheetId = config.SPREADSHEET_ID;

const auth = new google.auth.JWT({
  keyFile: 'credentials.json',
  scopes: 'https://www.googleapis.com/auth/spreadsheets'
});
const service = google.sheets('v4');

/**
 *
 * @param exec exec object to insert into google sheets
 */
async function createExec(exec: Exec) {
  await service.spreadsheets.values.append({
    spreadsheetId,
    auth,
    range: 'A2:J',
    valueInputOption: 'USER_ENTERED',
    requestBody: {
      values: [Object.values(exec)]
    }
  });
  await writeName();
  return;
}

/**
 *
 * @param column the category to filter results by
 * @param value the value to search for
 * @returns array of array of exec details.
 */
async function getExec(column: number, value: string): Promise<Exec[] | void> {
  const result = await service.spreadsheets.values.get({
    spreadsheetId,
    range: 'A2:J',
    auth
  });

  console.log(result.data.values);

  const sheetValues: string[][] = result.data.values!.filter(
    (row: any) => row[column - 1] === value
  );
  const exec = sheetValues.map((details) => dboToObject(details));

  return exec;
}

/**
 *
 * @param exec new exec details to update with
 */
async function updateExec(exec: Exec) {
  const nameResults = await service.spreadsheets.values.get({
    spreadsheetId,
    range: 'A2:A',
    majorDimension: 'Columns',
    auth
  });
  const row = nameResults.data.values![0].indexOf(exec.name) + 2;

  await service.spreadsheets.values.update({
    spreadsheetId,
    range: `A${row}:J${row}`,
    valueInputOption: 'USER_ENTERED',
    requestBody: {
      values: [Object.values(exec)]
    },
    auth
  });
}

// writes names in local storage
async function writeName() {
  try {
    const result = await service.spreadsheets.values.get({
      spreadsheetId,
      range: 'A2:A',
      auth
    });
    const data = result.data.values!.flat(1).sort();
    fs.writeFileSync('names.txt', JSON.stringify(data));
    return;
  } catch (error) {
    Logging.error(error);
  }
}

// array to Exec object
function dboToObject(dbo: string[]): Exec {
  const [
    name,
    role,
    preferredEmail,
    universityEmail,
    phoneNumber,
    accountNumber,
    dietaryRequirements,
    shirtSize,
    yearOfStudy,
    degree
  ] = dbo;
  return {
    name,
    role,
    preferredEmail,
    universityEmail,
    phoneNumber,
    accountNumber,
    dietaryRequirements,
    shirtSize,
    yearOfStudy,
    degree
  };
}

export default { writeName, dboToObject, createExec, getExec, updateExec };
