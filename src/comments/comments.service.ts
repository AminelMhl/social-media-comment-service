import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './comment.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UserClient } from '../shared/user.client';
import { PostClient } from '../shared/post.client';
import { CommentReaction, CommentReactionValue } from './comment-reaction.entity';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentsRepository: Repository<Comment>,
    @InjectRepository(CommentReaction)
    private readonly reactionsRepository: Repository<CommentReaction>,
    private readonly userClient: UserClient,
    private readonly postClient: PostClient,
  ) {}

  async create(userId: string, data: CreateCommentDto): Promise<Comment> {
    const post = await this.postClient.getPostById(data.postId);
    if (!post) {
      throw new NotFoundException('Post not found');
    }

    const comment = this.commentsRepository.create({
      postId: data.postId,
      userId,
      content: data.content,
      parentCommentId: data.parentCommentId ?? null,
    });
    return this.commentsRepository.save(comment);
  }

  async findByPost(postId: string, currentUserId?: string): Promise<any[]> {
    const comments = await this.commentsRepository.find({
      where: { postId },
      order: { createdAt: 'ASC' },
    });
    const results = await Promise.all(
      comments.map(async (comment) => {
        const author = await this.userClient.getUserById(comment.userId);
        const { likes, dislikes, currentUserReaction } =
          await this.getReactionsForComment(comment.id, currentUserId);
        return {
          ...comment,
          author,
          likes,
          dislikes,
          currentUserReaction,
        };
      }),
    );
    return results;
  }

  async remove(id: string, userId: string): Promise<void> {
    const comment = await this.commentsRepository.findOne({ where: { id } });
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }
    if (comment.userId !== userId) {
      throw new ForbiddenException('Cannot delete this comment');
    }
    await this.reactionsRepository.delete({ commentId: id });
    await this.commentsRepository.delete({ parentCommentId: id });
    await this.commentsRepository.delete(id);
  }

  async setReaction(
    commentId: string,
    userId: string,
    value: CommentReactionValue,
  ): Promise<void> {
    const comment = await this.commentsRepository.findOne({
      where: { id: commentId },
    });
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }
    const existing = await this.reactionsRepository.findOne({
      where: { commentId, userId },
    });
    if (existing) {
      existing.value = value;
      await this.reactionsRepository.save(existing);
    } else {
      const reaction = this.reactionsRepository.create({
        commentId,
        userId,
        value,
      });
      await this.reactionsRepository.save(reaction);
    }
  }

  async clearReaction(commentId: string, userId: string): Promise<void> {
    await this.reactionsRepository.delete({ commentId, userId });
  }

  private async getReactionsForComment(
    commentId: string,
    currentUserId?: string,
  ): Promise<{
    likes: number;
    dislikes: number;
    currentUserReaction: CommentReactionValue | null;
  }> {
    const reactions = await this.reactionsRepository.find({
      where: { commentId },
    });
    let likes = 0;
    let dislikes = 0;
    let currentUserReaction: CommentReactionValue | null = null;
    reactions.forEach((r) => {
      if (r.value === 'like') {
        likes += 1;
      } else if (r.value === 'dislike') {
        dislikes += 1;
      }
      if (currentUserId && r.userId === currentUserId) {
        currentUserReaction = r.value;
      }
    });
    return { likes, dislikes, currentUserReaction };
  }
}
