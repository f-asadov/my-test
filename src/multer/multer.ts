import multer from 'multer';
import { Request } from 'express';
import path from 'path';
import { uuid } from 'uuidv4';
import * as fs from 'fs'


const uploadDirectory = path.join(__dirname, '../../uploads');

if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory);
}


const storage = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => {
    cb(null, uploadDirectory);
  },
  filename: (req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
    cb(null, uuid() + file.originalname);
  }
});

const upload = multer({ storage: storage });

export default upload;
