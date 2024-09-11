import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';
import { UsersAccount } from './users.account';
import { TokenType } from '../enum/token.type';

@Entity()
export class Token {
  @PrimaryGeneratedColumn()
  id: bigint;

  @Column({ length: 255, nullable: false })
  token: string;

  @OneToOne(() => UsersAccount, usersAccount => usersAccount.id)
  @JoinColumn({ name: 'users_id' })
  users_id: UsersAccount;

  @Column({ length: 100, nullable: false })
  type: TokenType; 

  @Column({nullable: false})
  expire_at: Date;

  @Column({nullable: false})
  created_at: Date;

  @Column({nullable: false})
  used_at: Date;
}