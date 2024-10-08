import { EntityManager } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { faker } from '@faker-js/faker';
import { User } from 'src/users/user.entity';
import { v4 as uuidv4 } from 'uuid';
import { Artist } from 'src/artist/artist.entity';
import { Playlist } from 'src/playlist/playlist.entity';
import { Song } from 'src/songs/song.entity';

export const seedData = async (manager: EntityManager): Promise<void> => {
  await seedPlaylist();

  async function seedUser() {
    const salt = await bcrypt.genSalt();
    const encryptedPassword = await bcrypt.hash('123456', salt);

    const user = new User();
    user.username = faker.person.middleName();
    user.firstName = faker.person.firstName();
    user.lastName = faker.person.lastName();
    user.email = faker.internet.email();
    user.password = encryptedPassword;
    user.apiKey = uuidv4();
    return await manager.save(user);
  }

  async function seedArtist() {
    const user = await seedUser();
    console.log(user);
    const artist = new Artist();
    artist.user = user;
    console.log(artist)
    return await manager.getRepository(Artist).save(artist);
  }

  async function seedSongs() {
    const song = new Song();
    song.title = faker.music.songName();
    song.artists = [await seedArtist(), await seedArtist()];
    song.duration = '03:25';
    song.lyrics = faker.lorem.paragraphs(10);
    song.releaseDate = faker.date.past();

    return await manager.getRepository(Song).save(song);
  }

  async function seedPlaylist() {
    const user = await seedUser();
    const playlist = new Playlist();
    playlist.user = user;
    playlist.name = faker.music.genre();
    playlist.songs = [await seedSongs(), await seedSongs()];

    await manager.getRepository(Playlist).save(playlist);
  }
};
