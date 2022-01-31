import { Expose } from 'class-transformer';
import { Photo } from '../../photos/entities/photo.entity';
import { Trig } from '../../trigs/entities/trig.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity()
export class Log {
  @PrimaryGeneratedColumn()
  id: number;

  @Expose()
  @ManyToOne(
    /* istanbul ignore next */ (type) => Trig,
    /* istanbul ignore next */ (trig) => trig.id,
  )
  @JoinColumn({ name: 'trig_id' })
  trig: Trig;

  @Column({ type: 'varchar', length: 300 })
  text: string;

  @Column({ type: 'float', nullable: true })
  wgs_lat?: number;

  @Column({ type: 'float', nullable: true })
  wgs_lon?: number;

  @OneToMany(
    /* istanbul ignore next */ (type) => Photo,
    /* istanbul ignore next */ (photo) => photo.log,
  )
  @JoinColumn({ name: 'photo_id' })
  photos: Photo[];
}
