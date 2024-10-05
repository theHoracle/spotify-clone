import {
  IsArray,
  IsDateString,
  IsNotEmpty,
  IsString,
  Matches,
} from 'class-validator';

export class CreateSongDTO {
  @IsString()
  @IsNotEmpty()
  readonly title: string;

  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  readonly artist: string[];

  @IsString()
  @IsNotEmpty()
  readonly album: string;

  @IsNotEmpty()
  @IsDateString()
  readonly releaseDate: Date;

  @Matches(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/, {
    message: 'Duration must be in HH:MM:SS format',
  })
  @IsNotEmpty()
  readonly duration: string;
}
