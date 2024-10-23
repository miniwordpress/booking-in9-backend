import { Entity, Column, PrimaryGeneratedColumn, UpdateDateColumn, CreateDateColumn, BeforeInsert, BeforeUpdate, OneToMany, ManyToOne, JoinColumn } from 'typeorm'
import { AccommodationType } from 'src/enum/accommodation-type'
import { CountryEnum } from 'src/enum/country-enum'
import { AccommodationStatus } from 'src/enum/accommodation-status'
import { Accommodation } from './accommodation'

@Entity()
export class Room {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ length: 255 })
  name_room: string

  @Column()
  price_room: number

  @Column()
  num_of_people: number

  @Column()
  detail_th: string

  @Column()
  detail_en: string

  @Column("simple-array")
  images: string[]

  @ManyToOne(() => Accommodation, (accommodation) => accommodation.rooms, { onDelete: 'CASCADE' })
  @JoinColumn({ name: "accommodation_id"})
  accommodation: Accommodation

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