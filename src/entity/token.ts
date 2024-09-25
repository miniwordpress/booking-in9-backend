import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';
import { UsersAccount } from './users.account';
import { TokenType } from '../enum/token.type';

@Entity()
export class Token {
  @PrimaryGeneratedColumn()
  id: bigint;

  @Column({ type: 'text', nullable: false })
  token: string;

  @OneToOne(() => UsersAccount, usersAccount => usersAccount.id)
  users_id: UsersAccount;

  @Column({ length: 100, nullable: false })
  type: TokenType; 

  @Column({nullable: false})
  expire_at: Date;

  @Column({nullable: true})
  refresh_time: Date;

  @Column({nullable: false})
  created_at: Date;

  @Column({nullable: false})
  used_at: Date;
}