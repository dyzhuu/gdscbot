import express from 'express';
import controller from '../controllers/Exec'

const router = express.Router();

router.post('/create', controller.createExec);
router.get('/get/:execId', controller.getExec)
router.get('/get', controller.getAllExec)
router.patch('/update/:execId', controller.updateExec)
router.delete('/delete/:execId', controller.deleteExec)

export = router;