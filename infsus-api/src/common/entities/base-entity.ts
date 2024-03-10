import { IsDate } from 'class-validator';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  PrimaryGeneratedColumn,
} from 'typeorm';

export abstract class BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  @IsDate()
  created: Date;

  @Column({ nullable: false })
  @IsDate()
  updated: Date;

  @BeforeInsert()
  updateDateCreated() {
    this.created = new Date();
    this.updated = new Date();
  }

  @BeforeUpdate()
  updateDateUpdated() {
    this.updated = new Date();
  }
}
