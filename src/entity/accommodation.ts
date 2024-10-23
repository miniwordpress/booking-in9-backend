import { Entity, Column, PrimaryGeneratedColumn, UpdateDateColumn, CreateDateColumn, BeforeInsert, BeforeUpdate, OneToMany } from 'typeorm'
import { AccommodationType } from 'src/enum/accommodation-type'
import { CountryEnum } from 'src/enum/country-enum'
import { AccommodationStatus } from 'src/enum/accommodation-status'
import { Room } from './room'

@Entity()
export class Accommodation {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ length: 255 })
  name: string

  @Column()
  address_th: string

  @Column()
  address_en: string

  @Column({ enum: AccommodationType })
  type: AccommodationType

  @Column()
  pet_friendly: boolean

  @Column({ enum: CountryEnum })
  country: CountryEnum

  @Column({ length: 255 })
  city: string

  @Column()
  detail_th: string

  @Column()
  detail_en: string

  @Column({ length: 30 })
  tel: string

  @Column()
  facilities_th: string

  @Column()
  facilities_en: string

  @Column()
  maps: string

  @Column({ enum: AccommodationStatus })
  status: AccommodationStatus

  @Column()
  active: boolean

  @Column("simple-array")
  images: string[]

  @OneToMany(() => Room, (room) => room.accommodation)
  rooms: Room[]

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date

  @BeforeInsert()
  setCreatedAt() {
    this.created_at = this.convertToTimeZone(new Date(), 7)
    this.updated_at = this.convertToTimeZone(new Date(), 7)
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
}