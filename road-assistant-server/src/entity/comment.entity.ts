import { Coordinates } from '@/entity/interface/sign-coord.interface';
import { RouteEntity } from '@/entity/route.entity';
import { UserEntity } from '@/entity/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('comment')
export class CommentEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({
    nullable: false,
    name: 'created_at',
  })
  createdAt: Date;

  @Column({
    type: 'varchar',
  })
  text: string;

  @Column({
    name: 'route_id',
  })
  routeId: number;

  @Column({
    name: 'user_id',
  })
  userId: string;

  @Column({
    type: 'json',
    default: () => "'{}'",
    name: 'path_data',
    nullable: true,
  })
  coordinates: Coordinates;

  @ManyToOne(() => UserEntity, (user) => user.routes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @ManyToOne(() => RouteEntity, (route) => route.comments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'route_id' })
  route: RouteEntity;
}
