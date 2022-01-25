import { Exclude, Expose } from 'class-transformer';
import { Log } from 'src/logs/entities/log.entity';
import { Photo } from 'src/photos/entities/photo.entity';
import { Licence, Status, Units } from 'src/enum_types';

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  DeleteDateColumn,
  Generated,
  UpdateDateColumn,
  VersionColumn,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity()
@Exclude()
export class User {
  @Expose()
  @PrimaryGeneratedColumn()
  id: number;

  @Expose()
  @Index({ unique: true })
  @Column({ type: 'varchar', length: 50, nullable: false })
  nickname: string;

  @Index({ unique: true })
  @Column({ type: 'varchar', length: 50, nullable: true })
  email?: string;

  @Column({ type: 'boolean', default: false })
  email_verified?: boolean;

  @Index({ unique: true })
  @Column({ type: 'varchar', length: 256, nullable: true })
  oauth?: string;

  @Expose()
  @Column({ type: 'varchar', length: 50, nullable: true })
  firstname?: string;

  @Expose()
  @Column({ type: 'varchar', length: 50, nullable: true })
  lastname?: string;

  @Expose()
  @Column({ type: 'text', nullable: true })
  about?: string;

  @Expose()
  @Column({ type: 'varchar', length: 1024, nullable: true })
  homepage?: string;

  @Expose()
  @Column({ type: 'varchar', length: 1024, nullable: true })
  avatar?: string;

  @Column({ type: 'enum', enum: Units, default: Units.METRIC })
  units: Units;

  @Column({ type: 'enum', enum: Status, default: Status.CONTROVERSIAL })
  status_max: Status;

  @Column({ type: 'enum', enum: Licence, default: Licence.BY_ATTRIBUTION })
  licence_default: Licence;

  @Column({ type: 'bigint', nullable: true })
  mobile_number?: number;

  @Column({ type: 'varchar', length: 64, nullable: true, select: false })
  cryptpw?: string;

  @CreateDateColumn({ select: false })
  crt_timestamp?: Date;

  @UpdateDateColumn({ select: false })
  upd_timestamp?: Date;

  @DeleteDateColumn({ select: false })
  deletedAt?: Date;

  @VersionColumn({ type: 'numeric', default: 0, select: false })
  upd_count?: number;

  @Column()
  @Generated('uuid')
  uuid: string;

  // Foreign keys
  @OneToMany((type) => Log, (log) => log.id)
  @JoinColumn({ name: 'log_id' })
  logs: Log[];

  @OneToMany((type) => Photo, (photo) => photo.user)
  photos: Photo[];

  // TODO: allow for arbitrary number of bookmarked locations
}
