import express from 'express';
import { UserController } from '../controllers/user-controller';
import { FileController } from '../controllers/file-controller';
export const router = express.Router();
const userController = new UserController();
const fileController = new FileController();
const authMiddleware = require('../middlewares/auth-middleware')
import upload from '../multer/multer';

router.post('/signup', userController.signUp.bind(userController))
router.post('/signin', userController.signIn.bind(userController))
router.post('/logout', userController.logout.bind(userController))
router.get('/signin/new_token', userController.refresh.bind(userController))
router.get('/file/list',authMiddleware,fileController.getFileList.bind(fileController))
router.get('/file/upload', authMiddleware,upload.single('file'), fileController.fileUpload.bind(fileController))
router.get('/file/:id', authMiddleware, fileController.getFileInfoById.bind(fileController));
router.delete('/file/delete/:id',authMiddleware, fileController.removeFileById.bind(fileController))
router.get('/file/download/:id', authMiddleware,upload.single('file'),fileController.downloadFile.bind(fileController))
router.put('/file/update/:id', authMiddleware,upload.single('file'),fileController.changeFile.bind(fileController))





