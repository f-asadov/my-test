import { UsingJoinColumnIsNotAllowedError } from "typeorm";
import { FileDto } from "../dtos/file-dto";
import { FileService } from "../service/file-service";

export class FileController {
    private fileService: FileService;

    constructor() {
        this.fileService = new FileService();
    }

    async fileUpload(req: any, res: any) {
        try {
            const file: FileDto = req.file
            await this.fileService.fileUpload(req.file)
            res.json({ message: 'File uploaded successfully!' });
        } catch (error) {
            throw new Error("File upload error")
        }
    }

    async getFileInfoById(req: any, res: any) {
        try {
            const id: string = req.params.id
            const result = await this.fileService.getFileInfoById(id)
            res.json(result)
        } catch (error) {
            throw new Error("Error")
        }
    }

    async removeFileById(req: any, res: any) {
        try {
            const id = req.params.id
            await this.fileService.removeFileById(id)
            res.json("Deleted")
        } catch (error) {
            throw new Error("Error")
        }
    }

    async downloadFile(req: any, res: any) {
        try {
            const id: string = req.params.id
            const fileToDownload = await this.fileService.downloadFile(id)
            res.setHeader('Content-Disposition', `attachment; filename="${fileToDownload}"`);
            res.sendFile(fileToDownload)

        } catch (error) {
            throw new Error("Error")
        }
    }

    async changeFile(req: any, res: any) {
        try {
            const file: FileDto = req?.file
            const id: string = req.params.id
            await this.fileService.changeFile(id, file)
        } catch (error) {

        }
    }

    async getFileList(req: any, res: any) {
        try {
            const { page, listSize } = req.body;
            const fileList = await this.fileService.getFileList(page, listSize);
            res.json(fileList);
        }
        catch {
            throw new Error("Error")
        }

    }
}