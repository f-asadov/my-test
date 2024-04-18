import { Repository } from 'typeorm';
import { databaseSource } from '../../ormconfig';
import { FileDto } from '../dtos/file-dto';
import { UploadModel } from '../entities/file-model';
import * as fs from 'fs'
import path from 'path';

export class FileService {
    private fileRepository: Repository<UploadModel>;
    private pageSize: number;

    constructor(pageSize: number = 10) {
        this.fileRepository = databaseSource.getRepository(UploadModel);
        this.pageSize = pageSize;
    }

    async fileUpload(file: FileDto) {
        try {
            const uuid = file.filename.split(file.originalname)[0]
            const extension = file.mimetype.split('/')[1];

            const savedFile = {
                id:uuid,
                name: file.filename,
                extension: extension,
                mimeType: file.mimetype,
                uploadDate: new Date(),
                size: file.size
            }

            await this.fileRepository.save(savedFile)

        } catch (error) {

        }
    }

    async getFileInfoById(id:string){
        try {
            const fileInfo = await this.fileRepository.findOne({where:{id}})
            return fileInfo
        } catch (error) {
            console.log(error)
        }
    }

    async removeFileById(id: string) {
        try {
            const fileInfo = await this.fileRepository.findOne({ where: { id } });

            if (!fileInfo) {
                throw new Error(`File with ID ${id} not found`);
            }

            const filePath = path.join(__dirname, '../../uploads', fileInfo.name);

            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            } else {
                throw new Error(`File ${fileInfo.name} not found in uploads folder`);
            }

            await this.fileRepository.delete({ id });
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async downloadFile(id: string){
        try {
            const fileInfo = await this.fileRepository.findOne({ where: { id } });

            if (!fileInfo) {
                throw new Error(`File with ID ${id} not found`);
            }

            const filePath = path.join(__dirname, '../../uploads', fileInfo.name);

            if (fs.existsSync(filePath)) {
                return filePath
            } else {
                throw new Error(`File ${fileInfo.name} not found in uploads folder`);
            }
        } catch (error) {
            console.error(error);
            throw error;
        }

    }

    async changeFile(id: string,newFile:any){

        const fileInfo = await this.fileRepository.findOne({where:{id}})
        
        if (!fileInfo) {
            throw new Error(`File with ID ${id} not found`);
        }

        if(newFile){

            const filePath = path.join(__dirname, '../../uploads', fileInfo.name);
            

            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            } else {
                throw new Error(`File ${fileInfo.name} not found in uploads folder`);
            }

            const extension = newFile.mimetype.split('/')[1];
            const uuid = newFile.filename.split(newFile.originalname)[0]
            const finalFile = {
                id:uuid,
                name: newFile.filename,
                extension: extension,
                mimeType: newFile.mimetype,
                uploadDate: new Date(),
                size: newFile.size
            }

            
            await this.fileRepository.update(id,finalFile)
        }


    }

    async getFileList(page: number = 1, listSize: number = this.pageSize) {
        try {
            const skip = (page - 1) * listSize;

            const [files, totalCount] = await this.fileRepository.findAndCount({
                skip: skip,
                take: listSize
            });

            const totalPages = Math.ceil(totalCount / listSize);

            return {
                files,
                pageInfo: {
                    currentPage: page,
                    totalPages: totalPages,
                    totalItems: totalCount,
                    pageSize: listSize
                }
            };
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}
