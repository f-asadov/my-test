import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class UserModel {
  @PrimaryColumn({type:'varchar',name:'id'})
  id: string;

  @Column({type:'varchar',name:'password'})
  password: string;

}
