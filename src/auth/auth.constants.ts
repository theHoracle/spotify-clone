import { JwtModuleOptions } from '@nestjs/jwt';

export const authConstants: JwtModuleOptions = {
  secret: 'HAD_12X£@',
  signOptions: {
    expiresIn: '1d',
  },
};
