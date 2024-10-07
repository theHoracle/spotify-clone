import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-http-bearer';
import { AuthService } from './auth.service';

@Injectable()
export class ApiKeyStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }
  async validate(apiKey: string) {
    const user = await this.authService.validateApiKey(apiKey);
    if (!user) {
      throw new UnauthorizedException('INVALID API TOKEN');
    } else {
      delete user.password;
      return user;
    }
  }
}
