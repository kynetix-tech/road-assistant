import { UserEntity } from '@/entity/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('rating')
export class RatingEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'real',
  })
  accuracy: number;

  @Column({
    type: 'int',
    name: 'recognized_signs',
  })
  recognizedSigns: number;

  @Column({
    type: 'int',
    name: 'added_comments',
  })
  addedComments: number;

  @Column({
    name: 'user_id',
  })
  userId: string;

  @OneToOne(() => UserEntity, (user) => user.rating, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;
}
