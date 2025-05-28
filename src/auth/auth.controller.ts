import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-user.dto';
import { LoginUserResponse } from './types/login-user-response';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() body: LoginUserDto) {
    const user = await this.authService.validateUser(body);
    if (!user) throw new UnauthorizedException();
    const token = this.authService.login(user);

    return {
      username: user.username,
      email: user.email,
      id: user._id,
      token: token,
    } as LoginUserResponse;
  }
}
