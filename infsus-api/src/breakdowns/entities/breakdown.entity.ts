import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BreakdownStatusEnum } from '../../enums/brakedown-status.enum';
import { BaseEntity } from 'src/common/entities/base-entity';
import { BreakdownTypeEnum } from '../../enums/breakdown-type.enum';
import { User } from '../../user/entities/user.entity';

@Entity('breakdown')
export class Breakdown extends BaseEntity {
  @Column({
    type: 'enum',
    enum: BreakdownTypeEnum,
    nullable: true,
  })
  BreakdownType: BreakdownTypeEnum;

  @Column()
  Naslov: string;

  @Column('text')
  Opis: string;

  @Column({
    type: 'enum',
    enum: BreakdownStatusEnum,
    default: BreakdownStatusEnum.Prijavljen,
  })
  Status: BreakdownStatusEnum;

  @Column({ nullable: false })
  OrdererUserId: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'OrdererUserId' })
  OrdererUser: User;
}
