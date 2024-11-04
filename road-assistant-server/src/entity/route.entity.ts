import { CommentEntity } from '@/entity/comment.entity';
import { Coordinates, SignItem } from '@/entity/interface/sign-coord.interface';
import { UserEntity } from '@/entity/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('route')
export class RouteEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
  })
  text: string;

  @Column({
    type: 'json',
    default: () => "'[]'",
    name: 'recognized_signs',
    nullable: true,
  })
  recognizedSigns: Array<SignItem>;

  @Column({
    type: 'json',
    default: () => "'[]'",
    name: 'path_data',
    nullable: true,
  })
  pathData: Array<Coordinates>;

  @Column({
    name: 'user_id',
  })
  userId: string;

  @ManyToOne(() => UserEntity, (user) => user.routes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @OneToMany(() => CommentEntity, (comment) => comment.route)
  comments: Array<CommentEntity>;
}
