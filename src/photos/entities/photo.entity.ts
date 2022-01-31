import { Log } from 'src/logs/entities/log.entity';
import { Trig } from 'src/trigs/entities/trig.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity()
export class Photo {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(
    /* istanbul ignore next */ (type) => Trig,
    /* istanbul ignore next */ (trig) => trig.id,
  )
  @JoinColumn({ name: 'trig_id' })
  trig: Trig;

  @ManyToOne(
    /* istanbul ignore next */ (type) => User,
    /* istanbul ignore next */ (user) => user.id,
  )
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(
    /* istanbul ignore next */ (type) => Log,
    /* istanbul ignore next */ (log) => log.id,
  )
  @JoinColumn({ name: 'log_id' })
  log: Log;

  @Column({ type: 'varchar', length: 300 })
  caption: string;

  @Column({ type: 'integer' })
  width: number;

  @Column({ type: 'integer' })
  height: number;
}
