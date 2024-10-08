import { Module } from '@nestjs/common';
import { PlaylistService } from './playlist.service';
import { PlaylistController } from './playlist.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Playlist } from './playlist.entity';
import { Song } from 'src/songs/song.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Playlist, Song])],
  providers: [PlaylistService],
  controllers: [PlaylistController],
  exports: [PlaylistService],
})
export class PlaylistModule {}
