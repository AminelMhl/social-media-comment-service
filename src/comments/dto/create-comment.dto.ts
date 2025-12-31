import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCommentDto {
  @IsNotEmpty()
  postId!: string;

  @IsNotEmpty()
  content!: string;

  @IsOptional()
  @IsString()
  parentCommentId?: string;
}
