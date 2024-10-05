import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Playlist } from './playlist.entity';
import { CreatePlaylistDTO } from './dto/create-playlist-dto';
import { Song } from 'src/songs/song.entity';

@Injectable()
export class PlaylistService {
  constructor(
    @InjectRepository(Playlist)
    private playlistRepo: Repository<Playlist>,

    @InjectRepository(Song)
    private songRepo: Repository<Song>,
  ) {}

  async create(playlistDTO: CreatePlaylistDTO): Promise<Playlist> {
    const playlist = new Playlist();
    playlist.name = playlistDTO.name;

    // song s will be the array of ids rhat we are gettin from the DTO object
    const songs = await this.songRepo.findByIds(playlistDTO.songs);
    // set the relation for the songs with the playlist entity
    playlist.songs = songs;

    // A user will be the id of the iser we are getting form the request
    // when we implement the user auth this id will hecomen the logged in user
    // const user = await this.userRepo.findOneBy({id: playlistDTO.userId});
    // playlist.user = user

    return this.playlistRepo.save(playlist);
  }
}
