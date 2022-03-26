import { Exclude, Expose } from 'class-transformer';
import { Photo } from '../../photos/entities/photo.entity';
import { Trig } from '../../trigs/entities/trig.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  JoinColumn,
  Index,
  CreateDateColumn,
  DeleteDateColumn,
  Generated,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { LogSource, TrigCondition } from 'src/enum_types';
import { Point } from 'geojson';

@Entity()
export class Log {
  @PrimaryGeneratedColumn('identity')
  id: number;

  @Expose()
  @ManyToOne(
    /* istanbul ignore next */ (type) => Trig,
    /* istanbul ignore next */ (trig) => trig.id,
  )
  @JoinColumn({ name: 'trig_id' })
  @Index()
  trig: Trig;

  @Expose()
  @ManyToOne(
    /* istanbul ignore next */ (type) => User,
    /* istanbul ignore next */ (user) => user.id,
  )
  @JoinColumn({ name: 'user_id' })
  @Index()
  user: User;

  @Column({ type: 'timestamp' })
  visit_timestamp: Date;

  @Column({ type: 'text', nullable: true })
  comment: string;

  @Column({ type: 'float', nullable: true })
  wgs_lat?: number;

  @Column({ type: 'float', nullable: true })
  wgs_lon?: number;

  @Column({ type: 'numeric', precision: 8, scale: 3, nullable: true })
  wgs_height?: number;

  @Column({ type: 'numeric', precision: 12, scale: 3, nullable: true })
  osgb_eastings?: number;

  @Column({ type: 'numeric', precision: 12, scale: 3, nullable: true })
  osgb_northings?: number;

  @Column({ type: 'char', length: 14, nullable: true })
  osgb_gridref?: string;

  @Column({ type: 'numeric', precision: 8, scale: 3, nullable: true })
  osgb_height?: number;

  @Index({ spatial: true })
  @Column({
    type: 'geography',
    spatialFeatureType: 'Point',
    srid: 4326,
    nullable: true,
  })
  wgs_point: Point;

  @Index({ spatial: true })
  @Column({
    type: 'geometry',
    spatialFeatureType: 'Point',
    srid: 27700,
    nullable: true,
  })
  osgb_point?: Point;

  @Column({ type: 'varchar', length: 10, nullable: true })
  fb_number?: string;

  @Column({ type: 'enum', enum: TrigCondition, default: TrigCondition.UNKNOWN })
  condition: TrigCondition;

  @Column({ type: 'smallint', nullable: true })
  score: number;


  @Column({ type: 'enum', enum: LogSource, default: LogSource.UNKNOWN })
  source: LogSource;


  // Maybe create abstract class for these columns?
  @Exclude()
  @CreateDateColumn({ select: false })
  crt_timestamp?: Date;

  @Exclude()
  @ManyToOne(
    /* istanbul ignore next */ (type) => User,
    /* istanbul ignore next */ (user) => user.id,
    {nullable: true}
  )
  @JoinColumn({ name: 'crt_user_id' })
  crt_user: User;

  @Exclude()
  @Column({ type: 'varchar', length: 15, nullable: true, select: false })
  crt_ip_addr?: string;

  @Exclude()
  @Column({
    type: 'timestamp without time zone',
    nullable: true,
    select: false,
  })
  admin_timestamp?: Date;

  @ManyToOne(
    /* istanbul ignore next */ (type) => User,
    /* istanbul ignore next */ (user) => user.id,
    {nullable: true}
  )
  @JoinColumn({ name: 'admin_user_id' })
  admin_user?: User; 

  @Exclude()
  @Column({ type: 'char', length: 15, nullable: true, select: false })
  admin_ip_addr?: string;

  @Exclude()
  @UpdateDateColumn({ select: false })
  upd_timestamp?: Date;

  @Exclude()
  @VersionColumn({ type: 'numeric', default: 0, select: false })
  upd_count?: number;

  @Exclude()
  @DeleteDateColumn({ select: false })
  deletedAt?: Date;

  @Exclude()
  @Column()
  @Generated('uuid')
  uuid?: string;

  // Foreign keys
  @OneToMany(
    /* istanbul ignore next */ (type) => Photo,
    /* istanbul ignore next */ (photo) => photo.log,
  )
  @JoinColumn({ name: 'photo_id' })
  photos?: Photo[];
}
