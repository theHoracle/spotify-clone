import { Song } from 'src/songs/song.entity';
import { User } from 'src/users/user.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('playlists')
export class Playlist {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToMany(() => Song, (song) => song.playlists)
  @JoinTable({ name: 'playlist_songs' }) // Define the join table between playlists and songs
  songs: Song[];

  @ManyToOne(() => User, (user) => user.playlists)
  user: User;
}
