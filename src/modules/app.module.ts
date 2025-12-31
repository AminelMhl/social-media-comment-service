import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from '../comments/comment.entity';
import { CommentReaction } from '../comments/comment-reaction.entity';
import { CommentsService } from '../comments/comments.service';
import { CommentsController } from '../comments/comments.controller';
import { AuthService } from '../shared/auth.service';
import { UserClient } from '../shared/user.client';
import { PostClient } from '../shared/post.client';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'postgres',
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '5432', 10),
        username: process.env.DB_USER || 'social_user',
        password: process.env.DB_PASSWORD || 'social_pass',
        database: process.env.DB_NAME || 'social_db',
        entities: [Comment, CommentReaction],
        synchronize: true,
      }),
    }),
    TypeOrmModule.forFeature([Comment, CommentReaction]),
  ],
  controllers: [CommentsController],
  providers: [CommentsService, AuthService, UserClient, PostClient],
})
export class AppModule {}
