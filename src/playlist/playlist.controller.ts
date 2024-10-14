import { Body, Controller, Post } from '@nestjs/common';
import { PlaylistService } from './playlist.service';
import { Playlist } from './playlist.entity';
import { CreatePlaylistDTO } from './dto/create-playlist-dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('playlist')
@ApiTags('playlist')
export class PlaylistController {
  constructor(private playlistService: PlaylistService) {}
  @Post()
  create(@Body() createPlaylistDto: CreatePlaylistDTO): Promise<Playlist> {
    return this.playlistService.create(createPlaylistDto);
  }
}
