import e, { NextFunction, Request, Response } from 'express';
import Exec, { ExecModel } from '../models/Exec';
import { google } from 'googleapis';
import dotenv from 'dotenv';
import Logging from '../library/Logging';
dotenv.config();

const spreadsheetId = process.env.SPREADSHEET_ID;
const auth = new google.auth.GoogleAuth({
    keyFile: 'credentials.json',
    scopes: 'https://www.googleapis.com/auth/spreadsheets'
});
const service = google.sheets('v4');

/** controller for creating new exec row */
const createExec = async (req: Request, res: Response, next: NextFunction) => {
    const {
        name,
        role,
        email,
        phoneNumber,
        dietaryRequirements,
        shirtSize,
        yearGraduating,
        degree
    }: ExecModel = req.body;

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
        return res.status(201).json({
                name,
                role,
                email,
                phoneNumber,
                dietaryRequirements,
                shirtSize,
                yearGraduating,
                degree
            })
    } catch (error) {
        res.status(500).json({ error })
    }   
};

const getExec = async (req: Request, res: Response, next: NextFunction) => {
    const {column, value} = req.body;
    const range = 'Sheet1!A2:H30'

    try{
        const result = await service.spreadsheets.values
            .get({
                spreadsheetId,
                range,
                auth
            })
        
        const sheetValues: string[][] = result.data.values!.filter(row => row[column - 1] === value);

        const exec = sheetValues.map(details => new ExecModel(...details));
        
        Logging.info((exec))

        return res.status(200).json(exec)
    } catch (error) {
        Logging.error(error)
        return res.status(500).json({ error })
    }
};

const getAllExec = async (req: Request, res: Response, next: NextFunction) => {
    const range = 'Sheet1!A2:H30'
    try{
        const result = await service.spreadsheets.values
            .get({
                spreadsheetId,
                range,
                auth
            })
                
        const execs = result.data.values!.map(details => new ExecModel(...details)) 

        return res.status(200).json(execs)
    } catch (error) {
        Logging.error(error)
        return res.status(500).json({ error })
    }
};

const updateExec = (req: Request, res: Response, next: NextFunction) => {
    const execId = req.params.execId;
    const { name } = req.body;

    return Exec.findById(execId)
        .then((exec) => {
            if (exec) {
                exec.set(req.body);

                return exec
                    .save()
                    .then((exec) => res.status(201).json({ exec }))
                    .catch((error) => res.status(500).json({ error }));
            } else {
                res.status(404).json({ message: 'Not Found' });
            }
        })
        .catch((error) => res.status(500).json(error));
};

const deleteExec = (req: Request, res: Response, next: NextFunction) => {
    const execId = req.params.execId;
    return Exec.findByIdAndDelete(execId)
        .then((exec) =>
            exec
                ? res.status(201).json({ message: 'deleted' })
                : res.status(404)
        )
        .catch((error) => res.status(500).json({ error }));
};

export default { createExec, getExec, getAllExec, updateExec, deleteExec };
