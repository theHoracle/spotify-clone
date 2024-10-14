import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { Playlist } from 'src/playlist/playlist.entity';
import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity('users')
export class User {
  // Use 'uuid' as the type to generate UUID-based primary keys
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    example: 'user@example.com',
    description: 'The email of the User',
  })
  @Column({ unique: true })
  email: string;

  @ApiProperty({
    example: 'john_doe',
    description: 'The username of the User',
  })
  @Column()
  username: string;

  @ApiProperty({
    example: 'John',
    description: 'The first name of the User',
  })
  @Column()
  firstName: string;

  @ApiProperty({
    example: 'Doe',
    description: 'The last name of the User',
  })
  @Column()
  lastName: string;

  @ApiProperty({
    example: 'password123',
    description: 'The password of the User',
  })
  @Column()
  @Exclude()
  password: string;

  @Column({ nullable: true, type: 'text' })
  twoFASecret: string;

  @Column({ default: false, type: 'boolean' })
  enable2FA: boolean;

  @Column({ default: '' })
  apiKey: string;

  // Auto-generate creation timestamp
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @OneToMany(() => Playlist, (playlist) => playlist.user)
  playlists: Playlist[];
}
