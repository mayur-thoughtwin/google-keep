import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async validateUser(googleId: string, email: string, name: string, picture: string): Promise<User> {
    let user = await this.userRepository.findOne({ where: { googleId } });

    if (!user) {
      // Check if user exists with email but no googleId
      user = await this.userRepository.findOne({ where: { email } });
      
      if (user) {
        // Link existing user to Google account
        user.googleId = googleId;
        user.name = name;
        user.picture = picture;
      } else {
        // Create new user
        user = this.userRepository.create({
          googleId,
          email,
          name,
          picture,
        });
      }
      
      await this.userRepository.save(user);
    }

    return user;
  }

  async login(user: User) {
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        picture: user.picture,
      },
    };
  }

  async findUserById(id: number): Promise<User | null> {
    return this.userRepository.findOne({ where: { id } });
  }
} 