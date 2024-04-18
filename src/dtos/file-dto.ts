export class FileDto {
    id:string;
    fieldname: string;
    originalname: string;
    encoding: string;
    mimetype: string;
    destination: string;
    filename: string;
    path: string;
    size: number;

    constructor(data: any) {
        this.id = data.id
        this.fieldname = data.fieldname;
        this.originalname = data.originalname;
        this.encoding = data.encoding;
        this.mimetype = data.mimetype;
        this.destination = data.destination;
        this.filename = data.filename;
        this.path = data.path;
        this.size = data.size;
    }
}
