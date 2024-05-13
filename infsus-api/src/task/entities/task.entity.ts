import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../common/entities/base-entity';
import { Breakdown } from '../../breakdowns/entities/breakdown.entity';
import { TaskStatusEnum } from '../../enums/task-status.enum';

@Entity('task')
export class Task extends BaseEntity {
  @Column()
  breakdownId: number;

  @Column()
  MajstorID: number;

  @Column()
  AdminID: number;

  @Column('text')
  Opis: string;

  @Column({ type: 'date' })
  Rok: Date;

  @Column({
    type: 'enum',
    enum: TaskStatusEnum,
  })
  Status: TaskStatusEnum;

  @ManyToOne(() => Breakdown, (breakdown) => breakdown.tasks)
  @JoinColumn({ name: 'breakdownId' })
  breakdown: Breakdown;
}
