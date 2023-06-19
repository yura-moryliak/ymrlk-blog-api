import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';

import * as path from 'path';
import * as fs from 'fs';

import { diskStorage } from 'multer';

export const avatarMulterOptions: MulterOptions = {
  storage: diskStorage({
    destination: (req, file: Express.Multer.File, callback) => {
      const dirPath: string = path.join(
        __dirname,
        '../../',
        `uploads/avatars/${req['user'].uuid}`,
      );

      fs.promises
        .mkdir(dirPath, { recursive: true })
        .then(() => callback(null, `./uploads/avatars/${req['user'].uuid}`))
        .catch((error) => console.log('AVATAR MKDIR ERROR: ', error));
    },

    filename: (req, file: Express.Multer.File, callback) => {
      // TODO Make it async

      const dirPath = path.join(
        __dirname,
        '../../',
        `uploads/avatars/${req['user'].uuid}`,
      );
      const dirExist = fs.existsSync(dirPath);
      const dirFilesList = fs.readdirSync(dirPath);
      const dirHasContent = dirExist && dirFilesList.length > 0;

      if (!dirHasContent) {
        callback(null, `${Date.now()}${path.extname(file.originalname)}`);
        return;
      }

      dirFilesList.forEach((dirFile: string) => {
        fs.unlinkSync(path.join(dirPath, dirFile));
        callback(null, `${Date.now()}${path.extname(file.originalname)}`);
      });
    },
  }),
  limits: { fileSize: 3000000 },
};
