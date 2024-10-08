import { Song } from 'src/songs/song.entity';
import { User } from 'src/users/user.entity';
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

  @OneToMany(() => User, (user) => user.playlists)
  user: User;
}
