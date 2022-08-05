import { Exclude, Type } from 'class-transformer';

export class SerializeUserDto {
  id?: number;

  name?: string;

  email?: string;

  @Exclude()
  password?: string;

  @Exclude()
  role?: string;

  bossId?: number;

  @Type(() => SerializeUserDto)
  subordinates?: SerializeUserDto[];

  constructor(partial: Partial<SerializeUserDto>) {
    Object.assign(this, partial);
  }
}
