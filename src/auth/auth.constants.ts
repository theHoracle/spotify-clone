import { JwtModuleOptions } from '@nestjs/jwt';

export const authConstants: JwtModuleOptions = {
  secret: process.env.JWT_SECRET || 'secretKey',
  signOptions: {
    expiresIn: '1d',
  },
};
