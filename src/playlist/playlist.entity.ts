import { Song } from 'src/songs/song.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('playlists')
export class Playlist {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;
  // incomplete, each playlst will have multiple songs
  @OneToMany(() => Song, (song) => song)
  songs: Song[];

  // @OneToMany(() => User, (user) => user.playlist)
  // user: User
}
