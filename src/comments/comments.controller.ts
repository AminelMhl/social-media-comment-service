import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post as HttpPost,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { JwtAuthGuard } from '../shared/jwt-auth.guard';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @UseGuards(JwtAuthGuard)
  @HttpPost()
  async create(@Req() req: any, @Body() body: CreateCommentDto) {
    const userId = req.user.sub as string;
    return this.commentsService.create(userId, body);
  }

  @Get('post/:postId')
  async getByPost(@Param('postId') postId: string, @Req() req: any) {
    const userId = req.user?.sub as string | undefined;
    return this.commentsService.findByPost(postId, userId);
  }

  @UseGuards(JwtAuthGuard)
  @HttpPost(':id/like')
  async like(@Param('id') id: string, @Req() req: any) {
    const userId = req.user.sub as string;
    await this.commentsService.setReaction(id, userId, 'like');
    return { success: true };
  }

  @UseGuards(JwtAuthGuard)
  @HttpPost(':id/dislike')
  async dislike(@Param('id') id: string, @Req() req: any) {
    const userId = req.user.sub as string;
    await this.commentsService.setReaction(id, userId, 'dislike');
    return { success: true };
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id/reaction')
  async clearReaction(@Param('id') id: string, @Req() req: any) {
    const userId = req.user.sub as string;
    await this.commentsService.clearReaction(id, userId);
    return { success: true };
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string, @Req() req: any) {
    const userId = req.user.sub as string;
    await this.commentsService.remove(id, userId);
    return { success: true };
  }
}
