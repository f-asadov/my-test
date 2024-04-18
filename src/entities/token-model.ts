import { Column, Entity, ManyToOne, JoinColumn, PrimaryGeneratedColumn } from 'typeorm';
import { UserModel } from './user-model';

@Entity()
export class TokenModel {

  @PrimaryGeneratedColumn({name:'id'})
  id: number;

  @Column({ type: 'varchar', name: 'refresh_token', nullable: false })
  refreshToken: string;

  @ManyToOne(() => UserModel,(userModel)=>userModel.id)
  @JoinColumn({ name: 'user_id' })
  user: UserModel; 
}
  