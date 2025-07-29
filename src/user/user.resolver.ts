import { Resolver, Query } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { GraphQLJwtAuthGuard } from '../auth/guards/graphql-jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Resolver(() => User)
export class UserResolver {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  @Query(() => User, { nullable: true })
  @UseGuards(GraphQLJwtAuthGuard)
  async me(@CurrentUser() user: any): Promise<User | null> {
    return this.userRepository.findOne({ where: { id: user.userId } });
  }

  @Query(() => [User])
  @UseGuards(GraphQLJwtAuthGuard)
  async users(): Promise<User[]> {
    return this.userRepository.find();
  }
}
