import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

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

  @Column({ length: 255})
  password: string;

  @Column({length: 20})
  tel: string;

  @Column({length: 50})
  id_number: string;

  @Column({length: 255})
  img: string;

  @Column({length: 50})
  status: UsersStatus;
  
  @Column({length: 20})
  role: UsersRole;

  @Column({nullable: false})
  description: string;

  @Column()
  created_at: Date;

  @Column({nullable: false})
  updated_at: Date;
}


