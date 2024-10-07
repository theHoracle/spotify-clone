import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDTO } from 'src/users/dto/create-user-dto';
import { User } from 'src/users/user.entity';
import { UsersService } from 'src/users/users.service';
import { AuthService } from './auth.service';
import { LoginDTO } from './dto/login-dto';
import { JwtAuthGuard } from './jwt.guard';
import { ValidateTokenDTO } from './dto/validate-token-dto';
import { UpdateResult } from 'typeorm';

@Controller('auth')
export class AuthController {
  constructor(
    private userService: UsersService,
    private authService: AuthService,
  ) {}

  @Post('signup')
  signup(
    @Body()
    userDTO: CreateUserDTO,
  ): Promise<User> {
    return this.userService.create(userDTO);
  }

  @Post('login')
  login(
    @Body()
    loginDTO: LoginDTO,
  ): Promise<
    { accessToken: string } | { validate2FA: string; message: string }
  > {
    return this.authService.login(loginDTO);
  }

  @Get('enable-2fa')
  @UseGuards(JwtAuthGuard)
  enable2FA(
    @Request()
    request,
  ): Promise<{ secret: string }> {
    const { user } = request;
    console.log(user);
    return this.authService.enable2FA(user.userId);
  }

  @Get('disable-2fa')
  @UseGuards(JwtAuthGuard)
  disable2FA(
    @Request()
    request,
  ): Promise<UpdateResult> {
    const { user } = request;
    return this.authService.disable2FA(user.userId);
  }

  @Get('revoke-2fa')
  @UseGuards(JwtAuthGuard)
  revoke2FAKey(
    @Request()
    request,
  ): Promise<UpdateResult> {
    const { user } = request;
    return this.authService.revoke2FAkey(user.userId);
  }

  @Post('validate-2fa')
  @UseGuards(JwtAuthGuard)
  validate2FA(
    @Request()
    request,
    @Body()
    { token }: ValidateTokenDTO,
  ): Promise<{ verified: boolean }> {
    console.log(token);
    console.log(request.user);
    const { user } = request;
    return this.authService.validate2FAToken(user.userId, token);
  }
}
