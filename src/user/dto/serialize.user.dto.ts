import { Exclude } from 'class-transformer';

export class SerializeUserDto {
  id?: number;
  name?: string;
  email?: string;

  @Exclude()
  password?: string;
  role?: string;
  bossId?: number;

  constructor(partial: Partial<SerializeUserDto>) {
    Object.assign(this, partial);
  }
}
