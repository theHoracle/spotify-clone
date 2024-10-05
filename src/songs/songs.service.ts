import { Injectable } from '@nestjs/common';

@Injectable()
export class SongsService {
  // local db
  // local array

  private readonly songs = [];

  create(song) {
    // save the song in the db
    this.songs.push(song);
  }
  findAll(): any[] {
    // fetch all from the db
    return this.songs;
  }
  findOne(id): any {
    return this.songs.find((song, index) => index === id);
  }
  update(id, song) {
    const index = this.songs.findIndex((song) => song.id === id);
    this.songs[index] = song;
  }
  remove(id) {
    const index = this.songs.findIndex((song) => song.id === id);
    this.songs.splice(index, 1);
  }
}
