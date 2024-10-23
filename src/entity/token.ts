import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn, CreateDateColumn, BeforeInsert } from 'typeorm'
import { User } from './user'
import { TokenType } from '../enum/token-type'

@Entity()
export class Token {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'text', nullable: false })
  token: string

  @OneToOne(() => User, (user) => user.token, { onDelete: 'CASCADE' })
  @JoinColumn({ name: "user_id" })
  user: User

  @Column({ length: 100, nullable: false, enum: TokenType })
  type: TokenType

  @Column({ nullable: false })
  expire_at: Date

  @Column({ nullable: true })
  refresh_time: Date

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date

  @BeforeInsert()
  setCreatedAt() {
    this.created_at = this.convertToTimeZone(new Date(), 7)
  }

  private convertToTimeZone(date: Date, offset: number): Date {
    const utcDate = date.getTime() + (date.getTimezoneOffset() * 60000)
    const newDate = new Date(utcDate + (3600000 * offset))
    return newDate
  }

}