import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
}
