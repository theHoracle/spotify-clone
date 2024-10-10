import { plainToInstance } from 'class-transformer';
import { IsEnum, IsNumber, IsString, validateSync } from 'class-validator';

enum Environments {
  DEVELOPMENT = 'development',
  PRODUCTION = 'production',
  TEST = 'test',
  PROVISION = 'provision',
}

class EnvironmentVariables {
  @IsEnum(Environments)
  NODE_ENV: Environments; // = Environments.DEVELOPMENT;

  @IsNumber()
  PORT: number; // = 3000;

  @IsString()
  DB_HOST: string; // = 'localhost';

  @IsNumber()
  DB_PORT: number;

  @IsString()
  DB_NAME: string; // = 'test';

  @IsString()
  DB_USER: string;

  @IsString()
  DB_PASSWORD: string;

  @IsString()
  JWT_SECRET: string; // = 'secret';
}

export function validate(config: Record<string, unknown>) {
  //   console.log('config: ', config);
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    //  Will  tell class-transformer that if it sees a primitive that is currently
    //  stored as a string in the configuration file, it should convert it to the
    //  corresponding primitive type. even though @Type(() => Number) or @Type(() => Boolean) isn't used
    enableImplicitConversion: true,
  });
  console.log('validatedConfig: ', validatedConfig);

  // Perform validation synchronously, throw an exception if any validation fails
  // It ignores async validations, if you want to handle them you can use validate method instead
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length) {
    throw new Error(errors.toString());
  }
  return validatedConfig;
}
