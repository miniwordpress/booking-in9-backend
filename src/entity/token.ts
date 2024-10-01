import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';
import { Users } from './users';
import { TokenType } from '../enum/token.type';

@Entity()
export class Token {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text', nullable: false })
  token: string;

  @OneToOne(() => Users, (usersAccount) => usersAccount.token,{cascade: true})
  @JoinColumn({ name: "user_id" })
  user: Users;

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