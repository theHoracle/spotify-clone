import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SongsModule } from './songs/songs.module';
import { LoggerMiddleware } from './common/middleware/logger/logger.middleware';
import { PlaylistModule } from './playlist/playlist.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { Song } from './songs/song.entity';
import { ArtistModule } from './artist/artist.module';
import { UsersModule } from './users/users.module';
import { Artist } from './artist/artist.entity';
import { User } from './users/user.entity';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      database: 'nest-spotify-clone-db',
      host: 'localhost',
      port: 5432,
      username: 'thehoracle',
      type: 'postgres',
      entities: [Song, Artist, User],
      autoLoadEntities: true,
      synchronize: true,
    }),
    SongsModule,
    ArtistModule,
    UsersModule,
    AuthModule,
    // PlaylistModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  constructor(dataSource: DataSource) {
    console.log('DataSource: ', dataSource.driver.database);
  }
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes({ path: 'songs', method: RequestMethod.POST });
  }
}
