import { CommentEntity } from '@/entity/comment.entity';
import { RatingEntity } from '@/entity/rating.entity';
import { RouteEntity } from '@/entity/route.entity';
import { Column, Entity, OneToMany, OneToOne, PrimaryColumn } from 'typeorm';

export enum Gender {
  Male = 'Male',
  Female = 'Female',
  Other = 'Other',
}

@Entity('user_adc')
export class UserEntity {
  @PrimaryColumn({
    type: 'varchar',
    name: 'auth0_id',
    unique: true,
  })
  id: string;

  @Column({
    type: 'varchar',
    unique: true,
  })
  email: string;

  @Column({
    type: 'varchar',
    name: 'first_name',
    length: 100,
  })
  firstName: string;

  @Column({
    type: 'varchar',
    name: 'last_name',
    length: 100,
  })
  lastName: string;

  @Column({
    type: 'enum',
    enum: Gender,
  })
  gender: Gender;

  @Column({
    type: 'json',
    default: () => "'[]'",
    nullable: true,
  })
  settings: Array<string>;

  @OneToOne(() => RatingEntity, (rating) => rating.user)
  rating: RatingEntity;

  @OneToMany(() => RouteEntity, (route) => route.user)
  routes: Array<RouteEntity>;

  @OneToMany(() => CommentEntity, (comment) => comment.user)
  comments: Array<CommentEntity>;
}
