import { Entity, Column, PrimaryGeneratedColumn, OneToOne } from 'typeorm';
import { Token } from './token';

@Entity()
export class UsersAccount {
  @PrimaryGeneratedColumn()
  @OneToOne(() => Token, token => token.users_id)
  id: bigint;

  @Column({ length: 100})
  first_name: string;

  @Column({ length: 100})
  last_name: string;

  @Column({ length: 100})
  email: string; 

  @Column({ length: 255})
  password: string;

  @Column({length: 20})
  tel: string;

  @Column({length: 50})
  id_number: string;

  @Column({length: 255, nullable: true})
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
}


