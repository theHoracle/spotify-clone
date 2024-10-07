import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDTO } from './dto/create-user-dto';
import * as bcrypt from 'bcryptjs';
import { LoginDTO } from 'src/auth/dto/login-dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(userDTO: CreateUserDTO) {
    const salt = await bcrypt.genSalt();
    userDTO.password = await bcrypt.hash(userDTO.password, salt);
    const newUser = await this.usersRepository.save(userDTO);
    delete newUser.password;
    return newUser;
  }

  async findOne(data: LoginDTO): Promise<User> {
    const user = await this.usersRepository.findOneBy({ email: data.email });
    if (!user) {
      throw new UnauthorizedException('USER NOT FOUND');
    }
    return user;
  }

  async findById(userId: Partial<User>): Promise<User> {
    return this.usersRepository.findOneBy({ id: userId.id });
  }

  async updateSecretkey(
    userId: number,
    secretkey: string,
  ): Promise<UpdateResult> {
    // const user = await this.usersRepository.findOneBy({ id: userId });
    // user.twoFASecret = secretkey;
    // user.enable2FA = true;
    // return this.usersRepository.save(user);
    return await this.usersRepository.update(
      { id: userId },
      {
        enable2FA: true,
        twoFASecret: secretkey,
      },
    );
  }

  async disable2FA(userId: number): Promise<UpdateResult> {
    return await this.usersRepository.update(
      { id: userId },
      {
        enable2FA: false,
      },
    );
  }

  async revoke2FAKey(userId: number): Promise<UpdateResult> {
    return await this.usersRepository.update(
      { id: userId },
      {
        enable2FA: false,
        twoFASecret: null,
      },
    );
  }
}
