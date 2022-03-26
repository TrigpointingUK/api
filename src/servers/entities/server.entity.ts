import { Photo } from "src/photos/entities/photo.entity";
import { Column, Entity, JoinColumn, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Server {
  @PrimaryGeneratedColumn('identity')
  id: number;

  @Column({ type: 'varchar', length: 100, nullable: false})
  url: string;

  @Column({ type: 'varchar', length: 100, nullable: false})
  path: string;

  @Column({ type: 'varchar', length: 100, nullable: false})
  description: string;


  @OneToMany(
    /* istanbul ignore next */ (type) => Photo,
    /* istanbul ignore next */ (photo) => photo.log,
  )
  @JoinColumn({ name: 'photo_id' })
  photos?: Photo[];
}