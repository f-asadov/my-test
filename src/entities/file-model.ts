import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class UploadModel {
    @PrimaryColumn('uuid', { primary: true, name: 'id' })
    id: string;

    @Column({type:'varchar',name:'name'})
    name: string;

    @Column({type:'varchar',name:'extension'})
    extension: string;

    @Column({type:'varchar',name:'mime_type'})
    mimeType: string;

    @Column({type:'int',name:'size'})
    size: number;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' ,name:'upload_date' })
    uploadDate: Date;
}
