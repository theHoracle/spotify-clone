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
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(
    private userService: UsersService,
    private authService: AuthService,
  ) {}

  @Post('signup')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({
    status: 201,
    description: 'User created successfully',
    type: User,
  })
  signup(
    @Body()
    userDTO: CreateUserDTO,
  ): Promise<User> {
    return this.userService.create(userDTO);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login a user' })
  @ApiResponse({
    status: 200,
    description: 'User logged in successfully',
    type: String,
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid credentials',
  })
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

  @Get('profile')
  @UseGuards(AuthGuard('bearer'))
  getProfile(@Request() req) {
    return {
      message: 'Authenticated with API key',
      user: req.user,
    };
  }
}
