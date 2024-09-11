import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Hello {
  @PrimaryGeneratedColumn()
  id: bigint;

  @Column({ length: 100})
  hello: string;

  @Column()
  created_at: Date;

  @Column({nullable: false})
  updated_at: Date;

}