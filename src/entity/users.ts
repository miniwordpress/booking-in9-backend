import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';
import { Token } from './token';
import { IDNumberType } from 'src/enum/id.number.type';
import { UsersRole } from "src/enum/users-role"
import { UsersStatus } from "src/enum/users-status"

@Entity()
export class Users {
  @PrimaryGeneratedColumn()
  id: number;

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

  @OneToOne(() => Token, (token) => token.user, { nullable: true })
  token?: Token;
}