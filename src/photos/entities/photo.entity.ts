import { Exclude } from 'class-transformer';
import { Licence, LogSource, PhotoType } from 'src/enum_types';
import { Log } from 'src/logs/entities/log.entity';
import { Server } from 'src/servers/entities/server.entity';
import { Trig } from 'src/trigs/entities/trig.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Index,
  Generated,
  VersionColumn,
  CreateDateColumn,
  DeleteDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Photo {
  @PrimaryGeneratedColumn('identity')
  id: number;

  @ManyToOne(
    /* istanbul ignore next */ (type) => Trig,
    /* istanbul ignore next */ (trig) => trig.id,
  )
  @JoinColumn({ name: 'trig_id' })
  @Index()
  trig: Trig;

  @ManyToOne(
    /* istanbul ignore next */ (type) => User,
    /* istanbul ignore next */ (user) => user.id,
  )
  @JoinColumn({ name: 'user_id' })
  @Index()
  user: User;

  @ManyToOne(
    /* istanbul ignore next */ (type) => Log,
    /* istanbul ignore next */ (log) => log.id,
  )
  @JoinColumn({ name: 'log_id' })
  @Index()
  log: Log;


  @ManyToOne(
    /* istanbul ignore next */ (type) => Server,
    /* istanbul ignore next */ (server) => server.id,
  )
  @JoinColumn({ name: 'server_id' })
  @Index()
  server: Server;

  @Column({ type: 'text', nullable: true})
  caption?: string;

  @Column({ type: 'text', nullable: true })
  description?: string;


  @Column({ type: 'integer' })
  width: number;

  @Column({ type: 'integer' })
  height: number;

  @Column({ type: 'text' })
  filename: string;

  @Column({ type: 'integer' })
  filesize: number;

  @Column({ type: 'integer' })
  icon_width: number;

  @Column({ type: 'integer' })
  icon_height: number;

  @Column({ type: 'text' })
  icon_filename: string;

  @Column({ type: 'integer' })
  icon_filesize: number;

  @Column({ type: 'enum', enum: Licence, default: Licence.PRIVATE })
  licence: Licence;

  @Column({ type: 'enum', enum: LogSource, default: LogSource.UNKNOWN })
  source: LogSource;

  @Column({ type: 'enum', enum: PhotoType, default: PhotoType.UNKNOWN })
  type: PhotoType;


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

}
