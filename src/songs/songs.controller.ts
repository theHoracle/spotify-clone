import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { SongsService } from './songs.service';
import { CreateSongDTO } from './dto/create-song-dto';
import { Song } from './song.entity';
import { UpdateResult } from 'typeorm';
import { Pagination } from 'nestjs-typeorm-paginate';
import { ArtistJwtGuard } from 'src/auth/artist-jwt.guard';
import { ApiTags } from '@nestjs/swagger';

@Controller('songs')
@ApiTags('songs')
export class SongsController {
  constructor(private songsService: SongsService) {}
  @Post()
  @UseGuards(ArtistJwtGuard)
  create(@Body() createSongDTO: CreateSongDTO) {
    return this.songsService.create(createSongDTO);
  }
  @Get()
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
  ): Promise<Pagination<Song>> {
    limit = limit > 100 ? 100 : limit;
    try {
      return this.songsService.paginate({
        page,
        limit,
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR, {
        cause: error,
      });
    }
  }
  @Get(':id')
  findOne(
    @Param(
      'id',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: number,
  ): Promise<Song> {
    console.log(`Find one song endpoint with id ${typeof id}`);
    return this.songsService.findOne(id);
  }
  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateSongDTO: CreateSongDTO,
  ): Promise<UpdateResult> {
    return this.songsService.update(id, updateSongDTO);
  }
  @Delete(':id')
  delete(
    @Param(
      'id',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: number,
  ) {
    return this.songsService.remove(id);
  }
}
