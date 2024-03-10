import { Entity, Column, BeforeInsert, BeforeUpdate } from 'typeorm';
import { BaseEntity } from 'src/common/entities/base-entity';
import { IsEmail } from 'class-validator';
import { Gender } from '../../enums/gender.enum';
import * as bcrypt from 'bcrypt';

@Entity()
export class User extends BaseEntity {
  @Column({
    unique: true,
    nullable: false,
  })
  username: string;

  @Column({
    unique: true,
    nullable: false,
  })
  @IsEmail()
  email: string;

  @Column({ nullable: false })
  password: string;

  @Column({ nullable: true })
  firstName: string;

  @Column({ nullable: true })
  lastName: string;

  @Column({
    type: 'enum',
    enum: Gender,
    nullable: true,
  })
  gender: Gender;

  @Column({ nullable: true })
  image: string;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (!this.password) return;
    const saltRounds = 10;
    this.password = await bcrypt.hash(this.password, saltRounds);
  }
}
