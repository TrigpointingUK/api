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
  @ManyToOne((type) => Trig, (trig) => trig.id)
  @JoinColumn({ name: 'trig_id' })
  trig: Trig;

  @Column({ type: 'varchar', length: 300 })
  text: string;

  @Column({ type: 'float', nullable: true })
  wgs_lat?: number;

  @Column({ type: 'float', nullable: true })
  wgs_lon?: number;

  @OneToMany((type) => Photo, (photo) => photo.log)
  @JoinColumn({ name: 'photo_id' })
  photos: Photo[];
}
