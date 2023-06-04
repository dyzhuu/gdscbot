import { google } from 'googleapis'
import { ExecModel, IExec, IExecModel } from '../models/Exec';
import Logging from '../library/Logging';
import fs from 'fs';
const spreadsheetId = process.env.SPREADSHEET_ID;
const auth = new google.auth.GoogleAuth({
    keyFile: 'credentials.json',
    scopes: 'https://www.googleapis.com/auth/spreadsheets'
});
const service = google.sheets('v4');

const createExec = async (body: IExec) => {
    const { name, role, email, phoneNumber, dietaryRequirements, shirtSize, yearGraduating, degree } = body;
    try {
            await service.spreadsheets.values
                .append({
                    spreadsheetId,
                    auth,
                    range: 'Sheet1',
                    valueInputOption: 'USER_ENTERED',
                    requestBody: {
                        values: [
                            [
                                name,
                                role,
                                email,
                                phoneNumber,
                                dietaryRequirements,
                                shirtSize,
                                yearGraduating,
                                degree
                            ]
                        ]
                    }
                })
            await writeName()
            return {
                 body
            }
        } catch (error) {
            Logging.error(error)
        }   
}

const getExec = async (column: number, value: string) => {
    const range = 'Sheet1!A2:H30'
    try{
        const result = await service.spreadsheets.values
            .get({
                spreadsheetId,
                range,
                auth
            })
        
        const sheetValues: string[][] = result.data.values!.filter(row => row[column - 1] === value);
        const exec = sheetValues.map(details => dboToObject(details));
        
        return exec
    } catch (error) {
        Logging.error(error)
    }
};

const writeName = async () => {
    const range = 'Sheet1!A2:A30'
    try{
        const result = await service.spreadsheets.values
            .get({
                spreadsheetId,
                range,
                auth
            })
        const data = result.data.values!.flat(1)
        fs.writeFileSync('names.txt', JSON.stringify(data))
        return
    } catch (error) {
        Logging.error(error)
    }
}

const getAllExec = async () => {
    const range = 'Sheet1!A2:H30'
    try{
        const result = await service.spreadsheets.values
            .get({
                spreadsheetId,
                range,
                auth
            })
                
        const execs = result.data.values!.map(details => dboToObject(details)) 

        return 
    } catch (error) {
        Logging.error(error)
    }
};

function dboToObject(dbo: string[]): IExec {
    return {
        name: dbo[0],
        role: dbo[1],
        email: dbo[2],
        phoneNumber: dbo[3],
        dietaryRequirements: dbo[4],
        shirtSize: dbo[5],
        yearGraduating: dbo[6],
        degree: dbo[7],
    }
};

export default { createExec, dboToObject, getExec, writeName }