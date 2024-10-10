import { Artist } from 'src/artist/artist.entity';
import { Playlist } from 'src/playlist/playlist.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('song')
export class Song {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @ManyToMany(() => Artist, (artist) => artist.songs, { cascade: true })
  @JoinTable({ name: 'song_artists' })
  artists: Artist[];

  @ManyToMany(() => Playlist, (playlist) => playlist.songs)
  playlists: Playlist[];

  @Column({ type: 'date' })
  releaseDate: Date;

  @Column({ type: 'time' })
  duration: Date | string;

  @Column({ type: 'text' })
  lyrics: string;
}
