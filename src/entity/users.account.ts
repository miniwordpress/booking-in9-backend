import { Entity, Column, PrimaryGeneratedColumn, OneToOne } from 'typeorm';
import { Token } from './token';
import { IDNumberType } from 'src/enum/id.number.type';

@Entity()
export class UsersAccount {
  @PrimaryGeneratedColumn()
  id: bigint;

  @Column({ length: 100})
  first_name: string;

  @Column({ length: 100})
  last_name: string;

  @Column({ length: 100})
  email: string; 

  @Column({ type: 'text'})
  password: string;

  @Column({length: 20})
  tel: string;

  @Column({length: 50})
  id_number: string;

  @Column()
  id_number_type: IDNumberType;

  @Column({type: 'text', nullable: true})
  img: string;

  @Column({length: 50})
  status: UsersStatus;
  
  @Column({length: 20})
  role: UsersRole;

  @Column({nullable: true})
  description: string;

  @Column()
  created_at: Date;

  @Column({nullable: true})
  updated_at: Date;

  @OneToOne(type => Token, token => token.users_id, {nullable: true})
  tokenData?: Token;
}