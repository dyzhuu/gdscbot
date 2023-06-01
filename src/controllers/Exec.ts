import { NextFunction, Request, Response } from 'express';
import mongoose, { mongo } from 'mongoose';
import Exec from '../models/Exec';

const createExec = (req: Request, res: Response, next: NextFunction) => {
    const { name } = req.body;

    const exec = new Exec({
        _id: new mongoose.Types.ObjectId(),
        name
    });

    return exec
        .save()
        .then((exec) => res.status(201).json({ exec }))
        .catch((error) => res.status(500).json({ error }));
};

const getExec = (req: Request, res: Response, next: NextFunction) => {
    const execId = req.params.execId;

    return Exec.findById(execId)
        .then((exec) =>
            exec
                ? res.status(200).json({ exec })
                : res.status(404).json({ message: 'not found' })
        )
        .catch((error) => res.status(500).json({ error }));
};

const getAllExec = (req: Request, res: Response, next: NextFunction) => {
    return Exec.find()
        .then((execs) => res.status(200).json({ execs }))
        .catch((error) => res.status(500).json({ error }));
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
