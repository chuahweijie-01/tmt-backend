import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '@user/user.service';
import { LoginUserDto } from './dto/login-user.dto';
import { LoginPayload } from './types/login-payload';
import * as bcrypt from 'bcryptjs';
import { UserDocument } from '@common/types/user-document';

@Injectable()
export class AuthService {
  constructor(
    private JwtService: JwtService,
    private UserService: UserService,
  ) {}

  async validateUser(loginUser: LoginUserDto): Promise<UserDocument> {
    const existingUser = await this.UserService.findOneByEmail(loginUser.email);

    if (!existingUser) {
      throw new Error('User not found.');
    }

    const isPasswordValid = await bcrypt.compare(
      loginUser.password,
      existingUser.password,
    );

    if (!isPasswordValid) {
      throw new Error('Invalid password.');
    }
    return existingUser;
  }

  login(user: UserDocument): string {
    const payload: LoginPayload = {
      username: user.username,
      sub: user._id.toString(),
    };
    return this.JwtService.sign(payload);
  }
}
