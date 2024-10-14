import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  TypeOrmModuleAsyncOptions,
  TypeOrmModuleOptions,
} from '@nestjs/typeorm';
import { Artist } from 'src/artist/artist.entity';
import { Playlist } from 'src/playlist/playlist.entity';
import { Song } from 'src/songs/song.entity';
import { User } from 'src/users/user.entity';
import { DataSource, DataSourceOptions } from 'typeorm';

export const typeOrmAsyncConfig: TypeOrmModuleAsyncOptions = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: async (
    configService: ConfigService,
  ): Promise<TypeOrmModuleOptions> => {
    return {
      database: configService.get('dbName'),
      host: configService.get('dbHost'),
      port: configService.get('dbPort'),
      username: configService.get('dbUser'),
      password: configService.get('dbPass'),
      type: 'postgres',
      entities: [User, Song, Playlist, Artist],
      synchronize: false,
      migrations: ['dist/db/migrations/*.js'],
    };
  },
};

export const dataSourceOptions: DataSourceOptions = {
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  username: process.env.DB_USER,
  type: 'postgres',
  entities: ['dist/**/*.entity.js'],
  synchronize: false,
  migrations: ['dist/db/migrations/*.js'],
};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
