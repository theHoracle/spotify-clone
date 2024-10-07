import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { LoginDTO } from './dto/login-dto';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { ArtistService } from 'src/artist/artist.service';
@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
    private artistService: ArtistService,
  ) {}
  async login(loginDTO: LoginDTO): Promise<{ accessToken: string }> {
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
      return {
        accessToken: this.jwtService.sign(payload),
      };
    }
    throw new UnauthorizedException('UNAUTHORIZED: Passwords do not match');
  }
}
