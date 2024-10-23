// import { Entity, Column, PrimaryGeneratedColumn, OneToOne, UpdateDateColumn, CreateDateColumn, BeforeInsert, BeforeUpdate } from 'typeorm'
// import { Token } from './token'
// import { IDNumberType } from 'src/enum/id-number-type'
// import { UsersRole } from "src/enum/users-role"
// import { UsersStatus } from "src/enum/users-status"
// import { AccommodationType } from 'src/enum/accommodation-type'

// @Entity()
// export class Accommodations {
//   @PrimaryGeneratedColumn()
//   id: number

//   @Column({ length: 255 })
//   name: string

//   @Column()
//   address_th: string

//   @Column()
//   address_en: string

//   @Column({ enum: AccommodationType })
//   type: AccommodationType

//   @Column({ length: 30 })
//   tel: string

//   @Column({ length: 50 })
//   id_number: string

//   @Column()
//   id_number_type: IDNumberType

//   @Column({ type: 'text', nullable: true })
//   img: string

//   @Column({ length: 50 })
//   status: UsersStatus

//   @Column({ length: 20 })
//   role: UsersRole

//   @Column({ nullable: true })
//   description: string

//   @CreateDateColumn({ type: 'timestamp' })
//   created_at: Date

//   @UpdateDateColumn({ type: 'timestamp' })
//   updated_at: Date

//   @OneToOne(() => Token, (token) => token.user, { nullable: true })
//   token?: Token

// }