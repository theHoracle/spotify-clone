import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { LoginDTO } from './dto/login-dto';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { ArtistService } from 'src/artist/artist.service';
import * as speakeasy from 'speakeasy';
import { UpdateResult } from 'typeorm';
import { User } from 'src/users/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
    private artistService: ArtistService,
  ) {}
  async login(
    loginDTO: LoginDTO,
  ): Promise<
    { accessToken: string } | { validate2FA: string; message: string }
  > {
    const user = await this.userService.findOne(loginDTO);
    const passwordMatches = await bcrypt.compare(
      loginDTO.password,
      user.password,
    );
    if (passwordMatches) {
      delete user.password;
      const isArtist = await this.artistService.findArtist(user.id);
      //   create payload object
      const payload: Payload = {
        email: user.email,
        userId: user.id,
        username: user.username,
      };
      if (isArtist) {
        payload.artistId = isArtist.id;
      }
      if (user.enable2FA && user.twoFASecret) {
        return {
          validate2FA: 'http://localhost:3000/auth/validate-2fa',
          message:
            'Please send the One-Time-Passcode from your authenticator app',
        };
      }
      return {
        accessToken: this.jwtService.sign(payload),
      };
    }
    throw new UnauthorizedException('UNAUTHORIZED: Passwords do not match');
  }

  async enable2FA(userId: number): Promise<TEnable2FA> {
    const user = await this.userService.findById({ id: userId });
    if (user.enable2FA) {
      return {
        secret: user.twoFASecret,
      };
    }
    const secret = user.twoFASecret
      ? user.twoFASecret
      : speakeasy.generateSecret().base32;
    console.log(secret);
    await this.userService.updateSecretkey(userId, secret);
    return { secret: secret };
  }

  async validate2FAToken(
    userId: number,
    token: string,
  ): Promise<{ verified: boolean }> {
    const user = await this.userService.findById({ id: userId });
    const isVerified = speakeasy.totp.verify({
      secret: user.twoFASecret,
      encoding: 'base32',
      token,
    });
    return { verified: isVerified };
  }

  async disable2FA(userId: number): Promise<UpdateResult> {
    return await this.userService.disable2FA(userId);
  }

  async revoke2FAkey(userId: number): Promise<UpdateResult> {
    return await this.userService.revoke2FAKey(userId);
  }

  async validateApiKey(apiKey: string): Promise<User> {
    return await this.userService.validateApiKey(apiKey);
  }
}
