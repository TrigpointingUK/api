import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  Generated,
  VersionColumn,
  Index,
  DeleteDateColumn,
  JoinColumn,
} from 'typeorm';
import { Exclude, Expose } from 'class-transformer';
import { Point } from 'geojson';
import { Photo } from '../../photos/entities/photo.entity';
import { Log } from '../../logs/entities/log.entity';
import {
  TrigCondition,
  CurrentUse,
  HistoricUse,
  PhysicalType,
  Status,
} from 'src/enum_types';

@Entity()
export class Trig {
  @PrimaryGeneratedColumn('identity')
  id: number;

  @Exclude()
  @Column({
    type: 'varchar',
    length: 10,
    nullable: false,
    generatedType: 'STORED',
    select: false,
    asExpression: `'TP' || LPAD(id::text, case when id>9999 then 5 else 4 end, '0')`,
  })
  wp: string;

  @Expose()
  get waypoint(): string {
    return 'TP' + this.id.toString().padStart(4, '0');
  }

  @Column({ type: 'varchar', length: 50, nullable: true })
  name: string;

  @Expose()
  get fullName(): string {
    return `${this.waypoint} - ${this.name}`;
  }

  @Column({ type: 'enum', enum: Status, default: Status.UNKNOWN })
  status: Status;

  @Exclude()
  @Column({ type: 'boolean', default: false })
  user_added: boolean;

  @Column({ type: 'enum', enum: CurrentUse, default: CurrentUse.UNKNOWN })
  current_use: CurrentUse;

  @Column({ type: 'enum', enum: HistoricUse, default: HistoricUse.UNKNOWN })
  historic_use: HistoricUse;

  @Column({ type: 'enum', enum: PhysicalType, default: PhysicalType.UNKNOWN })
  physical_type: PhysicalType;

  @Column({ type: 'numeric', precision: 12, scale: 8, nullable: false })
  wgs_lat: number;

  @Column({ type: 'numeric', precision: 12, scale: 8, nullable: false })
  wgs_lon: number;

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
    nullable: false,
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

  @Column({ type: 'char', length: 10, nullable: true })
  fb_number?: string;

  @Column({ type: 'char', length: 20, nullable: true })
  stn_number?: string;

  @Column({ type: 'char', length: 20, nullable: true })
  stn_number_active?: string;

  @Column({ type: 'char', length: 20, nullable: true })
  stn_number_passive?: string;

  @Column({ type: 'char', length: 20, nullable: true })
  stn_number_osgb36?: string;

  @Column({ type: 'int', nullable: true })
  os_net_web_id?: number;

  @Column({ type: 'boolean', nullable: true })
  permission_ind?: boolean;

  @Column({ type: 'enum', enum: TrigCondition, default: TrigCondition.UNKNOWN })
  condition: TrigCondition;

  @Column({ type: 'char', length: 6, nullable: true })
  postcode6?: string;

  @Column({ type: 'char', length: 20, nullable: true })
  county?: string;

  @Column({ type: 'char', length: 50, nullable: true })
  town?: string;

  @Exclude()
  @Column({ type: 'boolean', nullable: true, select: false })
  needs_attention?: boolean;

  @Exclude()
  @Column({ type: 'text', nullable: true, select: false })
  attention_comment?: string;

  // Maybe create abstract class for these columns?
  @Exclude()
  @CreateDateColumn({ select: false })
  crt_timestamp?: Date;

  @Exclude()
  @Column({ type: 'int', nullable: true, select: false })
  crt_user_id?: number; //TODO: foreign

  @Exclude()
  @Column({ type: 'char', length: 6, nullable: true, select: false })
  crt_ip_addr?: number; //TODO: type

  @Exclude()
  @Column({ type: 'int', nullable: true, select: false })
  admin_user_id?: number; //TODO: foreign

  @Exclude()
  @Column({
    type: 'timestamp without time zone',
    nullable: true,
    select: false,
  })
  admin_timestamp?: Date;

  @Exclude()
  @Column({ type: 'char', length: 6, nullable: true, select: false })
  admin_ip_addr?: number; //TODO: type

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
  uuid: string;

  // Foreign keys
  @OneToMany((type) => Log, (log) => log.id)
  @JoinColumn({ name: 'log_id' })
  logs: Log[];

  @OneToMany((type) => Photo, (photo) => photo.trig)
  photos: Photo[];
}
