import { Injectable } from '@nestjs/common';
import { DeleteResult, In, Repository, UpdateResult } from 'typeorm';
import { Song } from './song.entity';
import { CreateSongDTO } from './dto/create-song-dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateSongDTO } from './dto/update-song-dto';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { Artist } from 'src/artist/artist.entity';

@Injectable()
export class SongsService {
  // local db
  constructor(
    @InjectRepository(Song)
    private songRepository: Repository<Song>,
    @InjectRepository(Artist)
    private artistRepository: Repository<Artist>,
  ) {}
  async paginate(options: IPaginationOptions): Promise<Pagination<Song>> {
    const queryBuilder = this.songRepository.createQueryBuilder('c');
    queryBuilder.orderBy('c.releaseDate', 'DESC');
    return paginate<Song>(queryBuilder, options);
  }

  async create(songDTO: CreateSongDTO): Promise<Song> {
    const song = new Song();

    song.title = songDTO.title;
    song.duration = songDTO.duration;
    song.lyrics = songDTO.lyrics;
    song.releaseDate = songDTO.releaseDate;
    // find all artist based on id
    const artists = await this.artistRepository.findBy({
      id: In(songDTO.artists),
    });
    // set the relation with artist and songs
    song.artists = artists;
    return await this.songRepository.save(song);
  }
  findAll(): Promise<Song[]> {
    // fetch all from the db
    return this.songRepository.find();
  }
  findOne(id: number): Promise<Song> {
    return this.songRepository.findOneBy({ id });
  }
  update(id: number, updateSongDTO: UpdateSongDTO): Promise<UpdateResult> {
    return this.songRepository.update(id, updateSongDTO);
  }
  remove(id: number): Promise<DeleteResult> {
    return this.songRepository.delete({ id });
  }
}
