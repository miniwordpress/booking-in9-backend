import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn, UpdateDateColumn, CreateDateColumn, BeforeInsert, BeforeUpdate } from 'typeorm'
import { Token } from './token'
import { IDNumberType } from 'src/enum/id-number-type'
import { UsersRole } from "src/enum/users-role"
import { UsersStatus } from "src/enum/users-status"
import { UsersResponse } from 'src/dto/response/users.response'
import { UserDeailResponse } from 'src/dto/response/user-detail.response'
import { UpdateProfileResponse } from 'src/dto/response/update-profile.response'

@Entity()
export class Users {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ length: 100 })
  first_name: string

  @Column({ length: 100 })
  last_name: string

  @Column({ length: 100, unique: true })
  email: string

  @Column({ type: 'text' })
  password: string

  @Column({ length: 30 })
  tel: string

  @Column({ length: 50 })
  id_number: string

  @Column()
  id_number_type: IDNumberType

  @Column({ type: 'text', nullable: true })
  img: string

  @Column({ length: 50 })
  status: UsersStatus

  @Column({ length: 20 })
  role: UsersRole

  @Column({ nullable: true })
  description: string

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date

  @OneToOne(() => Token, (token) => token.user, { nullable: true })
  token?: Token

  @BeforeInsert()
  setCreatedAt() {
    this.created_at = this.convertToTimeZone(new Date(), 7)
  }

  @BeforeUpdate()
  setUpdatedAt() {
    this.updated_at = this.convertToTimeZone(new Date(), 7)
  }

  private convertToTimeZone(date: Date, offset: number): Date {
    const utcDate = date.getTime() + (date.getTimezoneOffset() * 60000)
    const newDate = new Date(utcDate + (3600000 * offset))
    return newDate
  }

  toMapperUser(): UsersResponse {
    return {
      id: this.id,
      firstName: this.first_name,
      lastName: this.last_name,
      email: this.email,
      status: this.status,
    }
  }

  toMapperUserDetail(): UserDeailResponse {
    return {
      id: this.id,
      firstName: this.first_name,
      lastName: this.last_name,
      email: this.email,
      tel: this.tel,
      idNumber: this.id_number,
      idNumberType: this.id_number_type,
      img: this.img,
      status: this.status,
      description: this.description
    }
  }

  toMapperProfile(): UpdateProfileResponse {
    return {
      firstName: this.first_name,
      lastName: this.last_name,
      tel: this.tel,
      idNumber: this.id_number,
      idNumberType: this.id_number_type,
      img: this.img,
      description: this.description
    }
  }
  
}