import { Artist } from 'src/artist/artist.entity';
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

  @Column({ type: 'date' })
  releaseDate: Date;

  @Column({ type: 'time' })
  duration: Date | string;

  @Column({ type: 'text' })
  lyrics: string;
}
