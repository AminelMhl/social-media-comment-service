import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

export type CommentReactionValue = 'like' | 'dislike';

@Entity({ name: 'comment_reactions' })
@Unique(['commentId', 'userId'])
export class CommentReaction {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  commentId!: string;

  @Column()
  userId!: string;

  @Column()
  value!: CommentReactionValue;

  @CreateDateColumn()
  createdAt!: Date;
}

